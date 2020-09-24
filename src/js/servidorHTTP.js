import { Entity } from './Classes/class_mysql.js'
import { fileSave, imgSave } from './filemanager.js'
import * as axios from './Providers/provider_axios.js'
const config = require('config');

 

// const host = '192.168.2.10';
const host = config.get("HOST");
const port = 6666;

const WebSocket = require('ws');
const wss = new WebSocket(config.get("WS"));

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');

// se incrementa el lime a 50 MB por que el tamaño de lo que llega es bastante grande
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.text({limit: '50mb'}));
app.use(cors());


wss.on('open', () =>{
    console.log('Cliente local abierto')
})

app.get('*', (req,res) => {
    console.log('LLEGO UN GET DESCONOCIDO');
    respuestaHTTP(res);
});

app.post('/LAPI/V1.0/System/Event/Notification/PersonVerification', (req, res) => {
    console.log('LLEGO PersonVerification');
    BD_Save_Person(req.body);
    fileLog(req);
    respuestaHTTP(res);
});

app.post('/LAPI/V1.0/PACS/Controller/Event/Notifications', (req, res) => {
    console.log('LLEGO Notifications');
    BD_Save_Person(req.body);
    fileLog(req);
    respuestaHTTP(res);
});

app.post('/LAPI/V1.0/PACS/Controller/HeartReportInfo', (req, res) => {

    console.log('LLEGO HeartReportInfo');
    fileLog(req);
    BD_ActualizarRecibidos(req.body);
    respuestaHTTP(res);
});

const respuestaHTTP = (res) => {
    res.statusCode = 200;
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:2323');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'text/plain');
    res.end('Servidor pruebas TechBoss V1.4');
};

const fileLog = (req) => {

    //desestructuro el req
    const {headers , method, url , body} = req;

    // para no saturar el archivo no guardare la imagen  para esto trabajo todo en JSON y despues lo regeso a String
    let data_body = typeof body !== 'string' ? body : JSON.parse(body);


    if(data_body.hasOwnProperty('FaceInfoList')){
        data_body.Temperatura = data_body.FaceInfoList[0].Temperature;
        data_body.isMascara   = data_body.FaceInfoList[0].MaskFlag;
        delete data_body.FaceInfoList;
    }

    fileSave('**********************+++++++++++++++++***********************'+"\r\n");
    fileSave('------------' + req.socket.remoteAddress +'--------------------'+ "\r\n");
    fileSave('----------------' + url +'----------------------'+"\r\n");
    fileSave('********************************************************'+"\r\n");
    fileSave(JSON.stringify(data_body));
    fileSave("\r\n");
    fileSave('********************************************************'+"\r\n");
};

const BD_ActualizarRecibidos = async (body) => {

    // se maneja todo en JSON
    const json_Body = typeof body !== 'string' ? body : JSON.parse(body);

    const dataInfo = {
        'idDeviceCode': `'${json_Body.DeviceCode}'`,
        'HoraRecibido': `'${json_Body.Time}'`
    }
    
    const db = new Entity ('ControlRecibido');
    db.table_name('ControlRecibido')
    db.select('idControlRecibido');
    db.where(`idDeviceCode LIKE ${dataInfo.idDeviceCode}`);
    let rsp =  await db.execute();

    db.table_name('ControlRecibido');


    if(Object.keys(rsp).length === 0){
        db.insert(dataInfo);
    } else {
        db.update(`HoraRecibido = ${dataInfo.HoraRecibido}`);
        db.where(`idDeviceCode LIKE ${dataInfo.idDeviceCode}`);
    }

    db.execute_id().then((id)=>{
        console.log(id);
    });

    wss.send('BD_ActualizarRecibidos');
};

