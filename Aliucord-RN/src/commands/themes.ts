import { ApplicationCommandOptionType, ApplicationCommandInputType, ApplicationCommandType, Command } from "aliucord-api/commands";

import { section } from "../api/commands";
import { applyTheme, getThemeByName, listThemes, removeTheme } from "../api/themes";
import { sendReply } from "../api/clyde";

const themes: Command = {
  id: "list-themes",
  applicationId: section.id,
  name: "themes",
  description: "List available themes",
  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: (args, message) => {
    const themes = listThemes();
    sendReply(message.channel.id, `**Installed themes (${themes.length})**: ${themes.join(', ')}`);
  }
}

const apply: Command = {
  id: "apply-theme",
  applicationId: section.id,
  name: "apply",
  description: "Apply a theme",
  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,
  
  options: [{
    name: "name",
    description: "Theme's name",
    type: ApplicationCommandOptionType.String,
    required: true
  }],

  execute: (args, message) => {
    const name = args[0].value;
    const theme = getThemeByName(name);

    if (!theme) {
      sendReply(message.channel.id, "Theme couldn't be found.");
    }

    applyTheme(name).then(response => {
      sendReply(message.channel.id, response);
    });
  }
}

const clear: Command = {
  id: "clear-theme",
  applicationId: section.id,
  name: "clear",
  description: "Remove applied theme",
  type: ApplicationCommandType.Chat,
  inputType: ApplicationCommandInputType.BuiltIn,

  execute: (args, message) => {
    removeTheme().then(response => {
      sendReply(message.channel.id, response);
    });
  }
}

export default [
  themes,
  apply,
  clear
]