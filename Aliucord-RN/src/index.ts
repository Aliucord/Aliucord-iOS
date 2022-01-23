import { setUpDebugWS } from "./plugins/websocketDebug";
import { injectPluginsManager } from "./plugins/pluginsManager";
import { injectCommands } from "./plugins/utilsCommands";

try {
  setUpDebugWS();
  injectPluginsManager();
  injectCommands();
} catch (error) {
  console.error(error);
}