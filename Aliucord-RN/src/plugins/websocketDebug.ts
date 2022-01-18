declare const nativeLoggingHook: (message: string, level: number) => void;

let socket: WebSocket;

function setUpDebugWS() {
  connectWebsocket("localhost:9090");

  const _log = nativeLoggingHook;
  globalThis.nativeLoggingHook = (message: string, level: number) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ level, message }));
    return _log(message, level);
  };
}

function connectWebsocket(host: string) {
  console.log("Connecting to debug ws");

  if (socket !== undefined && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
    socket = null;
  }

  socket = new WebSocket(`ws://${host}`);

  socket.addEventListener("open", () => console.log("Connected with debug websocket"));
  socket.addEventListener("error", (err: any) => console.log("Error with debug websocket: ", err.message));
  socket.addEventListener("message", message => {
    try {
      console.log(eval(message.data));
    } catch (e) {
      console.error(e);
    }
  });
}

export {
  setUpDebugWS,
  connectWebsocket
};