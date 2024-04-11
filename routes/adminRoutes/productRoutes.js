const con = require('../../db');
const express = require('express');
const multer = require('multer');
const productRoute = express.Router();
productRoute.use(express.static('public'));


const storeProductImage = multer.diskStorage({
    destination: (req, file, cb) => {
        //cb(null, '../public/products/images/');
        console.log(cb(null, '../public/products/images/'));
    },
    filename: (req, file, cb) => {
        const uniqsuf = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqsuf);
    }
    
});

const storeProductImages = multer({ storeProductImage: storeProductImage });

//const upload = multer({ dist: '../public/products/images' })
const fetchCategories = new Promise((resolve, reject) => {
    const sql = "select * from categories";
    con.query(sql, (err, result) => {
        if(err){
            reject(err);
        }else{
            resolve(result);
        }
    });  
});

productRoute.get('/', (req, res) => {
    let sql = "select * from products";
    con.query(sql, (err, result) => {
        if(err){
            req.flash('error', 'Failed to fetch products');
            res.redirect('/admin/products');
        }else{
            res.render('admin/products', { data: result });
        }
    });
});

productRoute.get('/add', async (req, res) => {
    try{
        const categories = await fetchCategories;

        res.render('admin/products/add', { 
            name: '',
            brand: '',
            category_id: '',
            original_price: '',
            offered_price: '',
            configuration: '',
            available_colors: '',
            is_available: '',
            categories
        });
    }catch(error){
        req.flash('error', 'Failed to fetch categories');
        res.redirect('/admin/products');
    } 
});

//productRoute.post('/add', storeProductImages.fields([{ name: 'images', maxCount: 5}, {name: 'videos', maxCount: 5}]), (req, res) => {
productRoute.post('/add', storeProductImages.none(), async (req, res) => {
    let name = req.body.name;
    let brand = req.body.brand;
    let category_id = req.body.category_id;
    let original_price = req.body.original_price;
    let offered_price = req.body.offered_price;
    let configuration = req.body.configuration;
    let available_colors = req.body.available_colors;
    let is_available = req.body.is_available; 
    let created_at = new Date(Date.now());
    created_at = created_at.toISOString().slice(0, 19).replace('T', ' ');
    
    const categories = await fetchCategories;

    const validationErrors = [];
    if(!name){
        validationErrors.push('Name is required.');
    }
    if(!brand){
        validationErrors.push('Brand is required.');
    }
    if(!category_id){
        validationErrors.push('category is required.');
    }
    if(!original_price){
        validationErrors.push('Original price is required.');
    }
    if(!offered_price){
        validationErrors.push('Offered price is required.');
    }
    if(!configuration){
        validationErrors.push('Configuration is required.');
    }
    if(!available_colors){
        validationErrors.push('Available colors is required.');
    }
    if(!is_available){
        validationErrors.push('Is available is required.');
    }

    if(validationErrors.length > 0){
        req.flash('error', validationErrors);
        res.render('admin/products/add', { 
            name: name,
            brand: brand,
            category_id: category_id,
            original_price: original_price,
            offered_price: offered_price,
            configuration: configuration,
            available_colors: available_colors || [],
            is_available: is_available,
            categories
        });
    }else{
        let data = {
            name: name,
            brand: brand,
            category_id: category_id,
            original_price: original_price,
            offered_price: offered_price,
            configuration: configuration,
            available_colors: JSON.stringify(available_colors),
            is_available: is_available,
            created_at: created_at
        };
        //console.log(data); return false;
        let sql = "insert into products SET ?";
        con.query(sql, data, (err, result) => {
            if(err){
                req.flash('error', 'Failed to insert the products');
                res.render('admin/products/add', { 
                    name: name,
                    brand: brand,
                    category_id: category_id,
                    original_price: original_price,
                    offered_price: offered_price,
                    configuration: configuration,
                    available_colors: available_colors || [],
                    is_available: is_available,
                    categories
                });
            }else{
                req.flash('success', 'Product inserted successfully');
                res.redirect('/admin/products');
            }
        });
    }        
});

productRoute.get('/edit/:id', async (req, res) => {    
    let id = req.params.id;
    let sql = "select * from products where id = " + id;
    const categories = await fetchCategories;
    con.query(sql, (err, result) => {
        if(err){
            req.flash('error', 'Failed to find the product');
            res.redirect('/admin/products');
        }else{
            res.render('admin/products/edit', {
                id: id,
                name: result[0]['name'],
                brand: result[0]['brand'],
                category_id: result[0]['category_id'],
                original_price: result[0]['original_price'],
                offered_price: result[0]['offered_price'],
                configuration: result[0]['configuration'],
                available_colors: result[0]['available_colors'],
                is_available: result[0]['is_available'],
                categories
            });
        }
    });
    
});

productRoute.post('/edit/:id', storeProductImages.none(), async (req, res) => {
    try{
        let id = req.params.id;
        let name = req.body.name;
        let brand = req.body.brand;
        let category_id = req.body.category_id;
        let original_price = req.body.original_price;
        let offered_price = req.body.offered_price;
        let configuration = req.body.configuration;
        let available_colors = req.body.available_colors;
        let is_available = req.body.is_available;
        let updated_at = new Date(Date.now());
        updated_at = updated_at.toISOString().slice(0, 19).replace('T', ' ');
    
        const categories = await fetchCategories;

        const validationErrors = [];
    if(!name){
        validationErrors.push('Name is required.');
    }
    if(!brand){
        validationErrors.push('Brand is required.');
    }
    if(!category_id){
        validationErrors.push('category is required.');
    }
    if(!original_price){
        validationErrors.push('Original price is required.');
    }
    if(!offered_price){
        validationErrors.push('Offered price is required.');
    }
    if(!configuration){
        validationErrors.push('Configuration is required.');
    }
    if(!available_colors){
        validationErrors.push('Available colors is required.');
    }
    if(!is_available){
        validationErrors.push('Is available is required.');
    }

        if(validationErrors.length > 0 ){
            req.flash('error', validationErrors);
            res.render('admin/products/edit', {
                id: id,
                name: name,
                brand: brand,
                category_id: category_id,
                original_price: original_price,
                offered_price: offered_price,
                configuration: configuration,
                available_colors: available_colors,
                is_available: is_available,
                categories
            });
        }else{
            let data = {
                name: name,
                brand: brand,
                category_id: category_id,
                original_price: original_price,
                offered_price: offered_price,
                configuration: configuration,
                available_colors: JSON.stringify(available_colors),
                is_available: is_available,
                updated_at: updated_at
            };
            
            let sql = "update products set ? where id = " + id;
            
            con.query(sql, data, (err, result) => {
                if(err){
                    req.flash('error', 'Failed to update the product');
                    res.render('admin/products/edit', {
                        id: id,
                        name: name,
                        brand: brand,
                        category_id: category_id,
                        original_price: original_price,
                        offered_price: offered_price,
                        configuration: configuration,
                        available_colors: available_colors,
                        is_available: is_available,
                        categories
                    });
                }else{
                    req.flash('success', 'Successfully updated the product');
                    res.redirect('/admin/products');
                }
            });
        }        
    }catch(error){
        req.flash('error', error);
        res.redirect('/admin/products');
    }
});

productRoute.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = "delete from products where id = " + id;
    
    con.query(sql, (err, result) => {
        if(err){
            req.flash('error', 'Failed to delete the product');
            res.redirect('/admin/products');
        }else{
            req.flash('success', 'Successfully deleted the product');
            res.redirect('/admin/products');
        }
    });
    
});

module.exports = productRoute;