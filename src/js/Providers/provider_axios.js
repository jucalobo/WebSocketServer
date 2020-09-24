const rAxios = require ('axios').default;
const config = require('config');

// origen hace referencia a la IP a la cual toca consultar las registros alamacenados 
// de las imagenes que tenga que esta formado de la fecha + temperatura de la persona 
// desconocida que se puso al frente 


const post  = ( $Body ) => {
  const url_path = `${config.get("SLIM")}`;
  // console.log('url_path',url_path);
  // console.log('post body',$Body);
  return rAxios.post(url_path, $Body);

}

const registroResidente = async ($Body) => {
  $Body.Residente = 'true';
  const rsp = await post($Body);
  // sede responde siempre 200 para ver
  // console.log ('respuesta Axios',rsp); 
  return;

}

const registroDesconocido = async ($Body) => {
  $Body.Residente = 'false';
  const rsp = await post($Body);
  // sede responde siempre 200 para ver
  // console.log ('respuesta Axios',rsp);
  return;

}

export {
  registroResidente,
  registroDesconocido
}

