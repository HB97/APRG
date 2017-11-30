const express = require('express');
const router = express.Router();
const db = require('./db');


router.get('/', function(req, res, next){
    if(req.session.authenticated){
        res.render('NeueReise',{
            title: "Neue Reise"
        });
    }
    else res.redirect('/');

});

router.post('/name', (req, res)=>{
        let neueReiseName = req.body.neuerName;

        db.sendQueryToDB('INSERT INTO Reisen(reise_name) VALUES (?)', neueReiseName, function(neueReise){
            
            console.log(neueReise.insertId);
            
            
            db.sendQueryToDB('INSERT INTO benutzer_reisen(nutzer_id,reise_id) VALUES ( (SELECT nutzer_id from Benutzer WHERE nutzer_id = ?), (SELECT reise_id from Reisen WHERE reise_id = ?) )', [req.session.user.nutzer_id, neueReise.insertId], function(neuerEintrag){
                console.log(neueReise);
                console.log(neuerEintrag);
                res.redirect('/meineReisen');

            });

            
            
            
        });
    
        
        
        

});





module.exports = router;