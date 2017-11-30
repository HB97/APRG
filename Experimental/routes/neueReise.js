const express = require('express');
const router = express.Router();
const db = require('./db');


router.get('/', function(req, res, next){
    if(req.session.authenticated){
        res.render('NeueReise',{
            title: "Neue Reise",
            userName: req.session.user.nutzer_name
        });
    }
    else res.redirect('/');

});

router.post('/name', (req, res)=>{
    
    if(req.session.authenticated){
        let neueReiseName = req.body.neuerName;

        db.sendQueryToDB('SELECT r.reise_name FROM  Reisen r, benutzer_reisen br, benutzer b WHERE r.reise_id = br.reise_id AND br.nutzer_id = ? AND b.nutzer_id = ?', [req.session.user.nutzer_id,req.session.user.nutzer_id], function(reiseNamen){

            let vorhanden = false;
            let errors = [];

            reiseNamen.forEach(element => {
                if (neueReiseName = element.reise_name) vorhanden = true;
            });

            if (vorhanden){
                
                errors.push('Diese Reise gibt es bereits');
                res.render('errors', {
                    'error': errors,
                    url: '/neueReise',
                    pageName: 'Neue Reise'
                    
                });
                
            }
            else{
                db.sendQueryToDB('INSERT INTO Reisen(reise_name) VALUES (?)', neueReiseName, function(neueReise){
                    
                    console.log(neueReise.insertId);
                    
                    
                    db.sendQueryToDB('INSERT INTO benutzer_reisen(nutzer_id,reise_id) VALUES ( (SELECT nutzer_id from Benutzer WHERE nutzer_id = ?), (SELECT reise_id from Reisen WHERE reise_id = ?) )', [req.session.user.nutzer_id, neueReise.insertId], function(neuerEintrag){
                        console.log(neueReise);
                        console.log(neuerEintrag);
                        res.redirect('/meineReisen');

                    });
        
                });
            };
        });   
    }
    else res.redirect('/');
});





module.exports = router;