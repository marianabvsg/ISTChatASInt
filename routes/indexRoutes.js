const express = require('express');
const router = express.Router();
const path = require('path');
var cache = require('../services/cache.js');

router.get('/', function(req, res) {
    
    cache.getUserID(req.cookies.user, function(err,id) {
        if (id==undefined){
            // Encaminha para a página de login se não estiver logado
            res.sendFile(path.join(__dirname + '/../public/newindex.html'));
        } else {
            // Encaminha para a página de user se já estiver logado
            res.sendFile(path.join(__dirname + '/../public/newuser.html'));
	    }
    });

})

module.exports = router;
