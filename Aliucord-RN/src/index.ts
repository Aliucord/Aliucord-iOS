import { prepareApi } from "./api";
import { applyPatches } from "./patches";
import { prepareWebsocket } from "./utils/websocket";
import { prepareThemer } from "./utils/themes";
import { prepareCommands } from "./commands";

try {
  prepareApi();
  applyPatches();
  prepareThemer();
  prepareWebsocket();
  prepareCommands();
} catch (error) {
  console.error(error);
}