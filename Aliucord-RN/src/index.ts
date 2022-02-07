import { prepareApi } from "./api";
import { prepareWebsocket } from "./utils/websocket";
import { prepareThemer } from "./utils/themes";
import { prepareCommands } from "./commands";

try {
  prepareApi();
  prepareThemer();
  prepareWebsocket();
  prepareCommands();
} catch (error) {
  console.error(error);
}