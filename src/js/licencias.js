import { Entity } from './Classes/class_mysql.js'
import { readLicencias } from './filemanager.js'
const config = require('config');



const crypto = require('crypto');

const validarLicencias = async () => {
  // abro el archivo licencias alamacenado en cnfiguracion
  const dataFile = readLicencias();

  if (dataFile.resp){
    const rsp = await consultaBD();
    if(Object.keys(rsp).length !== 0){
    
      // valido las claves son hash asi que no se desencripta vuelo ha hacer lo mismo que el generado
      // pero, jalo de la BD y encripto y comparo si esta en el array
      const aKeys = dataFile.info.split("\r\n");
      let isLicencia = true;
      
      for(let [key,value] of Object.entries(rsp) ){
        
        if(!buscarLicencia(aKeys,licencia(value.idDeviceCode))){
          console.log (`Licencia faltante ${value.idDeviceCode}` );
          isLicencia = false;
        }
      }
      
      if(!isLicencia){
        sinLicencia();
      } 

    }
  }else{
    sinLicencia();
  }

};

const sinLicencia = () =>{
  const WebSocket = require('ws');
  const wss = new WebSocket(config.get("WS"));

  setInterval(() =>{
    console.log('sin Licencias');
    wss.send('SIN_Licencias');
  }, 1500);
}

const licencia = (serialUNV) =>{

  // en cripto con hash la validacion deber ser encriptando de nuevo y comparando
  const hash = crypto.createHmac('sha256', serialUNV) 
        .update(process.env.PRIVATE_KEY) 
        .digest('hex');

  return hash

};

const consultaBD = async () =>{
    // comparo con la informacion de la DB, saco toda la tabla 
    const db = new Entity ('DeviceCode');
    db.table_name('DeviceCode')
    db.select('idDeviceCode');

    return await db.execute();

};

const buscarLicencia = (aData , element) => {
  const Buscar = aData.find((e)=>{
    if(element === e){
      return true;
    }
  });
  if(Buscar){
    return true;
  }else{
    return false;
  }
} 


export {
  validarLicencias,
}

