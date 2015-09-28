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
  database : 'addressbook'
});

connection.queryAsync("SELECT id, email FROM Account LIMIT 10").then(
    function(results) {
    	var rows = results[0];
        //console.log(rows);
        
        var table = new Table({
          chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                 , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                 , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                 , 'right': '' , 'right-mid': '' , 'middle': ' ' },
          style: { 'padding-left': 0, 'padding-right': 0 }
        });        
        
        table.push(['Id','Email']);
        

        rows.forEach(function(elt){
            var id = "#"+elt.id+":";
            table.push([id.bold,elt.email]);

        });
        console.log(table.toString());
    }
).finally(
    function() {
        connection.end();
    }
);
