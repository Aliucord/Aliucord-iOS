const { WebSocketServer } = require('ws');
const { writeFileSync } = require('fs');

const wss = new WebSocketServer({ port: 9090 });

console.log('Websocket was initialized, please connect using the /websocket command.');

wss.on('connection', (ws) => {
  console.clear();
  console.log('Your device has successfully connected to the dumper.');
  console.log('');
  console.log('To start, run /dump inside Aliucord.');

  ws.on('message', (data) => {
    try {
      const module = JSON.parse(data);
      if (module.id === undefined) return;
      console.log(`Dumping ${module.id}`)

      writeFileSync(`dump/${module.id}.json`, JSON.stringify(module, null, "\t"));
    } catch(err) {}
  });
});