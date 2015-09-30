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

connection.queryAsync("SELECT Account.id as accountId, Account.email as accountEmail, AddressBook.name as addressBookName FROM AddressBook JOIN Account ON AddressBook.accountId = Account.id")
.then(function(addressbooks){
    
    //console.log(addressbooks);
    
    var accounts = {};
    
    var table = new Table();        
    table.push(['Account Id','Account Email','AddressBooks']);
    
    addressbooks[0].forEach(function(ab){
        
        if (accounts.hasOwnProperty(ab.accountId)) {
            accounts[ab.accountId].addressBooks.push(ab.addressBookName);
        }
        else {
            accounts[ab.accountId] = {email: ab.accountEmail, addressBooks:[ab.addressBookName]};
        }
    });
    
    Object.keys(accounts).forEach(function(accId){
        var tableRow = [];
        tableRow.push(accId.bold,accounts[accId].email.red,accounts[accId].addressBooks.join('\n').rainbow);
        table.push(tableRow);
    });
        
    //console.log(accounts);

    console.log(table.toString());;

}).finally(function() {
    connection.end();
}).catch(function(e){
    console.log("An error has occured.")
});