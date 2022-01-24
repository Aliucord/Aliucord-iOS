import { setUpDebugWS } from "./plugins/websocketDebug";
import { injectPluginsManager } from "./plugins/pluginsManager";
import { injectCommands } from "./plugins/utilsCommands";

import { getModule, getModules } from "./utils/modules";
import { getAssetByName, getAssets } from "./utils/assets";

window["getModule"] = getModule;
window["getModules"] = getModules;
window["getAssetByName"] = getAssetByName;
window["getAssets"] = getAssets;

try {
  setUpDebugWS();
  injectPluginsManager();
  injectCommands();
} catch (error) {
  console.error(error);
}