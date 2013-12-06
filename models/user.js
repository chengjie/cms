var db = require('./db.js');

module.exports = User;
function User(user){
   this.id = user.id;
   this.nick = user.nick;
   this.pass = user.pass;
   this.email = user.email;
   this.status = user.status;
}

User.getUsers = function(callback){
    db.getConnection(function(err,connection){
        var sql = 'select * from user';   
        connection.query(sql,function(err,rows){
            connection.destroy();
            if(err){
                return callback(err,null);
            }else{
                var users = [];
                rows.forEach(function(i,item){
                    var user = new User({
                        id:item.user_id,
                        nick:item.user_nick,
                        pass:item.user_pass,
                        status:item.user_status
                    });
                    users.push(user);
                });
                return callback(null,users);
            }
        });
    }); 
}

User.prototype.addUser = function( callback ){
    var user = {
        user_nick:this.nick,
        user_pass:this.pass,
        user_email:this.email
    }
    db.getConnection(connectionHandler);
    function connectionHandler(err,connection){
        if( err ){
            callback(err,null);
            return;
        }
        var sql = 'INSERT INTO user SET ?';
        connection.query(sql,user,queryHandler);
        function queryHandler(err,result){
            connection.destroy();
            if( err ){
                callback(err,null);
                return;
            }        
            callback(null,result.insertId);
        }

    }
}

User.prototype.checkUser = function(callback){
    var nick = this.nick;
    var email = this.email;
    var pass = this.pass;
    
    var _s = this;

    nickIsExist(nick,function(err,result){
        if( err ){
            callback(err,null);
            return;
        } 
        if( !!result && result.isExist ){
            passIsRight('user_nick',nick,_s,passCheck);
        }else{
           emailIsExist(email,function(err,result){
               if( err ){
                    callback(err,null);
               }
               if( !!result && result.isExist ){
                    passIsRight('user_email',email,_s,passCheck);
               }else{
                    callback(null, {code:'FAIL_00',user:null});//用户不存在
               }        
            }); 
        }        
    });
    

    function passCheck(err,isRight,user){
        if( err ){
            callback(err,null);
            return ;
        }
        if( isRight ){
            callback(null, {code:'SUC',user:user});
        }else{//密码错误
            callback(null, {code:'FAIL_01',user:null});
        }
        
    }
    

}

User.nickIsExist =  nickIsExist;
function nickIsExist( nick,callback ){
    
    keyIsExist('user_nick',nick,callback);
    
}
User.emailIsExist = emailIsExist;
function emailIsExist( email,callback ){
    
    keyIsExist('user_email',email,callback);
    
}
User.passIsRight = passIsRight;
function passIsRight(key,value,user,callback){
    db.getConnection(connectionHandler);
    function connectionHandler(err,connection){
        var sql = 'select * from user where '+key+'=? and user_pass = ? ';
        connection.query(sql,[value,user.pass],queryHandler);
        function queryHandler( err , rows ){
            connection.destroy();
            if( err ){
                callback(err,false);
                return;
            }
            if( rows.length ==1 ){
                callback(null,true,rows[0]);
            }else{
                callback(null,false,null);
            }
            
        }
    }
}
function keyIsExist(key,value,callback){
    queryByKey(key,value,queryCallBack);
    function queryCallBack(err,rows){
        if( err ){
            callback(err,null);
            return;
        }
        var isExist = rows.length == 1 ? true : false; 
        callback(null,{isExist:isExist});
    }
}

function queryByKey(key,value,callback){

    db.getConnection(connectionHandler);
    function connectionHandler(err,connection){
        var sql = 'select * from user where ' + key +' = ?';
        connection.query(sql,[value],queryHandler);
        function queryHandler(err,rows){
            connection.destroy();
            if( err ){
                callback(err,null);
                return;
            }
            callback(null,rows);
        }
    }
    
}
