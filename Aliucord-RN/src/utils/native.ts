import { getModule } from "./modules";
import { v4 as uuidv4 } from "uuid";

const linkingModule = getModule(m => m.openURL);

interface Command {
  command: string;
  id: string;
  params: string[];
}

interface URL {
  url: string;
}

interface Response {
  id: string;
  data: string;
}

linkingModule.addEventListener("url", (url: URL) => {
  let responseUrl = url.url;
  responseUrl = decodeURIComponent(responseUrl.replace("com.hammerandchisel.discord://", ""));

  try {
    const response: Response = JSON.parse(responseUrl);
    if (response.data === undefined) return;

    console.log(response);

    if (replies[response.id]) {
      replies[response.id](response.data);
      delete replies[response.id];
    }
  } catch (e) {
    return;
  }
});

const replies = {};

/**
 * Send a command to the native handler of Aliucord
 * @param name
 * @param params
 */
function sendCommand(name: string, params: string[] = [], reply?: (data) => void): void {
  const id = uuidv4();
  const command: Command = {
    command: name,
    id,
    params
  };

  linkingModule.openURL(`com.hammerandchisel.discord://${JSON.stringify(command)}`).then(() => {
    if (reply) {
      replies[id] = reply;
    }
  });
}

export {
  sendCommand,
};