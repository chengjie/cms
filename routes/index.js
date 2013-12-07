var user = require('./user');
var post = require('./post');

exports.index = function(req, res){
  res.render('index', { title: 'Express',subtitle:'首页' });
};
exports.users = function(req , res){
   user.list(req,res); 
}
exports.loginPage = function(req , res){
   user.loginPage(req,res); 
}
exports.regSubmit = function(req , res){
   user.regSubmit(req,res); 
}
exports.regPage = function(req , res){
   user.regPage(req,res); 
}
exports.checkNick = function(req , res){
   user.checkNickIsExist(req,res); 
}
exports.checkEmail = function(req , res){
   user.checkEmailsExist(req,res); 
}
exports.checkUser = function(req,res){
    user.checkUser(req,res);
}
exports.posts = function(req,res){
    post.posts(req,res);
}
exports.post = function(req,res){
    post.post(req,res);
}
exports.sysError = function(req,res){
    res.render('common/500', { title: 'Express' });
}
