exports.posts = function(req, res){
    res.render('posts',{title:'posts'}); 
};
exports.post = function(req, res){
    res.render('post',{title:'post',subtitle:'撰写文章'}); 
};
