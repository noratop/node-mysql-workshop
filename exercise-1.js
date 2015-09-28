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

connection.queryAsync("SHOW DATABASES").then(
    function(results) {
    	var rows = results[0];
        //console.log(rows);
        var table = new Table();
        var databases=[];
        
        rows.forEach(function(elt){
            databases.push(elt.Database);
            //console.log(elt.Database);
        });
        
        //console.log(databases);
        table.push(['Database'],[databases.join('\n')]);
        console.log(table.toString());
    }
).finally(
    function() {
        connection.end();
    }
);
