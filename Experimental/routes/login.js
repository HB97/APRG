const express = require('express');
const session = require('express-session');
const db = require('./db');
const router = express.Router();
const passwordHash = require('password-hash');

router.get('/', (req, res)=>{
	if(!req.session.authenticated){
		res.render('Login',{
			title: 'Login'
		});
	}
	else{
		res.redirect('/meineReisen');
		console.log('Sie sind noch eingeloggt');
	}

});

router.post('/onLogin', function(req, res){
	var email = req.body['email'];
	var password = req.body['password'];
	let errors = [];

	//db.checkMail(email, function(user){
	db.sendQueryToDB('SELECT * FROM Benutzer WHERE nutzer_email = ?',email, function(user){	
		if (user.length == 0){
			console.log('hi das ist nicht da');
			errors.push('Dieser Nutzer existiert nicht')
			res.render('errors', {
				'error': errors,
				url: '/login',
				pageName: 'Login'
				
			});
		}
		else{
			console.log(user);
			
			console.log('nutzerid:' + user[0].nutzer_id);

			if (email == user[0].nutzer_email ){
				
				if (passwordHash.verify(password, user[0].nutzer_pw)){
				console.log('Anmeldung erfolgreich');
				req.session.authenticated = true; 
				/*req.session.username = user[0].nutzer_username;
				req.session.userID = user[0].nutzer_id; */
				req.session.user = user[0];

				res.redirect('/meineReisen');
				console.log(req.session.user);
				}
			
				else{
					errors.push('Passwort falsch!');
					res.render('errors', {
						'error': errors,
						url: '/login',
						pageName: 'Login'
						
					});
					/* res.redirect('/');
					console.log('error'); */
				}
			}
		}	
	});	
});


module.exports = router;