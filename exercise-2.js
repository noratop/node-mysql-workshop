var mysql = require('mysql');
var Promise = require('bluebird');
var Table = require('cli-table');
var colors = require('colors');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'mysql'
});

connection.queryAsync("SHOW DATABASES").then(function(results) {
	var db = results[0];
    //console.log(dbrows);
    return db;
}).map(function(dbArray){
    return connection.queryAsync("SHOW TABLES FROM "+dbArray.Database).then(function(results){
        return {
            'database': dbArray.Database,
            'tables': results[0]
        };
    });
}).then(function(dbTables){
    //console.log(dbTables);
    var output = new Table();
    
    dbTables.forEach(function(db){
        var row = {};
        var tablesArray = [];
        
        db.tables.forEach(function(tableItem){
            tablesArray.push(tableItem["Tables_in_"+db.database]);
        });
        
        row[db.database] = tablesArray.join('\n').rainbow;
        output.push(row);
    });
    
    console.log(output.toString());
    
}).finally(
    function() {
        connection.end();
    }
);
