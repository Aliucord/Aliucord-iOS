import { getModule } from "../utils/modules";
import { sendCommand } from "../utils/native";

import { ApplicationCommandOptionType, ApplicationCommandTarget, ApplicationCommandType, Command, Section } from "../types/commands";

export function injectPluginsManager() {
  const commandsModule = getModule(m => m.getBuiltInCommands, false);
  const clydeModule = getModule(m => m.default?.sendBotMessage, true);

  // Add Aliucord section
  const aliucordSection: Section = {
    id: "-3",
    type: 0,
    name: "Aliucord"
  };

  const builtInSections = commandsModule.exports.BUILT_IN_SECTIONS;
  commandsModule.exports.BUILT_IN_SECTIONS = {
    ...builtInSections,
    [aliucordSection.id]: aliucordSection
  };

  // Command used to list installed plugins
  const listPluginsCommand: Command = {
    id: "installed-plugins",
    applicationId: aliucordSection.id,

    name: "plugins",
    description: "List installed plugins.",

    target: ApplicationCommandTarget.Chat,
    type: ApplicationCommandType.BuiltIn,

    execute: (args, message) => {
      const channel = message.channel;

      sendCommand("list-plugins").then((response) => {
        const pluginsList = response.data;
        clydeModule.default.sendBotMessage(channel.id, pluginsList == "" ? "No plugins installed." : `**Plugins installed (${pluginsList.split(",").length})**: ${pluginsList.split(",").join(", ")}`);
      });
    },
  };

  // Command used to install a plugin
  const installPluginCommand: Command = {
    id: "install-plugin",
    applicationId: aliucordSection.id,

    name: "install",
    description: "Install a plugin.",

    target: ApplicationCommandTarget.Chat,
    type: ApplicationCommandType.BuiltIn,

    options: [{
      name: "plugin",
      description: "Plugin url",
      required: true,
      type: ApplicationCommandOptionType.String
    }],

    execute: (args, message) => {
      const url = args[0].value;
      const channel = message.channel;

      sendCommand("install-plugin", [url]).then((response) => {
        clydeModule.default.sendBotMessage(channel.id, response.data);
      });
    }
  };

  // Command used to uinstall a plugin
  const uninstallPluginCommand: Command = {
    id: "uninstall-plugin",
    applicationId: aliucordSection.id,

    name: "uninstall",
    description: "Uninstall a plugin.",

    target: ApplicationCommandTarget.Chat,
    type: ApplicationCommandType.BuiltIn,

    options: [{
      name: "plugin",
      description: "Plugin name",
      required: true,
      type: ApplicationCommandOptionType.String
    }],

    execute: (args, message) => {
      console.log(args);
      const name = args[0].value;
      const channel = message.channel;

      sendCommand("uninstall-plugin", [name]).then((response) => {
        clydeModule.default.sendBotMessage(channel.id, response.data);
      });
    }
  };

  const aliucordCommands = [
    listPluginsCommand,
    installPluginCommand,
    uninstallPluginCommand
  ];

  commandsModule.exports.BUILT_IN_COMMANDS.push(...aliucordCommands);
}
