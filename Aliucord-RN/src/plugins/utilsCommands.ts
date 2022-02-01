import { getToken } from "../api//token";
import { sendReply } from "../api/clyde";
import { registerCommands, section } from "../api/commands";
import { getBuild, getDevice, getSystemVersion, getVersion, reloadDiscord } from "../api/native";
import { ApplicationCommandOptionType, ApplicationCommandInputType, ApplicationCommandType, Command } from "aliucord-api/dist/types/commands";

import { connectWebsocket, sendMessage } from "./websocketDebug";

export function injectCommands() {
  const aliucordCommands: Command[] = [{
    id: "websocket-devtools",
    name: "websocket",
    description: "Connect to the websocket devtools.",
    applicationId: section.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    options: [{
      name: "host",
      description: "Host of the debugger.",
      type: ApplicationCommandOptionType.String,
      required: true,
    }],

    execute: (args) => {
      const host = args[0].value;
      connectWebsocket(host);
    },
  }, {
    id: "debug-command",
    name: "debug",
    description: "Print out your device information.",
    applicationId: section.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltInText,

    execute: () => {
      let content = "**Debug Info:**\n";
      content += `> Discord: ${getVersion()} (${getBuild()})\n`;
      content += `> Device: ${getDevice()}\n`;
      content += `> System: ${getSystemVersion()}\n`;

      return {
        content
      };
    }
  }, {
    id: "reload-command",
    name: "reload",
    description: "Reload Discord.",
    applicationId: section.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    execute: function(args) {
      reloadDiscord();
    }
  }, {
    id: "token-command",
    name: "token",
    description: "Show your Discord'token.",
    applicationId: section.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    execute: function(args, message) {
      const token = getToken();
      const channeld = message.channel.id;
      sendReply(channeld, `\`${token}\``);
    }
  }, {
    id: "dump-command",
    name: "dump",
    description: "Dump Discord's modules.",
    applicationId: section.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    execute: function(args, message) {
      const channeld = message.channel.id;
      const modules = window["modules"];

      const prettyStringify = (input) => {
        let cache = [];

        return JSON.stringify(input, (key, value) => {
          try {
            if (typeof value === 'object' && value !== null) {
              if (cache.includes(value)) return;
              cache.push(value);
            }

            if (typeof value === "function" && value !== null) {
              if (cache.includes(key)) return;
              cache.push(key);
              return "[Function]";
            }

            return value;
          } catch(err) {}
        });
      };

      for (const m of Object.keys(modules)) {
        try {
          const module = modules[m];
          const dumpedModule = {
            id: m
          };

          if (module.publicModule.exports) {
            if (typeof module.publicModule.exports === "function") {
              dumpedModule["exports"] = `[Function: ${module.publicModule.exports.name}]`;
            } else {
              dumpedModule["exports"] = JSON.parse(prettyStringify(module.publicModule.exports));
            }
          }

          if (module.publicModule?.exports.default) {
            if (typeof module.publicModule.exports.default === "function") {
              dumpedModule["default"] = `[Function: ${module.publicModule.exports.default.name}]`;
              dumpedModule["prototype"] = Object.getOwnPropertyNames(module.publicModule.exports.default.prototype);
            } else {
              dumpedModule["default"] = Object.keys(module.publicModule.exports.default);
            }
          }

          sendMessage(JSON.stringify(dumpedModule, null, "\t"));
        } catch(err) {
          console.log(`Couldn't dump module ${m}`);
          console.log(err);
        }
      }

      sendReply(channeld, "Modules has been dumped.");
    }
  }];

  registerCommands("aliucord", aliucordCommands);
}
