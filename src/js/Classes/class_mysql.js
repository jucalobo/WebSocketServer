// require ('dotenv').config();

const mysql = require('mysql2');
const config = require('config');


export class Entity {

    //static instancia;   // cuando no esta instanaciado es undefine

    constructor ( table ){

        this._table = table; 
        this._sql;
        
        if(!!Entity.instancia){
            return Entity.instancia;
        }

        Entity.instancia = this ;  // cargo la instanacia para hacer el singleton

        this.connection = Entity.conectar();
    }

    get get_sql () {
        return this._sql;
    }
    get get_id () {
        return this._id;
    }

    table_name (sFields) {
        this._table = sFields;
    }

    select (sFields) {
        this._sql = `SELECT ${sFields} FROM ${this._table}`;
    }

    where (sFields) {
        this._sql += ` WHERE ${sFields}` ;
    }
    
    update (sFields) {
        this._sql += `UPDATE ${this._table} SET ${sFields}`; 
    }
    

    insert (oFields) {
        // como me llega un objeto con la key = campos y los valores son los que se alamcenara lo proceso
        const aCampos = [];
        const aValor  = []; 
        
        for ( const [key, value] of Object.entries(oFields)){
            aCampos.push(key);
            aValor.push(value);
        }

        this._sql = `INSERT INTO ${this._table} (${aCampos}) VALUES (${aValor}) `;
    }

    static async conectar () {
        const connection = await mysql.createConnection({
            host: config.get("dbConfig.DB_HOST_NAME"),
            user: config.get("dbConfig.DB_USER"),
            password: config.get("dbConfig.DB_PSWD"),
            database: config.get("dbConfig.DB_DATABASE")
        });
        // const connection = await mysql.createConnection({
        //     host: process.env.DB_HOST_NAME,
        //     user: process.env.DB_USER,
        //     password: process.env.DB_PSWD,
        //     database: process.env.DB_DATABASE
        // });

        connection.on('error', (err) => {
            console.error("Error En conexion" + err);
        })

        return connection;
    }

    async execute () {
        // ojo es una promesa se debe recibir la respuesgta con un then( rows => { 'lo que se quiera' }) o con await a una variable
        // console.log(this._sql);

        const con_promesa = (await this.connection).promise();   
        const [rows] = await con_promesa.execute(this._sql);
        
        this.clearVariable();
        
        return rows;
    }

    async execute_id () {
        // ojo es una promesa se debe recibir la respuesgta con un then( rows => { 'lo que se quiera' }) o con await a una variable
        // este se usa para insert basicamente
        // console.log(this._sql);

        const con_promesa = (await this.connection).promise();   
        const [rows,result] = await con_promesa.execute(this._sql);

        // console.log(rows);
        
        this.clearVariable();

        return rows.insertId;

   
    }

    clearVariable () {
        // this._table = ''; 
        this._sql = '' ;
    }

    


}