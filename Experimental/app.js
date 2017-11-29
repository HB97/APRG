const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mySql = require('mysql');
const session = require('express-session');

const reise = require('C:/Users/SvenM/OneDrive/Dokumente/GitShit/APRGlocal/client/reise');


/* //create connection to DB
const db = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'reisen'
        
});

db.connect((err)=> {
    if(err){
        console.log(err);
    }
    console.log('MySql connected');

});  */

const app = express();


const index = require('./routes/index')
const login = require('./routes/login')
const registrieren = require('./routes/registrieren')

const meineReisen = require('./routes/meineReisen');
const neueReise = require('./routes/neueReise');

//session setup
app.use(session({
    secret: 'this-is-a-secret',     //necessary for encoding
    resave: false,                  //should be set to false, except store needs it
    saveUninitialized: false        //same reason as above.
}));

//password hash, for encoding the pw
const passwordHash = require('password-hash');

//View Engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'client')));


app.use('/', index); 
app.use('/login', login);
app.use('/registrieren', registrieren);

app.use('/meineReisen', meineReisen);
app.use('/neueReise', neueReise); 



app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}); 



app.listen(8000, function(){
    console.log('Server launched');
})



