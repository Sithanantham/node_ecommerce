const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    pass: '',
    database: 'node_amazon_ecom' 
});

/* con.connect((err) => {
    if(!err){
        console.log('mysql server connected');
    }
}); */

module.exports = con;
