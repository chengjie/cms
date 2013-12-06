var mysql = require('mysql');
var config = require('../config/config.js');
module.exports = Db(); 
function Db(){
    var pool = mysql.createPool(config.db);
    return pool;
}
