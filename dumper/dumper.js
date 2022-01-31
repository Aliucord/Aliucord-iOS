const { WebSocketServer } = require('ws');
const { writeFileSync } = require('fs');

const wss = new WebSocketServer({ port: 9090 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    try {
      const module = JSON.parse(data);
      if (module.id === undefined) return;

      writeFileSync(`dump/${module.id}.json`, JSON.stringify(module, null, "\t"));
    } catch(err) {}
  });
});