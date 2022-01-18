import { getModule } from "../utils/modules";
import { connectWebsocket } from "./websocketDebug";

import { ApplicationCommandOptionType, ApplicationCommandTarget, ApplicationCommandType, Command } from "../types/commands";

export function injectCommands() {
  const commandsModule = getModule(m => m.getBuiltInCommands, false);

  // Add commands
  const aliucordCommands: Command[] = [{
    id: "websocket-devtools",
    name: "websocket",
    description: "Connect to the websocket devtools.",
    applicationId: "-3",

    target: ApplicationCommandTarget.Chat,
    type: ApplicationCommandType.BuiltIn,

    options: [{
      name: "host",
      description: "Host of the debugger.",
      type: ApplicationCommandOptionType.String,
      required: true,
    }],

    execute: function (args, message) {
      const host = args[0].value;

      connectWebsocket(host);
    },
  }];

  commandsModule.exports.BUILT_IN_COMMANDS_ORIGINAL.push(...aliucordCommands);
  commandsModule.exports.BUILT_IN_COMMANDS.push(...aliucordCommands);
}
