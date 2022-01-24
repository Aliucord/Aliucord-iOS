import { setUpDebugWS } from "./plugins/websocketDebug";
import { injectPluginsManager } from "./plugins/pluginsManager";
import { injectCommands } from "./plugins/utilsCommands";
import { getModule } from "./utils/modules";

getModule(m => m.sex);

try {
  setUpDebugWS();
  injectPluginsManager();
  injectCommands();
} catch (error) {
  console.error(error);
}