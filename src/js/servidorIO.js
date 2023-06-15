const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('open', () => {
  console.log('Puerto socket abierto');
});

let aConexiones=[];

const comparacionWS = (obj1, obj2 ) => {
    const keys1 = Object.keys( obj1 );
    const keys2 = Object.keys( obj2 );

    if ( keys1.length !== keys2.length ) return false;

    for ( const key of keys1 ) {
        let val1 = obj1[key];
        let val2 = obj2[key];

        if ( val1 !== val2 ) return false;
    }

    return true;
}

export const servidorIO = () =>{
  
  wss.on('connection', (ws, req) => {
    // const ip = req.socket.remoteAddress;
    const URL = req.url == '/' ? 'Default' : req.url;
    aConexiones.push({ url : URL, ws: ws});
    // console.log('conexion', aConexiones);
    
    ws.on('message', (data) => {
      console.log(`WS send ${URL}:${data}` )
      aConexiones.forEach( cliente => {
        if(cliente.url === URL){
          if ( cliente.ws !== ws && cliente.ws.readyState === WebSocket.OPEN) {
            cliente.ws.send(data);
          }
        }
      });

      // Se deja esto que es la primera forma de trabajar con envio a todos sin "salon"
      // wss.clients.forEach((client) => {
      //   if ( client !== ws && client.readyState === WebSocket.OPEN) {
      //     client.send(data);
      //   }
      // });
    });
    ws.on('close', () =>{
      // borro el ws que se cerro
      aConexiones.splice(aConexiones.findIndex( cliente => comparacionWS(cliente.ws, ws)) ,1);
      // console.log('cerrado puerto', aConexiones);
      console.log('cerrado puerto');

    });
    ws.on('close', (error ) =>{
      let reason = ''; 
      switch(error){
        case 1000:
            reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled. Normal";
         break   
        case 1001:
            reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
         break    
        case 1002:
            reason = "An endpoint is terminating the connection due to a protocol error";
         break    
        case 1003:
            reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
         break    
        case 1004:
            reason = "Reserved. The specific meaning might be defined in the future.";
         break    
        case 1005:
            reason = "No status code was actually present. Normal";
         break    
        case 1006:
           reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
        break    
        case 1007:
            reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
         break    
        case 1008:
            reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
         break    
        case 1009:
           reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
        break    
        case 1010: // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
            reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
         break    
        case 1011:
            reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
         break    
        case 1015:
            reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
         break    
        default:
            reason = "Unknown reason";
          break  
        }
        console.log('Error', error , reason);  


    });

  });
}