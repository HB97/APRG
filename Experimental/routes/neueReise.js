const express = require('express');
const router = express.Router();
const reise = require('C:/Users/SvenM/OneDrive/Dokumente/GitShit/APRGlocal/client/reise');

router.get('/', function(req, res, next){
    console.log('Neu');
    res.render('NeueReise',{
        title: "Neue Reise"
    });

});

router.post('/name', (req, res)=>{
    var neueReise = reise(req.body.neuerName);
    console.log(neueReise);
    res.redirect('/meineReisen');

});





module.exports = router;