const con = require('../../db');
const express = require('express');

const addToCart = express.Router();

addToCart.use(express.static('public'));

addToCart.get('/:id', (req, res) => {
    let productId = parseInt(req.params.id);

    if(req.session.userId){       
        let user_id  = req.session.userId;    
        
        let sql = "select * from add_to_carts where user_id = ? and product_id = ?";

        con.query(sql, [user_id, productId], (err, result) => {
            if(err){
                req.flash('error', 'Add to Cart failed');
                res.redirect('/');
            }
            if(result.length > 0){
                let updated_at = new Date(Date.now());
                updated_at = updated_at.toISOString().slice(0, 19).replace('T', ' ');                
                let qty = result[0]['qty'] + 1;

                let data = {
                    qty: qty,
                    updated_at: updated_at
                };

                let sqlUpdate = "update add_to_carts set ? where user_id = ? and product_id = ?";

                con.query(sqlUpdate, [data, user_id, productId], (err, result) => {
                    if(err){
                        req.flash('error', 'Add to Cart failed');
                        res.redirect('/');
                    }else{
                        //delete req.session.productId;
                        req.flash('success', 'Product successfully updated to Cart');
                        res.redirect('/');
                    }
                });
            }else{
                let created_at = new Date(Date.now());
                created_at = created_at.toISOString().slice(0, 19).replace('T', ' ');

                let data = {
                    user_id: user_id,
                    product_id: productId,
                    created_at: created_at
                };

                let sqlInsert = "insert into add_to_carts SET ?";

                con.query(sqlInsert, data, (err, result) => {
                    if(err){
                        req.flash('error', 'Add to Cart failed');
                        res.redirect('/');
                    }else{
                        //delete req.session.productId;
                        req.flash('success', 'Product successfully added to Cart');
                        res.redirect('/');
                    }
                });
            }
            
        });        
    }else{    
        req.session.productId = productId; 
        req.flash('error', 'Login to do Add to Cart');
        res.redirect('/user/login');
    }
});

addToCart.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    let user_id = req.session.userId;
    if(user_id){
        let sql = "delete from add_to_carts where id = ? and user_id = ?";
        con.query(sql, [id, user_id], (err, result) => {
            if(err){
                req.flash('error', 'Failed to delete the add to cart');
                res.redirect('/');
            }else{
                req.flash('success', 'Successfully deleted the add to cart');
                res.redirect('/');
            }
        });
    }    
});

module.exports = addToCart;