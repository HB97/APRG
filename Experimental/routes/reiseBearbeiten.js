const express = require('express');
const router = express.Router();
const db = require('./db');



router.get('/:id', (req, res)=>{
     
    if(req.session.authenticated){

        let reiseID = parseInt(req.params.id);
        console.log(reiseID);

        db.sendQueryToDB('SELECT reise_name FROM Reisen WHERE reise_id = ?', reiseID, function(reiseName){
            
            console.log(reiseName);
            res.render('ReiseBearbeiten', {
            title: reiseName[0].reise_name,
            userName: req.session.user.nutzer_name
        });

        });
       
        
    }
    else res.redirect('/');

});

module.exports = router;