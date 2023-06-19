const dotenv = require('dotenv')
dotenv.config(); 
const knex = require('knex')({
    client: "mysql",
    connection : {
        // host : "localhost",
        // user : "root",
        // database : "employee_data",
        // password : "Amit@1234",

        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        database:process.env.DB_NAME,
        password:process.env.DB_PASSWORD
    }
})

knex.schema.createTable("datas", t =>{
    t.increments("Employee_ID")
    t.string("Name").notNullable()
    t.string("Email").unique().notNullable()
    t.string("Password").notNullable()
    t.string("Address").notNullable()
    t.string("Phone_Number").unique().notNullable()
    t.string("Image")
}).then(()=>{
    console.log("table created...........");
}).catch(()=>{
    console.log('table create allready...');
})

module.exports = knex
