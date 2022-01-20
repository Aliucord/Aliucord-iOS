import { Commands } from "aliucord-api";
import { ApplicationCommandOptionType, ApplicationCommandTarget, ApplicationCommandType, Command } from "aliucord-api/dist/types/commands";

import { getModule } from "../utils/modules";
import { connectWebsocket } from "./websocketDebug";

export function injectCommands() {
  const aliucordCommands: Command[] = [{
    id: "websocket-devtools",
    name: "websocket",
    description: "Connect to the websocket devtools.",
    applicationId: Commands.AliucordSectionID,

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
  }, {
    id: "debug-command",
    name: "doctor",
    description: "Print out your device information.",
    applicationId: Commands.AliucordSectionID,

    target: ApplicationCommandTarget.Chat,
    type: ApplicationCommandType.BuiltInText,

    execute: function(args) {
      const nativeModules = getModule(m => m.NativeModules).NativeModules;
      const infoDictionary = nativeModules.InfoDictionaryManager;
      const deviceManager = nativeModules.DCDDeviceManager;

      let content = "**Debug Info:**\n";
      content += `> Discord: ${infoDictionary.Version} (${infoDictionary.Build})\n`;
      content += `> Device: ${deviceManager.device}\n`;
      content += `> System: ${deviceManager.systemVersion}\n`;

      return {
        content
      };
    }
  }, {
    id: "reload-command",
    name: "reload",
    description: "Reload Discord.",
    applicationId: Commands.AliucordSectionID,

    target: ApplicationCommandTarget.Chat,
    type: ApplicationCommandType.BuiltIn,

    execute: function(args) {
      getModule(m => m.NativeModules).NativeModules.BundleUpdaterManager.reload();
    }
  }];

  Commands.registerCommands(aliucordCommands);
}
