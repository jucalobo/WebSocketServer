
const WebSocket = require('ws');


export class SocketWEB {

  constructor () {
    // abro un WebSocket cliente
    try {
      this.wss = new WebSocket('ws://192.168.2.10:3000');
      // this.wss.on('open', ()=>{
        //this.wss.send('cliente Principal Conectado')
      // });
      this.wss.on('error', function error(err) {
        console.log('Error: ' + err.code);
      });

      this.wss.on('open', this.heartbeat);
      this.wss.on('message', function incoming(data) {
        console.log(data);
      });


    } catch (e) {
      console.log('error',e)
    }


  }

  send (data) {
   // this.wss.send(data);
  }

   heartbeat() {
    clearTimeout(this.pingTimeout);
    this.pingTimeout = setTimeout(() => {
      this.terminate();
    }, 1000);
  }

}