const express = require('express');
const router = express.Router();

var reisen = [
    {
        name: 'Mallorca',
        date: '2.2.2000'

    },

    {
        name: 'Schwarzwald',
        date: '3.3.3000'
    }


]

router.get('/', function(req, res){

    if(req.session.authenticated){
        res.render('MeineReisen',{
            title: 'Deine Reisen',
            reisen: reisen
        });
    }
    else{
        res.redirect('/');
    }

});


module.exports = router;
