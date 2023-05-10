
var dbconnection = require('mysql');
const con = dbconnection.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "corona_db"
});
module.exports = con;