const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('open', () => {
  console.log('Puerto socket abierto');
});


export const servidorIO = () =>{
  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log('Se conecto el cliente ip:', ip);
    ws.on('message', (data) => {
      console.log('WS send', data)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
  });
}