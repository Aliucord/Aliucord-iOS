import { getModule } from "./modules";
import { v4 as uuidv4 } from "uuid";

const linkingModule = getModule(m => m.openURL);

interface Command {
  command: string;
  id: string;
  params: string[];
}

interface Response {
  id: string;
  data: string;
}

interface URL {
  url: string;
}

/**
 * Send a command to the native handler of Aliucord
 * @param name
 * @param params
 */
async function sendCommand(name: string, params: string[] = []): Promise<Response> {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const command: Command = {
      command: name,
      id,
      params
    };

    linkingModule.openURL(`aliucord://${JSON.stringify(command)}`).then(() => {
      const subscription = linkingModule.addEventListener("url", (url: URL) => {
        let responseUrl = url.url;
        if (!responseUrl.includes("aliucord://")) return;

        responseUrl = decodeURIComponent(responseUrl.replace("aliucord://", ""));

        try {
          const response: Response = JSON.parse(responseUrl);
          if (response.id !== id) return;
          if (response.data === undefined) return;

          subscription.remove();
          resolve(response);
        } catch (e) {
          return;
        }
      });
    });
  });
}

export {
  sendCommand
};