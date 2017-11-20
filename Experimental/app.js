const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const reise = require('C:/Users/SvenM/OneDrive/Dokumente/GitShit/APRGlocal/client/reise');

const app = express();

const meineReisen = require('./routes/meineReisen');
const neueReise = require('./routes/neueReise');

//View Engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'client')));


app.use('/', meineReisen); 
app.use('/neueReise', neueReise); 

app.post('/name', (req, res)=>{
    var neueReise = reise(req.body.neuerName);
    console.log(neueReise);
}); 

//catch 404
/* 
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}); */



app.listen(8000, function(){
    console.log('Server launched');
})




