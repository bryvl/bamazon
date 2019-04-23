const inquirer = require('inquirer');
const sql = require('mysql');

var connection = sql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "root",
    database: "bamazon_DB"
  });

var inventory = [];

connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("\nWelcome to Bamazon!\nCheck out our current listings: \n");
    readProducts();
    start();
    connection.end()
});

function readProducts(){
    var query = connection.query("SELECT * FROM products", function(err, results){
        if(err) throw err;

        for(var i=0; i < results.length; i++) {
            console.log(
                "Category: " + results[i].department_name.toUpperCase() + "\n" +
                "Item ID: " + results[i].item_id + "\n" +
                "Item: " + results[i].product_name + "\n" +
                "Price: " + results[i].price + "\n" +
                "In Stock: " + results[i].stock_quantity +
                "\n____________________________________________________"
            );
            inventory.push(results[i].item_id);
            console.log("Inventory: " + inventory);
        }
    })
}

function start(){
    connection.query("SELECT * FROM products", function(err, results){
        if(err) throw err;

        inquirer.prompt([
            {
            name: "whichToBuy",
            type: "rawlist",
            choices: inventory,
            message: "Please select the [Item ID] number you would like to buy."
        },
        {
            name: "howMany",
            type: "input",
            message: "What quantity of the Item would you like to buy?" 
        }
    ]).then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id === answer.whichToBuy) {
            chosenItem = results[i];
          }
        }
        // console.log(chosenItem.product_name);
        if(chosenItem.stock_quantity <= 0){
            console.log("We're all out of that! Please select another item to purchase.");
            start();
        }

        chosenItem.stock_quantity -= 1;
        console.log("Your total comes to $" + chosenItem.price + ". Thank you for shopping at Bamazon!");
        
        // start();
        });
    });
}