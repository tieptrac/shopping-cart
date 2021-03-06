var express = require('express');
var categoryRepo = require('../repos/categoryRepo');
var productRepo = require('../repos/productRepo');
var config = require('../config/config');

var router = express.Router();

router.get('/', (req, res) => {
    var newest = productRepo.loadByNewestOption(config.LIMIT_OPTION);
    var viewer = productRepo.loadByViewOption(config.LIMIT_OPTION);
    var sold = productRepo.loadBySoldOption(config.LIMIT_OPTION);
    var men = productRepo.loadAllByCatMen(config.LIMIT_OPTION);
    var women = productRepo.loadAllByCatWoMen(config.LIMIT_OPTION);
    Promise.all([newest, viewer, sold, men, women]).then(([newestRows, viewerRows, soldRows, menRows, womenRows]) => {
        var vm = {
            newestProducts: newestRows,
            viewerProducts: viewerRows,
            soldProducts: soldRows,
            menProducts: menRows,
            womenProducts: womenRows
        };  
        res.render('home/index', vm);
    });
});

router.get('/about', (req, res) => {
    res.render('home/about');
});

module.exports = router;