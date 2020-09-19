
const moment = require('moment')
const config = require('config');

const fs   = require('fs')


const fileSave = ( data ) => {

    const FileName = getFileName();

    fs.appendFile(config.get("FS_PATH") + FileName, data, (error)=>{
        if (error){
            console.log('Error escribiendo Historico', error)
        } else {    
          // console.log('Registro Almacenado')    
        }   
    });

};

const getFileName = () => {
    return moment().format("YYYYMMDD") + '.log';
};

const imgSave = ( nameFile, data ) => {
    fs.appendFile(config.get("IMG_PATH") + nameFile, data, {encoding:'base64'}, (error)=>{
        if (error){
            console.log('Error escribiendo IMG', error)
        } else {    
        //   console.log('Imagen Almacenada')    
        }   
    });
}

const readLicencias = () =>{
   
  try{
    const data =  fs.readFileSync('./config/licencias.key',{encoding:'utf8', flag:'r'});
      return {
          "resp" : true,
          "info" : data
      } 
      
    } catch (err){
      return {
          "resp" : false,
          "info" : 'archivo no localizado '
      } 
  } 
};

export {
    fileSave,
    imgSave,
    readLicencias,
}