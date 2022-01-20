import { Clyde, Commands } from "aliucord-api";
import { ApplicationCommandOptionType, ApplicationCommandTarget, ApplicationCommandType, Command, Section } from "aliucord-api/dist/types/commands";

import { getModule } from "../utils/modules";
import { sendCommand } from "../utils/native";

export function injectPluginsManager() {
  const commandsModule = getModule(m => m.getBuiltInCommands, false);

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
        Clyde.sendReply(channel.id, pluginsList == "" ? "No plugins installed." : `**Plugins installed (${pluginsList.split(",").length})**: ${pluginsList.split(",").join(", ")}`);
      });
    },
  };

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
        Clyde.sendReply(channel.id, response.data);
      });
    }
  };

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
      const name = args[0].value;
      const channel = message.channel;

      sendCommand("uninstall-plugin", [name]).then((response) => {
        Clyde.sendReply(channel.id, response.data);
      });
    }
  };

  const aliucordCommands = [
    listPluginsCommand,
    installPluginCommand,
    uninstallPluginCommand
  ];

  Commands.registerCommands(aliucordCommands);
}
