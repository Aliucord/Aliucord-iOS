import { getItem, removeItem, setItem } from "../api/storage";
import { getModule, getModuleByProps } from "../utils/modules";
import { sendCommand } from "./native";

const LocaleSettings = getModule(m =>m.default?.updateLocalSettings);
const Theme = getModule(m =>m.default?.theme).default.theme;

const ColorsModule = getModuleByProps("HEXColors");

const ThemeColorMap = getModule(m => m.default?.HEADER_PRIMARY);
const Colors = getModule(m => m.default?.PRIMARY_DARK);

const themer = () => window["aliucord"].themer;

/**
 * Prepare the theme engine
 */
 async function prepareThemer() {
  let theme = await getItem("theme");
  if (theme === null) return;

  theme = JSON.parse(theme);

  applyColours(theme);
  themer().theme = theme.name;
}

/**
 * Get the currently loaded theme name
 */
function getTheme() {
  return themer().theme;
}

/**
 * Get a theme by name
 */
function getThemeByName(name) {
  return themer().themes.find(theme => theme.name === name);
}

/**
 * List registered themes
 */
function listThemes() {
  return themer().themes.map(theme => theme.name);
}

/**
 * Apply Theme's colours
 */
function applyColours(theme) {
  const colorMap = {
    ...ThemeColorMap.default,
    ...theme.theme_color_map
  };

  const colors = {
    ...Colors.default,
    ...theme.colors
  };

  ThemeColorMap.default = colorMap;
  Colors.default = colors;
  ColorsModule.Colors = colors;

  LocaleSettings.default.updateLocalSettings({
    theme: Theme,
    sync: false,
  });
}

/**
 * Apply a theme to Discord
 */
async function applyTheme(name) {
  themer().theme = name;
  const theme = getThemeByName(name);

  setItem("theme", JSON.stringify(theme));
  applyColours(theme);

  const response = await sendCommand("apply-theme", [Theme, JSON.stringify(theme.theme_color_map)]);
  return response.data;
}

/**
 * Register a theme
 */
function registerTheme(theme) {
  themer().themes.push(theme);
}

/**
 * Remove the currently applied theme
 */
async function removeTheme() {
  themer().theme = "";
  await removeItem("theme");
  
  const response = await sendCommand("remove-theme");
  return response.data;
}

export {
  prepareThemer,
  applyTheme,
  getTheme,
  getThemeByName,
  listThemes,
  registerTheme,
  removeTheme
}