const express = require('express');
const router = express.Router();

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
	
    // Datensatz definieren
    if (errors.length == 0) {
        console.log('Kein Fehler');
        const document = {'name': name, 'vname': vname, 'email': email, 'username': username, 'password': password, 'pwrepeat': pwrepeat};
    }
	else{
        console.log(errors);
    }
	
	/* db.collection(DB_COLLECTION).save(document, function(err, result){
		console.log('Datensatz gespeichert');
		res.redirect('/');
	}); */
});

module.exports = router;