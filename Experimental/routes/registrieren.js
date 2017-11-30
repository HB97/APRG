const express = require('express');
const router = express.Router();
const db = require('./db');
const passwordHash = require('password-hash');

router.get('/', (req, res)=>{

    res.render('Registrieren', {
        title: 'Registration'
    });

});


router.post('/onRegistration', function(req,res){
    
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
        if (password == "" || password == undefined) {
            errors.push('Bitte ein Passwort eingeben.');
        } 
        if (pwrepeat == "" || pwrepeat == undefined) {
            errors.push('Bitte ein Passwort zur Bestätigung eingeben.');
        } 
        if (password != pwrepeat) {
            errors.push('Die Passwörter stimmen nicht überein.');
        }
        
        db.sendQueryToDB('SELECT nutzer_email FROM benutzer WHERE nutzer_email= ?',email,function(alleMails){
            console.log(alleMails);
            if(alleMails.length != 0){
                errors.push('Diese Email-Addresse wird bereits verwendet!');
            }

            // Datensatz definieren
            if (errors.length == 0) {
                
                
                let verchlüsseltesPasswort = passwordHash.generate(password);
                let data = {'nutzer_name': name, 'nutzer_vorname': vname, 'nutzer_email': email, 'nutzer_username': username, 'nutzer_pw': verchlüsseltesPasswort};
                db.insertBenutzer(data, function(){
                    
                    res.redirect('/login');
                    console.log('fertig');
                    console.log('Kein Fehler beim Erstellen eines neuen Nutzers');
                    
                });
                
            
            }
            else{
                console.log(errors);
                res.render('errors', {
                    'error': errors,
                    url: '/registrieren',
                    pageName: 'Registration'
                    
                });
            }
        });
        /* db.collection(DB_COLLECTION).save(document, function(err, result){
            console.log('Datensatz gespeichert');
            res.redirect('/');
        }); */
    
});

module.exports = router;