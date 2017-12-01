const express = require('express');
const router = express.Router();
const db = require('./db');
const passwordHash = require('password-hash');

router.get('/', (req, res)=>{
    if(req.session.authenticated){
        res.render('Profil', {
            title: 'Profil: ' + req.session.user.nutzer_name,
            userName: req.session.user.nutzer_name,
            user: req.session.user
        
        });
    }
    else res.redirect('/');

});

router.post('/update',(req,res)=>{
    if(req.session.authenticated){

        const name = req.body['name'];
        const vname = req.body['vname'];
        const email = req.body['email'];
        const username = req.body['username'];
        const password = req.body['password'];
        const pwrepeat = req.body['pwrepeat'];
        
        let errors = [];
        
        if (name == "" || name == undefined) {
            errors.push('Bitte deinen Namen eingeben.');
        } 
        if (vname == "" || vname == undefined) {
            errors.push('Bitte deinen Vornamen eingeben.');
        } 
        if (email == "" || name == undefined) {
            errors.push('Bitte eine Emailadresse eingeben.');
        } 
        
        if (username == "" || username == undefined) {
            errors.push('Bitte deinen Benutzername eingeben.');
        } 
        
        if (passwordHash.verify(password, req.session.user.nutzer_pw)){

            if (password == "" || password == undefined) {
                errors.push('Bitte ein Passwort eingeben.');
            } 
            if (pwrepeat == "" || pwrepeat == undefined) {
                errors.push('Bitte ein Passwort zur Bestätigung eingeben.');
            } 
            if (password != pwrepeat) {
                errors.push('Die Passwörter stimmen nicht überein.');
            }
            
        }
        else errors.push('Falsches Passwort')

        let data = {'nutzer_name': name, 'nutzer_vorname': vname, 'nutzer_email': email, 'nutzer_username': username};
        
        if(errors.length == 0){
            db.sendQueryToDB('UPDATE benutzer SET ? WHERE nutzer_id = ?', [data,req.session.user.nutzer_id], function(ergebnis){
                
                console.log(ergebnis);
                db.sendQueryToDB('SELECT * FROM benutzer WHERE nutzer_id = ?', req.session.user.nutzer_id,function(aktualisierterUser){
                    
                    console.log(aktualisierterUser);
                    if(aktualisierterUser.length != 0){
                        req.session.user =  aktualisierterUser[0];
                        
                        res.render('Profil', {
                            title: 'Profil: ' + req.session.user.nutzer_name,
                            userName: req.session.user.nutzer_name,
                            user: req.session.user,
                            update: true
                                    
                        });
                    }
                    else{
                        errors.push('Schwerwiegender Datenbank-Fehler!');
                        res.render('errors', {
                            'error': errors,
                            url: '/nutzerBearbeiten',
                            pageName: 'Profil'
                            
                        });
                                                
                    }
                })

                
            })
        }
        else{
            console.log(errors);
            res.render('errors', {
                'error': errors,
                url: '/nutzerBearbeiten',
                pageName: 'Profil'
                
            });
        }
        
        
               
    }
    else res.redirect('/');



})

module.exports = router;