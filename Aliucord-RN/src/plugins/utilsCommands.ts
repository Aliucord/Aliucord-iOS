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

    execute: function (args) {
      reloadDiscord();
    }
  }, {
    id: "token-command",
    name: "token",
    description: "Show your Discord'token.",
    applicationId: section.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    execute: function (args, message) {
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

    execute: function (args, message) {
      const channeld = message.channel.id;
      const modules = window["modules"];

      function parseValue(value) {
        if (typeof value === "function") {
          return value.toString();
        } else if (Array.isArray(value)) {
          return value.map(parseValue);
        } else if (typeof value === "object") {
          const output = {};

          for (const key in value) {
            output[key] = parseValue(value[key]);
          }

          return output;
        }

        return value;
      }

      for (const m of Object.keys(modules)) {
        try {
          const module = modules[m];
          const dumpedModule = { id: m };

          if (!module.publicModule?.exports) continue;

          const exports = module.publicModule.exports;

          for (const key of Object.keys(module.publicModule.exports)) {
            dumpedModule[key] = parseValue(exports[key]);
          }

          sendMessage(JSON.stringify(dumpedModule, null, "\t"));
        } catch (err) {
          console.log(`Couldn't dump module ${m}`);
          console.log(err);
        }
      }

      sendReply(channeld, "Modules has been dumped.");
    }
  }];

  registerCommands("aliucord", aliucordCommands);
}
