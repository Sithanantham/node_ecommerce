const con = require('../../db');
const express = require('express');
const bcrypt = require('bcrypt');
const adminLoginRoute = express.Router();

adminLoginRoute.use(express.static('public'));

adminLoginRoute.get('/login', (req, res) => {
    res.render('admin/auth/login');
});

adminLoginRoute.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
    
        const validationError = [];
        if(!email){
            validationError.push('Email is required.');
        }
        if(!password){
            validationError.push('Password is required.');
        }
    
        if(validationError.length > 0){
            req.flash('error', validationError);
            res.redirect('/admin/login');
        }else{
            let sql = "select * from users where email = ?";
            
            await con.query(sql, email, async (err, result) => {
                if(err){
                    req.flash('error', 'query issue');
                    res.redirect('/admin/login');
                }else{
                    if(result[0]['user_type'] === 2){
                        const ispasswordMatch = await bcrypt.compare(password, result[0]['password']);
                        //console.log(ispasswordMatch); return false;
                        if(ispasswordMatch){
                            const user = result[0];
                            req.session.userId = user.id;
                            req.session.userType = user.user_type;
                            req.session.userName = user.name;
                            req.flash('success', `welcome to the admin page ${req.session.userName}`);
                            //console.log(req.session);
                            res.redirect('/admin/products');
                        }else{
                            req.flash('error', 'Invalid email or password');
                            res.redirect('/admin/login');
                        }
                    }else{
                        req.flash('error', 'You are not a authorised person to access this page');
                        res.redirect('/admin/login');
                    }
                    
                }
            });
        }
    }catch(error){
        req.flash('error', error + 'Failed to login');
        res.redirect('/admin/login');
    }
});

adminLoginRoute.get('/logout', (req, res, next) => {
    if(req.session){
        req.session.destroy();
        res.redirect('/admin/login');
    }
});

module.exports = adminLoginRoute;