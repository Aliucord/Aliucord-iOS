import { getToken } from "../api//token";
import { sendReply } from "../api/clyde";
import { registerCommands } from "../api/commands";
import { getBuild, getDevice, getSystemVersion, getVersion, reloadDiscord } from "../api/native";
import { ApplicationCommandOptionType, ApplicationCommandInputType, ApplicationCommandType, Command } from "aliucord-api/dist/types/commands";

import { connectWebsocket } from "./websocketDebug";
import { aliucordSection } from "./pluginsManager";

export function injectCommands() {
  const aliucordCommands: Command[] = [{
    id: "websocket-devtools",
    name: "websocket",
    description: "Connect to the websocket devtools.",
    applicationId: aliucordSection.id,

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
    applicationId: aliucordSection.id,

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
    applicationId: aliucordSection.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    execute: function(args) {
      reloadDiscord();
    }
  }, {
    id: "token-command",
    name: "token",
    description: "Show your Discord'token.",
    applicationId: aliucordSection.id,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    execute: function(args, message) {
      const token = getToken();
      const channeld = message.channel.id;
      sendReply(channeld, `\`${token}\``);
    }
  }];

  registerCommands(aliucordCommands);
}
