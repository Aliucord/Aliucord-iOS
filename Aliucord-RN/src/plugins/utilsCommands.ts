import { getToken } from "aliucord-api/dist/modules/token";
import { sendReply } from "aliucord-api/dist/modules/clyde";
import { AliucordSectionID, registerCommands } from "aliucord-api/dist/modules/commands";
import { getBuild, getDevice, getSystemVersion, getVersion, reloadDiscord } from "aliucord-api/dist/modules/native";
import { ApplicationCommandOptionType, ApplicationCommandInputType, ApplicationCommandType, Command } from "aliucord-api/dist/types/commands";

import { connectWebsocket } from "./websocketDebug";

export function injectCommands() {
  const aliucordCommands: Command[] = [{
    id: "websocket-devtools",
    name: "websocket",
    description: "Connect to the websocket devtools.",
    applicationId: AliucordSectionID,

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
    applicationId: AliucordSectionID,

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
    applicationId: AliucordSectionID,

    type: ApplicationCommandType.Chat,
    inputType: ApplicationCommandInputType.BuiltIn,

    execute: function(args) {
      reloadDiscord();
    }
  }, {
    id: "token-command",
    name: "token",
    description: "Show your Discord'token.",
    applicationId: AliucordSectionID,

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
