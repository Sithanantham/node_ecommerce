const con = require('../../db');
const express = require('express');
const bcrypt = require('bcrypt');

const userLoginRoute = express.Router();

userLoginRoute.use(express.static('public'));

userLoginRoute.get('/login', (req, res) => {
    const email = '';
    res.render('website/userLogin', { email });
});

userLoginRoute.post('/login', (req, res) => {    
    const email = req.body.email;
    const password = req.body.password; 
    if(!email){
        req.flash('error', 'Enter username');
        res.render('website/userLogin', { email });
    }
    if(!password){
        req.flash('error', 'Enter password');
        res.render('website/userLogin', { email });
    }
    
    let sql = "select * from users where email = ?";
    con.query(sql, email, async (err, result) => {
        if(err){
            req.flash('error', 'Something went werong');
            res.render('website/userLogin', { email });
        }else{
            if(result.length > 0){
                let pass = result[0]['password'];
                let passMatch = await bcrypt.compare(password, pass);
                if(passMatch){   
                    const user = result[0];
                    req.session.userId = user.id;
                    req.session.userType = user.user_type;
                    req.session.userName = user.name;
                    if(req.session.productId){
                        res.redirect('/addToCart/' + req.session.productId);
                    }else{
                        res.redirect('/');
                    }                    
                }else{
                    req.flash('error', 'Wrong username or password');
                    res.render('website/userLogin', { email });
                }
            }else{
                
            }
        }
    });
});

userLoginRoute.get('/logout', (req, res) => {
    if(req.session){
        req.flash('success', 'Logged-out successfully');
        req.session.destroy();        
        res.redirect('/');
    }
});

module.exports = userLoginRoute;