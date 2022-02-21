import { ApplicationCommandOptionType, ApplicationCommandInputType, ApplicationCommandType, Command } from "aliucord-api/commands";

import { section } from "../api/commands";
import { sendReply } from "../api/clyde";

import { sendCommand } from "../utils/native";
import { disablePlugin, enablePlugin } from "../api/plugin";

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
    const channel = message.channel.id;

    sendCommand("list-plugins", [], (pluginsList) => {
      if (pluginsList === "") {
        sendReply(channel, "No plugins installed.");
        return;
      }

      const enabledPlugins: string[] = pluginsList.split(",").filter((p: string) => !p.includes(".disable")).map((p: string) => p.replace(".js", ""));
      const disabledPlugins: string[] = pluginsList.split(",").filter((p: string) => p.includes(".disable")).map((p: string) => p.replace(".js.disable", ""));;

      let plugins = `**Enabled plugins (${enabledPlugins.length})**:\n`;
      plugins += `> ${enabledPlugins.join(", ")}\n`;
      plugins += `**Disabled plugins (${disabledPlugins.length})**:\n`;
      plugins += `> ${disabledPlugins.join(", ")}`;

      sendReply(channel, plugins);
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
    const channel = message.channel.id;

    sendCommand("install-plugin", [url], (data) => {
      sendReply(channel, data);
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
    const channel = message.channel.id;

    sendCommand("uninstall-plugin", [name], (data) => {
      sendReply(channel, data);
    });
  }
};

/**
 * Enable a plugin
 */
const disable: Command = {
  id: "disable-plugin",
  applicationId: section.id,

  name: "disable",
  description: "Disable a plugin.",

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
    const channel = message.channel.id;

    disablePlugin(name, (result) => {
      if (result === "yes") {
        sendReply(channel, `**${name}** has been disabled.`);
        return
      }

      sendReply(channel, `Error when disabling **${name}**.`);
    });
  }
}

/**
 * Disable a plugin
 */
const enable: Command = {
  id: "enable-plugin",
  applicationId: section.id,

  name: "enable",
  description: "Enable a plugin.",

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
    const channel = message.channel.id;

    enablePlugin(name, (result) => {
      if (result === "yes") {
        sendReply(channel, `**${name}** has been enabled.`);
        return
      }

      sendReply(channel, `Error when enabling **${name}**.`);
    });
  }
}

export default [list, install, uninstall, disable, enable];