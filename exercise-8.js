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

connection.queryAsync("SELECT Account.id as accountId, Account.email as accountEmail, AddressBook.name as addressBookName, AddressBook.id as addressBookId, Entry.id as entryId, Entry.firstName as entryFirstName, Entry.lastName as entryLastName FROM Entry JOIN AddressBook ON Entry.addressBookId = AddressBook.id JOIN Account ON AddressBook.accountId = Account.id") 
.then(function(entriesArray){
    
    //console.log(addressbooks);
    //console.log(entriesArray[0][0]);
    
    var accounts = {};
    var through = 0;
    var accCount = 0;
    var entryCount = 0;
    
    var table = new Table();        
    table.push(['Account Id','Account Email','First AddressBook','Ten First Entries']);
    
    //console.log(entriesArray[0].length);
    entriesArray[0].forEach(function(e){
        if (accCount < 10){
            if (!accounts.hasOwnProperty(e.accountId)) {
                console.log(e.accountId + " doesn't exist");
                accounts[e.accountId] = {
                    email : e.accountEmail, 
                    firstAddressBookId : e.addressBookId,
                    firstAddressBookName : e.addressBookName,
                    entries : []
                };
                accounts[e.accountId].entries.push(e.entryFirstName +" "+ e.entryLastName);
                accCount++;
                //console.log(accCount);
            }
            else {
                accounts[e.accountId].entries.push(e.entryFirstName +" "+ e.entryLastName);
                console.log(e.accountId + ' exist');
            }
        }
        else {
            if (accounts.hasOwnProperty(e.accountId)){
                if (Object.keys(accounts[e.accountId].entries).length < 10) accounts[e.accountId].entries.push(e.entryFirstName +" "+ e.entryLastName);
            }
        }
    });
    
    Object.keys(accounts).forEach(function(accId){
        var tableRow = [];
        tableRow.push(accId.bold,accounts[accId].email.red,accounts[accId].firstAddressBookId,accounts[accId].firstAddressBookName,accounts[accId].entries.join('\n').rainbow);
        table.push(tableRow);
    });
        
    console.log(accounts);

    console.log(table.toString());;

}).finally(function() {
    connection.end();
}).catch(function(e){
    console.log("An error has occured.")
});