const express = require('express');
const session = require('express-session');
const db = require('./db');
const router = express.Router();

router.get('/', (req, res)=>{
	if(!req.session.authenticated){
		res.redirect('/');
	}
	else{

        let userName = req.session.user.nutzer_name;

        delete req.session.authenticated;
        delete req.session.user;

		res.render(('Logout'),{
            title: 'Wiedersehen!',
            userName: userName
        });
	}

});


module.exports = router;