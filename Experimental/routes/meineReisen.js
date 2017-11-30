const express = require('express');
const router = express.Router();
const db = require('./db');





router.get('/', function(req, res){
    
    if(req.session.authenticated){
        
        let reisen = [];
        
        db.sendQueryToDB('SELECT * FROM  Reisen r, benutzer_reisen br, benutzer b WHERE r.reise_id = br.reise_id AND br.nutzer_id = ? AND b.nutzer_id = ?', [req.session.user.nutzer_id,req.session.user.nutzer_id], function(reiseNamen){
        
        
            reiseNamen.forEach(element => {
                reisen.push(element);
            });

            //console.log(reisen);
            
            res.render('MeineReisen',{
            title: 'Deine Reisen',
            userName: req.session.user.nutzer_name,
            reisen: reisen
            

            });

        });
        
    }
    else{
        res.redirect('/');
    }

});


module.exports = router;
