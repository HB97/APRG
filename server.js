//Initialisierung des Webservers
const express = require('express');
const app = express();

// body-parser initialisieren
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// EJS Template Engine initialisieren
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');



app.listen(3000, function(){
	console.log("listening on 3000");
});


app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res){
    res.render ('login.ejs')
});

app.get('/Registrieren', function(req, res){
    res.render('Registrieren.ejs')
});

app.get('/errors', function(req, res){
    res.render('errors.ejs')
})

app.post('/onLogin', function(req, res){
	const username = req.body['username'];
	const password = req.body['password'];
	if (username == 'studi' && password == 'geheim'){
		console.log('Anmeldung erfolgreich');
		//req.session['authenticated'] = true;
		//req.session['user'] = username;
        res.redirect('/');
	}
	else{
		res.render('index', {'message': 'Anmeldung fehlgeschlagen!'});
	}		
});

const DB_COLLECTION = "Benutzerdaten"; //  bitte anpassen!
const Db = require('tingodb')().Db; 
const db = new Db(__dirname + '/tingodb', {}); 
const ObjectID = require('tingodb')().ObjectID;

app.post('/onRegistration', function(req,res){
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
    const document = {'name': name, 'vname': vname, 'email': email, 'username': username, 'password': password, 'pwrepeat': pwrepeat};
    }
	// Datensatz definieren
    const document = {'name': name, 'vname': vname, 'email': email, 'username': username, 'password': password, 'pwrepeat': pwrepeat};
	
	db.collection(DB_COLLECTION).save(document, function(err, result){
		console.log('Datensatz gespeichert');
		res.redirect('/');
	});
});
app.post('/onLogin', (request, response) => {
    
    const username = request.body.username;
    const password = request.body.password;
 
    let errors = [];
 
db.collection(DB_COLLECTION).findOne({'username': username}, (error, result) => {
    if (error) return console.log(error);

    if (result == null) {
        errors.push('Der User ' + username + 'existiert nicht.');
        response.render('/errors', {'error': errors});
        return;
    } 
    else {
        if (password == result.password) {
            response.redirect('/');
        } else {
            errors.push('Das Passwort für diesen User stimmt nicht überein.');
            response.render('/errors', {'error': errors});
        }
    }
});

});
