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

connection.queryAsync("SELECT id,email FROM Account LIMIT 10").then(function (result){
    return result[0];
}).map(function(account){
    return connection.queryAsync("SELECT name FROM AddressBook WHERE accountId = "+account.id).then(function (result){
        return {
            'accountId': account.id,
            'accountEmail' : account.email,
            'addressBooks' : result[0]
        }
    })
}).then(
    function(result) {
        
        //console.log(result);

        var table = new Table();        
        
        table.push(['Account Id','Account Email','AddressBooks']);
        
        result.forEach(function(elt){
            //console.log(elt);
            var id = "#"+elt.accountId+":";
            var abNamesList = elt.addressBooks.map(function(ab){
                //console.log(ab);
                return ab.name;
            });
            
        table.push([id.bold,elt.accountEmail.red,abNamesList.join('\n').rainbow]);

        });
        
        console.log(table.toString());
    }
).finally(
    function() {
        connection.end();
    }
);
