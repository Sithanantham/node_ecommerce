const con = require('../../db');
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const userRoute = express.Router();
userRoute.use(express.static('public'));

userRoute.get('/', (req, res) => {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
        if(!err){
            res.render('admin/users', {data: result});
        }else{
            req.flash('error', 'failed to fetch the users data');
            res.redirect('/admin/users', {data: ''});
        }
    });
});

userRoute.get('/add', (req, res) => {
    res.render('admin/users/add', {
        name: '',
        user_type: '',
        email: '',
        phone: '',
        dob: ''
    });
});

userRoute.post('/add', async (req, res) => {
    let name= req.body.name;
    let user_type = req.body.user_type;
    let email = req.body.email;
    let password = await bcrypt.hash(req.body.password, 10);
    let phone = req.body.phone;
    let dob = req.body.dob;
    let created_at = new Date(Date.now());
    created_at = created_at.toISOString().slice(0, 19).replace('T', ' ');
    //console.log(password); return false;
    let formData = {
        name: name,
        user_type: user_type,
        email: email,
        password: password,
        phone: phone,
        dob: dob,
        created_at: created_at
    };

    if(!name || !user_type || !email || !password || !phone || !dob){
        req.flash('error', 'Please fill all the mandatory fields');
        res.render('admin/users/add', {
            name: name,
            user_type: user_type,
            email: email,
            phone: phone,
            dob: dob
        });        
    }else{
        let sql = "INSERT INTO users SET ?";
        con.query(sql, formData, (err, result) => {
            if(!err){
                req.flash('success', 'Users added successfully');
                res.redirect('/admin/users');
            }else{
                req.flash('error', 'Facing difficulties to add the user');
                res.render('admin/users/add', {
                    name: name,
                    user_type: user_type,
                    email: email,
                    phone: phone,
                    dob: dob
                });
            }
        });
    }    
});

userRoute.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    let sql = "SELECT * FROM users where id = " + id;
    con.query(sql, (err, result) => {
        if(!err){
            if(result.length){
                let date = result[0];
                date.dob = new Date(date.dob);
                res.render('admin/users/edit', {
                    id: id,
                    name: result[0]['name'],
                    user_type: result[0]['user_type'],
                    email: result[0]['email'],
                    phone: result[0]['phone'],
                    dob: date.dob.toISOString().slice(0, 10)});
            }else{
                req.flash('error', 'User not found');
                res.redirect('/admin/users');                 
            }            
        }else{
            req.flash('error', 'User not found');
            res.redirect('/admin/users');
        }
    });
});

userRoute.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let user_type = req.body.user_type;
    let email = req.body.email;
    let phone = req.body.phone;
    let dob = req.body.dob;
    let updated_at = new Date(Date.now());
    updated_at = updated_at.toISOString().slice(0, 19).replace('T', ' ');

    let formDate = {
        name: name,
        user_type: user_type,
        email: email,
        phone: phone,
        dob: dob,
        updated_at: updated_at
    };
    
    let sql = "UPDATE users SET ? where id = " + id;

    con.query(sql, formDate, (err, result) => {
        if(!err){
            req.flash('success', 'User updated successfully');
            res.redirect('/admin/users');
        }else{
            req.flash('error', 'Failed to updated the  user');
            res.render('admin/users/edit', {
                id: id,
                name: name,
                user_type: user_type,
                email: email,
                phone: phone,
                dob: dob
            });
        }
    });

});

userRoute.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = "DELETE FROM users where id = " + id;

    con.query(sql, (err, result) => {
        if(err){
            req.flash('error', 'Failed to delete the user');
            res.redirect('/admin/users');
        }else{
            req.flash('success', 'User deleted successfully');
            res.redirect('/admin/users');
        }
    });
});

module.exports = userRoute;