// const BD_Save_Person = async (body, ip) => {
const BD_Save_Person = async ( body ) => {

    const json_Body = typeof body !== 'string' ? body : JSON.parse(body);

    console.log(`'${json_Body.DeviceCode}'`);

    let idPersona = json_Body.LibMatInfoList[0].MatchPersonInfo.PersonCode  ==  '' ? 0 : json_Body.LibMatInfoList[0].MatchPersonInfo.PersonCode;
    let CardID = json_Body.LibMatInfoList[0].MatchPersonInfo.CardID  == '' ? 0 : json_Body.LibMatInfoList[0].MatchPersonInfo.CardID;

    const dataInfo = {
        'FechaDispositivo': `FROM_UNIXTIME(${json_Body.Timestamp},"%Y-%m-%d %H:%m:%s")`,
        'idDeviceCode'    : `'${json_Body.DeviceCode}'`,
        'NombrePersona'   : `'${json_Body.LibMatInfoList[0].MatchPersonInfo.PersonName}'`,
        'idPersona'       : `'${idPersona}'`,
        'CardID'          : `'${CardID}'`,
        'Gender'          : `'${json_Body.LibMatInfoList[0].MatchPersonInfo.Gender}'`,
        'Temperatura'     : `'${json_Body.FaceInfoList[0].Temperature}'`,
        'isMascara'       : `'${json_Body.FaceInfoList[0].MaskFlag}'`,
        'Foto'            : `'${json_Body.FaceInfoList[0].PanoImage.Name}'`,
        'ID_Seq'          : `'${json_Body.Seq}'`
    };

    const fileData = json_Body.FaceInfoList[0].PanoImage.Data;
    const fileName = json_Body.FaceInfoList[0].PanoImage.Name;
    const MatchFaceID = json_Body.LibMatInfoList[0].MatchFaceID;

    const validar = await Validar_idRecibidos( dataInfo.idDeviceCode, dataInfo.ID_Seq, dataInfo.Foto );

    if(validar){
        console.log('Nuevo registro');
        const db = new Entity ('InfoRecibidos');
        db.table_name('InfoRecibidos');
        db.insert(dataInfo);
        const id = await db.execute_id()
        
        console.log('InfoRecibidos',id);
        
        registrar_Recibidos( dataInfo.idDeviceCode, dataInfo.ID_Seq);

        //valido si es residente
        // if(dataInfo.NombrePersona.indexOf('No registrado') < 0 ){
        if( MatchFaceID > 0 ){
            console.log("Residente");
            await axios.registroResidente(dataInfo);
            wss.send('Actualizar_Monitoreo');
        }else{
            console.log("Desconocido");
            await axios.registroDesconocido(dataInfo);
            wss.send(`Registrar_Recibidos, ${dataInfo.idDeviceCode}, ${dataInfo.ID_Seq}`);
        }

        // imgSave( json_Body.FaceInfoList[0].PanoImage.Name, json_Body.FaceInfoList[0].PanoImage.Data );
        imgSave( fileName, fileData );

    } 

};

const Validar_idRecibidos = async ( idDeviceCode, ID_Seq , Foto ) => {
    // esta funcion validar si el paquete ya fue recibido para no duplicar su entrada
    
    const db = new Entity ('InfoRecibidos');
          db.table_name('InfoRecibidos');
          db.select('idInfoRecibidos');
          db.where(`idDeviceCode LIKE ${idDeviceCode} AND ID_Seq=${ID_Seq} AND Foto=${Foto}`);
    const rsp =  await db.execute();

    if(Object.keys(rsp).length === 0){
        return true;
    } else {
        return false;
    }

}


const registrar_Recibidos = async ( idDeviceCode, ID_Seq ) => {
    
    console.log(`'${idDeviceCode}'`);


    const dataInfo = {
        idDeviceCode,
        ID_Seq
    }
    
    const db = new Entity ('ControlRecibido');
    db.table_name('ControlRecibido')
    db.select('idControlRecibido');
    db.where(`idDeviceCode LIKE ${idDeviceCode}`);
    let rsp =  await db.execute();

    if(Object.keys(rsp).length === 0){
        db.insert(dataInfo);
    } else {
        db.update(`ID_Seq = ${ID_Seq}`);
        db.where(`idDeviceCode LIKE ${idDeviceCode}`);
    }

    db.execute_id().then((id)=>{
        console.log('Registrar_Recibidos',id);
    });
}

export const servidor = () =>{
    app.listen(port, () => {
        console.log(`Servidor HTTP corriendo en http://${host}:${port}`);
    });
}

