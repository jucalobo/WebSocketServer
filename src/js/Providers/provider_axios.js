const rAxios = require ('axios').default;
const config = require('config');

// origen hace referencia a la IP a la cual toca consultar las registros alamacenados 
// de las imagenes que tenga que esta formado de la fecha + temperatura de la persona 
// desconocida que se puso al frente 


const post  = ( $Body ) => {
  const url_path = `http://${config.get("HOST")}/UNV_SLIM_TechBoss/public/registro_residente`;
  // console.log('post body',url_path);
  return rAxios.post(url_path, $Body);

}

const registroResidente = async ($Body) => {
  $Body.Residente = true;
  const rsp = await post($Body);
  // console.log ('respuesta Axios',rsp);
  return;

}

export {
  registroResidente
}

