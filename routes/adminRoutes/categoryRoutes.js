const con = require('../../db');
const express = require('express');

const categoryRoute = express.Router();

categoryRoute.use(express.static('public'));

categoryRoute.get('/', (req, res) => {
    var sql = "select * from categories";

    con.query(sql, (err, result) => {
        if(err){
            req.flash('error', 'Failed to fetch the categories');
            res.redirect('/admin/categories');
        }else{
            res.render('admin/categories', { data: result });
        }
    });
});

categoryRoute.get('/add', (req, res) => {
    res.render('admin/categories/add', { name: '' });
});

categoryRoute.post('/add', (req, res) => {
    let name = req.body.name;
    let created_at = new Date(Date.now());
    created_at = created_at.toISOString().slice(0, 19).replace('T', ' ');

    let formData = { name: name, created_at: created_at };

    let sql = "INSERT INTO categories SET ?";
    con.query(sql, formData, (err, result) => {
        if(err){
            req.flash('error', 'Failed to insert the record');
            res.render('admin/categories/add', { name: name });
        }else{
            req.flash('suceess', 'Category added successfully');
            res.redirect('/admin/categories');
        }
    });
});

categoryRoute.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    let sql = "select * from categories where id = " + id;
    con.query(sql, (err, result) => {
        if(err){
            req.flash('error', 'Failed to find the user');
            res.redirect('/admin/categories');
        }else{
            if(result.length){
                res.render('admin/categories/edit', { 
                    id: id, 
                    name: result[0]['name'] 
                });
            }else{
                req.flash('error', 'Failed to find the user');
                res.redirect('/admin/categories');
            }
            
        }
    });
});

categoryRoute.post('/edit/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let formData = {
        name: req.body.name 
    };
    let sql = "update categories set ? where id = " + id;
    con.query(sql, formData, (err, result) => {
        //console.log(result); return false;
        if(err){
            req.flash('error', 'Failed to update the category');
            res.render('admin/categories/edit', { id: id, name: name });
        }else{
            if(result.affectedRows){
                req.flash('success', 'Updated successfully');
                res.redirect('/admin/categories');
            }else{
                req.flash('error', 'Failed to update the category');
                res.render('admin/categories/edit', { id: id, name: name });
            }
        }
    });
});

categoryRoute.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = "delete from categories where id = " + id;
    con.query(sql, (err, result) => {
        if(err){
            req.flash('error', 'Deletion failed');
            res.redirect('/admin/categories');
        }else{
            if(result.affectedRows){
                req.flash('success', 'Deleted successfully');
                res.redirect('/admin/categories');
            }else{
                req.flash('error', 'Deletion failed');
                res.redirect('/admin/categories');
            }   
        }
    });
});

module.exports = categoryRoute;