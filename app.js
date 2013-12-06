
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var RedisStore = require('connect-redis')(express);
//var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser());
app.use(express.cookieSession({secret:'keyboard cat',store: new RedisStore()}));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(function(req,res,next){
    app.locals.session = req.session;
    var session = app.locals.session;
    var path = req.path;
    console.log(path + '\n');
    var reg = /^\/user(\/\w+)*?$/;
    if(!session.user && reg.test(path) ){//如果session.user不存且是登录用户的页面，则放行
        console.log('unlogin ....\n');
        res.json(200,{code:'UNLOGIN',msg:'用户未登录'}); 
    }else{
        console.log('not user\'s path or logined ... \n');
        next(); 
    }
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/user/users', routes.users);
app.get('/login', routes.loginPage);
app.get('/reg', routes.regPage);
app.post('/reg', routes.regSubmit);
app.get('/checkNick', routes.checkNick);
app.post('/checkEmail', routes.checkEmail);
app.post('/login', routes.checkUser);
app.get('/user/posts', routes.posts);
app.get('/user/post', routes.post);
app.get('/500',routes.sysError);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
