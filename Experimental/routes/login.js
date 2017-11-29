const express = require('express');
const session = require('express-session');
const db = require('./db');
const router = express.Router();

router.get('/', (req, res)=>{

    res.render('Login',{
        title: 'Login'
    });

});

router.post('/onLogin', function(req, res){
	var email = req.body['email'];
	var password = req.body['password'];
	
	//db.checkMail(email, function(user){
	db.sendQueryToDB('SELECT * FROM Benutzer WHERE nutzer_email = ?',email, function(user){	
		console.log(user);
		
		console.log('nutzerid:' + user[0].nutzer_id);

		if (email == user[0].nutzer_email && password == user[0].nutzer_pw){
			console.log('Anmeldung erfolgreich');
			req.session.authenticated = true; 
			/*req.session.username = user[0].nutzer_username;
			req.session.userID = user[0].nutzer_id; */
			req.session.user = user[0];

			res.redirect('/meineReisen');
			console.log(req.session.user);
		}
		else{
			res.redirect('/');
		}	
	});	
});


module.exports = router;