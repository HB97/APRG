const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{

    res.render('Login',{
        title: 'Login'
    });

});

router.post('/onLogin', function(req, res){
	const username = req.body['username'];
	const password = req.body['password'];
	if (username == 'studi' && password == 'geheim'){
		console.log('Anmeldung erfolgreich');
		//req.session['authenticated'] = true;
		//req.session['user'] = username;
        res.redirect('/meineReisen');
	}
	else{
		res.render('index', {'message': 'Anmeldung fehlgeschlagen!'});
	}		
});


module.exports = router;