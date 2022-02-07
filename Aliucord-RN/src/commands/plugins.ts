import { ApplicationCommandOptionType, ApplicationCommandInputType, ApplicationCommandType, Command } from "aliucord-api/dist/types/commands";

import { section } from "../api/commands";
import { sendReply } from "../api/clyde";

import { sendCommand } from "../utils/native";

/**
 * List installed plugins
 */
const list: Command = {
  id: "installed-plugins",
  applicationId: section.id,

  name: "plugins",
  description: "List installed plugins.",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: (args, message) => {
    const channel = message.channel;

    sendCommand("list-plugins").then((response) => {
      const pluginsList = response.data;
      sendReply(channel.id, pluginsList == "" ? "No plugins installed." : `**Plugins installed (${pluginsList.split(",").length})**: ${pluginsList.split(",").join(", ")}`);
    });
  },
};

/**
 * Install a plugin
 */
const install: Command = {
  id: "install-plugin",
  applicationId: section.id,

  name: "install",
  description: "Install a plugin.",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

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
      sendReply(channel.id, response.data);
    });
  }
};

/**
 * Uninstall a plugin
 */
const uninstall: Command = {
  id: "uninstall-plugin",
  applicationId: section.id,

  name: "uninstall",
  description: "Uninstall a plugin.",

  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

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
      sendReply(channel.id, response.data);
    });
  }
};

export default [list, install, uninstall];