require('dotenv').config();
const con = require('../../../db');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLoginApi = express.Router();

adminLoginApi.use(express.json());

adminLoginApi.post('/', async (req, res) => {
    const {email, password} = req.body;
    //console.log('email ' + email + ' password ' + password); return false;
    const sql = "select * from users where email = ?";

    await con.query(sql, email, async (err, result) => {
        if(err){
            return res.status(401).send({message: 'invalid mail-Id'});
        }else{            
            if(result.length > 0){
                const passCompare = await bcrypt.compare(password, result[0]['password']);

                if(passCompare){
                    const jwtToken = jwt.sign(result[0]['id'], process.env.JWT_TOKEN);
                    return res.status(200).send({token: jwtToken});
                }else{
                    return res.status(401).send({message: 'invalid user credentials'});
                }
            }else{
                return res.status(401).send({message: 'invalid mail-Id'});
            }
            
            
        }
    });
});

module.exports = adminLoginApi;