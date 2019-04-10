const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "1Eyebear!1",
    database: "bamazon_ts"
  });

  //Connecting to database
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Mysql is connected');
    getDatabase()
});



const getDatabase = () => {
    connection.query("SELECT * FROM products", (err, data) => {
    if (err) throw err;
    console.log(data)

     askCustomerForID(data)   

    });
};

const askCustomerForID = (data) =>{

    inquirer.prompt([
        {
            name: 'product_id',
            message: 'Please enter product id',
            type: 'input',

        },
       

    ]).then(userInput => {
        connection.query(`SELECT * FROM products WHERE item_id = ${userInput.product_id}`, (err, data) => {
            if (data[0]){
                inquirer.prompt([
                {
                    name: 'quantity',
                    message: `How many ${data[0].product_name}, would you like?`, 
                    type: 'input',
                }
            ])

            .then(qty =>{
                if(qty.quantity <= data[0].stock_quantity){
                
                const remainigQTY = data[0].stock_quantity - qty.quantity;

                connection.query(`UPDATE products SET stock_quantity = ${remainigQTY} WHERE item_id = ${userInput.product_id}`,(err, res) => {
                   console.log(res.affectedRows);
                    console.log(data[0].price * qty.quantity);
                })

                } else {
                    console.log('Quantity Not IN Stock')
                }
            })

            }else {
                console.log('item not found');
            }
        })

        }).catch(err => console.log(err));

    }

    
            
        
    




