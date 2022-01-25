import { prepareApi } from "./api";
import { setUpDebugWS } from "./plugins/websocketDebug";
import { injectPluginsManager } from "./plugins/pluginsManager";
import { injectCommands } from "./plugins/utilsCommands";

try {
  prepareApi();
  setUpDebugWS();
  injectPluginsManager();
  injectCommands();
} catch (error) {
  console.error(error);
}