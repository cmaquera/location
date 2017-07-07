const passport = require('passport');
var User = null;

exports.login = function(req, res){
    passport.authenticate('facebook');
};

exports.chat = function(req, res){
    res.send('Entro al chat : ' + User.name + ' --> this the picture' + '<img src="' + User.picture + '"></img>');
};

exports.callback = function(req, res){
    passport.authenticate('facebook', {  successRedirect: '/chat', failureRedirect: '/' });
};