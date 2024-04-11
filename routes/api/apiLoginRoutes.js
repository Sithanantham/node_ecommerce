require('dotenv').config();
const con = require('../../db');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const apiLoginRoute = express.Router();

apiLoginRoute.use(express.json());

const data = [
    {
        name: 'sith',
        age: 10
    },
    {
        name:'ananth',
        age: 5
    }
];

apiLoginRoute.get('/', (req, res) => {
    res.json(data);
});

apiLoginRoute.post('/', async (req, res) => {
    const {email, password} = req.body;

    const sql = "select * from users where email = ?";

    await con.query(sql, email, async (err, result) => {
        if(err){
            return res.status(401).send({message: 'failed to login'});
        }else{
            const userPass = result[0]['password'];
            const isPassMatch = await bcrypt.compare(password, userPass);

            if(isPassMatch){
                const accessToken = jwt.sign(result[0]['id'], process.env.JWT_TOKEN);
                res.send({accessToken: accessToken});
            }else{
                return res.status(401).send({message: 'password not match'});
            }
        }
    });
});

apiLoginRoute.get('/get-user/:id', (req, res) => {
    const id = req.params.id;
    let sql = "select * from users where id = " + id;

    con.query(sql, (err, result) => {
        if(err){
            return res.status(401).send({message: 'user not found'});
        }else{
            res.send({result: result});
        }
    });
});


module.exports = apiLoginRoute;