const mySql = require('mysql');
const db = mySql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'reisekostensplitter',
    connectionLimit: 10
                
});


exports.insertBenutzer = function(data, callback){
    let sql = 'INSERT INTO Benutzer SET ?';

    db.getConnection((err, connection)=>{    
        
        if(err){
            console.log(err);
            
        }
        else{
            let query = connection.query(sql, data, (err, res)=>{
                connection.release();
                if(err){
                    console.log(err);
                    
                }
                else{

                console.log(res);
                callback(res);
                }
                
            });
        }
    });
}


/* exports.checkMail = function(mail, callback){
   
    let sql = 'SELECT * FROM Benutzer WHERE nutzer_email = ?';
    
        db.getConnection((err, connection)=>{    
            
            if(err){
                console.log(err);
        
            }
            else{
                let query = connection.query(sql, mail, (err, rows)=>{
                    connection.release();
                    if(err){
                        console.log(err);
                        
                    }
                    else{

                        if(rows.length != 1){
                            console.log('mehr elemente');
                        }
                        else{
                            user = rows;
                            console.log(user + 'shit'); 
                            
                            
                        }
                        
                        callback(user);
                    
                    }
                    
                   
                });
            }
        });
    
    
    
} */

exports.sendQueryToDB = function(sqlQuery, data, callback) {
    db.getConnection((err, connection) => {
        if(err) return console.log(err);
        else {
            let query = connection.query(sqlQuery, data, (err, res)=> {
                connection.release()
                if(err) return console.log(err);
                else {
                
                callback(res);
                };
            });
        };
    });

}



/* exports.getReiseByUserID = function(userID, callback){
    let sql = 'SELECT * FROM Reisen WHERE  ?';
    
        db.getConnection((err, connection)=>{    
            
            if(err){
                console.log(err);
                
            }
            else{
                let query = connection.query(sql, data, (err, res)=>{
                    connection.release();
                    if(err){
                        console.log(err);
                        
                    }
                    else{
    
                    console.log(res);
                    callback(res);
                    }
                    
                });
            }
        });
    } */