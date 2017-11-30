const express = require('express');
const router = express.Router();
const db = require('./db');


router.get('/', function(req, res){
    if(req.session.authenticated){
        res.render('NeueReise',{
            title: "Neue Reise",
            userName: req.session.user.nutzer_name
        });
    }
    else res.redirect('/');

});

router.get('/mitglieder', (req, res)=>{
    if(req.session.authenticated){
        res.render('MitgliederHinzufügen',{
            title: "Mitglieder Hinzufügen",
            userName: req.session.user.nutzer_name
        });
    }
    else res.redirect('/');

});

router.post('/name', (req, res)=>{
    
    if(req.session.authenticated){
        let neueReiseName = req.body.neuerName;

        db.sendQueryToDB('SELECT r.reise_name FROM  Reisen r, benutzer_reisen br, benutzer b WHERE r.reise_id = br.reise_id AND br.nutzer_id = ? AND b.nutzer_id = ?', [req.session.user.nutzer_id,req.session.user.nutzer_id], function(reiseNamen){
            //console.log(reiseNamen);
            console.log(neueReiseName);
            let vorhanden = false;
            let errors = [];
            if(reiseNamen != null){
                reiseNamen.forEach(element => {
                    
                    if (neueReiseName == element.reise_name) vorhanden = true;
                });
            }
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
                    req.session.reiseID = neueReise.insertId;
                    
                    db.sendQueryToDB('INSERT INTO benutzer_reisen(nutzer_id,reise_id) VALUES ( (SELECT nutzer_id from Benutzer WHERE nutzer_id = ?), (SELECT reise_id from Reisen WHERE reise_id = ?) )', [req.session.user.nutzer_id, neueReise.insertId], function(neuerEintrag){
                        console.log(neueReise);
                        console.log(neuerEintrag);
                        res.redirect('/neueReise/mitglieder');

                    });
        
                });
            };
        });   
    }
    else res.redirect('/');
});

router.post('/neueMitglieder', (req, res)=>{

    let mails = [];
    let errors = [];
    let userIds = [];

    for(i=0; i<6; i++){
        if(req.body['addresse'+i] != ''){
            mails.push(req.body['addresse'+i]);
            
        }
    }
    db.sendQueryToDB('SELECT nutzer_id FROM benutzer WHERE nutzer_email = ?',mails[0],function(userIdFromDB){
        
        
        if(userIdFromDB.length == 0){
            errors.push('Es existiert kein Nutzer mit der Email-Addresse: ' + mails[0]);
            delete req.session.reiseID;
            res.render('errors', {
                'error': errors,
                url: '/meineReisen',
                pageName: 'Meine Reisen'
                
            });

        }
        else{
            console.log(userIdFromDB);
            console.log(userIdFromDB[0].nutzer_id);
            let id = userIdFromDB[0].nutzer_id;
            if(id != req.session.user.nutzer_id){
                db.sendQueryToDB('INSERT INTO benutzer_reisen(nutzer_id,reise_id) VALUES ( (SELECT nutzer_id from Benutzer WHERE nutzer_id = ?), (SELECT reise_id from Reisen WHERE reise_id = ?) )', [id, req.session.reiseID], function(neuerEintrag){
                    console.log('connected ' + id + ' ' + req.session.reiseID);
                    console.log(neuerEintrag);
                    
                    delete req.session.reiseID;
                    res.redirect('/meineReisen'); 
                    console.log('keine fehler');

                });
            }
            else {
                errors.push('Sie sind bereits Mitglied');
                res.render('errors', {
                    'error': errors,
                    url: '/meineReisen',
                    pageName: 'Meine Reisen'
                    
                });
            }
        }
       
    })


});


//async benötigt:
/* router.post('/neueMitglieder', (req, res)=>{
    
    
    
    
    let addUsersToJourney = function(callback){

        let mails = [];
        let errors = [];
        let userIds = [];

        for(i=0; i<6; i++){
            if(req.body['addresse'+i] != ''){
                mails.push(req.body['addresse'+i]);
                
            }
        }
        console.log(mails);
        mails.forEach(element =>{

            db.sendQueryToDB('SELECT nutzer_id FROM benutzer WHERE nutzer_email = ?',element,function(userIdFromDB){
                console.log(userIdFromDB);
                console.log(userIdFromDB.nutzer_id);
                console.log( ' useridfromdb');
                if(userIdFromDB.length == 0){
                    errors.push('Es existiert kein Nutzer mit der Email-Addresse: ' + element);
                    console.log('es exist');

                }
                else{
                    db.sendQueryToDB('INSERT INTO benutzer_reisen(nutzer_id,reise_id) VALUES ( (SELECT nutzer_id from Benutzer WHERE nutzer_id = ?), (SELECT reise_id from Reisen WHERE reise_id = ?) )', [userIdFromDB.nutzer_id, req.session.reiseID], function(neuerEintrag){
                        console.log('connected ' + userIdFromDB + ' ' + req.session.reiseID);
                        console.log(neuerEintrag + ' neure eintrag ');
                        

                    });
                }
                


            });              
            console.log(errors);


        });
        callback(errors);
    };
    addUsersToJourney(function(errors){
        console.log(errors);
        if(errors.length != 0){
            res.render('errors', {
                'error': errors,
                url: '/meineReisen',
                pageName: 'Meine Reisen'
                
            });

        }
        else{
        console.log('noErrror');
        res.redirect('/meineReisen');
        }
    });

}); */

/* router.post('/neueMitglieder', (req, res)=>{

    let mails = [];
    let errors = [];
    let userIds = [];

    for(i=0; i<6; i++){
        if(req.body['addresse'+i] != ''){
            mails.push(req.body['addresse'+i]);
            
        }
    }
    console.log(mails);
    db.sendQueryToDB('SELECT nutzer_id FROM benutzer WHERE nutzer_email IN ?',(mails[0],mails[1]),function(userIdFromDB){

        console.log(userIdFromDB);
        if(userIdFromDB.nutzer_id == undefined){
            errors.push('Es existiert kein Nutzer mit der Email-Addresse: ' + mails[0]);
            console.log('es exist');

        }
        if(errors.length != 0){
            res.render('errors', {
                'error': errors,
                url: '/meineReisen',
                pageName: 'Meine Reisen'
                
            });
        }

    });
    




}); */




module.exports = router;