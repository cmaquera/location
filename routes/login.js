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

exports.chatf = function(req, res) {
    var id, name, photo;
    id = req.session.passport.user.id;
    name = req.session.passport.user.name.givenName + ' ' + req.session.passport.user.name.familyName;
    photo = req.session.passport.user.photos[0].value;
    
    res.render('chatf', { id : id, name: name, photo: photo });
};

exports.checkAuthentication = function(req,res,next){
  if(req.isAuthenticated()){
      //if user is looged in, req.isAuthenticated() will return true 
      //req.user = req.session.passport.user.name.givenName
      next();
      console.log('ESTA LOGEADO');
      /*console.log(req.session.passport.user.name.givenName + ' ' + req.session.passport.user.name.familyName);
      console.log(req.session.passport.user.photos[0].value);*/
      
  } else{
      res.redirect("/");
  }
};