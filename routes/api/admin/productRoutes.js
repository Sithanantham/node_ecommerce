
const mysql = require('../../../db');
const express = require('express');
const jwt = require('jsonwebtoken');

const productRouteApi = express.Router();
productRouteApi.use(express.json());

productRouteApi.get('/', (req, res) => {
    res.send('product route');
});

module.exports = productRouteApi;