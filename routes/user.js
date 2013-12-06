var User = require('../models/user');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  User.getUsers(function(err,users){
        if(err){
            console.log(err);
        }else{
           res.render('users',{title:'userList',users:users.length}); 
        }       
  });
};
exports.loginPage = function(req,res){
    res.render('login',{title:'用户登录',subtitle:'账号'});    
}
exports.regPage = function(req,res){
    res.render('register',{title:'用户注册'});    
}
exports.regSubmit = function( req , res ){
    var user = {
        email:req.body['email'],
        nick:req.body['nick'],
        pass:req.body['pass']
    }
    var user = new User(user);
    user.addUser(function(err,user){
        if( err ){
            res.json('200',{code:'500',error:'系统错误！'});
            return;
        }
        res.json('200',{code:'SUC',msg:'注册成功'});
    });
}

//检查昵称是否已经存在
exports.checkNickIsExist = function( req , res ){
    var nick = req.query['nick'];
    User.nickIsExist(nick,nickIsExist);
    function nickIsExist(err,isExist){
        if( err ){
            res.json(500,{error:'系统错误！'});
            return;
        }
        res.json(200,{rs:isExist});
    }
}

exports.checkEmailsExist = function(req,res){
    var email = req.body['email'];
    User.emailIsExist(email,emailIsExist);
    function emailIsExist( err , isExist ){
        if(err){
            res.json(500,{error:'系统错误!'});
            return;
        }
        res.json(200,{rs:isExist});
    }

}

exports.checkUser = function(req,res){
    var user = new User({
        nick:req.body['username'],
        email:req.body['username'],
        pass:req.body['pass']
    });
    user.checkUser(checkUserHandler);
    function checkUserHandler(err,result){
        if( err ){
            res.json(500,{code:'500',error:'系统错误!'});
        }else{
           if( !!result.user ){
               req.session['user'] = result.user;
           }
           res.json(200,{code:result.code,user:result.user}); 
        }
    }
}
