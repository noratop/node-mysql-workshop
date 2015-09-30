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

connection.queryAsync("SELECT id,email FROM Account LIMIT 10").then(function(accounts){

    return connection.queryAsync("SELECT name,accountId FROM AddressBook WHERE accountId IN ("+accounts[0].map(function(item){
        return item.id;
    }).join(',')+")")
    .then(function(result){
        
        var accountArray = [];
        
        accounts[0].forEach(function(account){
            
            var accountData = {
                'accountId': account.id,
                'accountEmail' : account.email,
                'addressBooks' : []
            };
            
            
            var addressbooks = [];
        
            result[0].forEach(function(ab){
                if (ab.accountId === accountData.accountId){
                    addressbooks.push(ab.name);
                }

            });   
            
            accountData.addressBooks = addressbooks.join('\n');
            
            accountArray.push(accountData);
        })
        
        var table = new Table();        

        table.push(['Account Id','Account Email','AddressBooks']);
    
        accountArray.forEach(function(elt){
            //console.log(elt);
            var id = "#"+elt.accountId+":";
            table.push([id.bold,elt.accountEmail.red,elt.addressBooks.rainbow]);
        });
        
        console.log(table.toString());;
    });
}).finally(function() {
    connection.end();
}).catch(function(e){
    console.log("An error has occured.")
});
