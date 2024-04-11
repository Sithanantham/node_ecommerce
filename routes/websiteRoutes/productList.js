const con = require('../../db');
const express = require('express');

const productList = express.Router();

productList.use(express.static('public'));

productList.get('/', async (req, res) => {
    let sql = "select * from products where status = 1";
    await con.query(sql, async (err, products) => {
        if(err){
            res.send('Failed to find the products');
        }else{
            let userName = req.session.userName;
            let user_id  = req.session.userId;
            if(user_id){
                let sqlGetCart = "SELECT prd.name, prd.offered_price, atc.id, atc.qty from add_to_carts AS atc INNER JOIN products AS prd ON atc.product_id = prd.id where atc.user_id = ?"; 
                await con.query(sqlGetCart, user_id, (err, addToCartItems) => {
                    if(!err){
                        res.render('website/productList', {products, userName, addToCartItems});
                    }                   
                });
            }else{
                addToCartItems = [];
                res.render('website/productList', {products, userName, addToCartItems});
            }  
        }
    });
    
});

module.exports = productList;