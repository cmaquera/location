var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var login = require('./routes/login');
var http = require('http');
var app = express();
var server = http.createServer(app);
var cfenv = require('cfenv');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var appEnv = cfenv.getAppEnv();
var PORT = appEnv.port;
var HOST = appEnv.url;

app.use(session({
	secret: 'da illest developer',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.IP);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/chatf', login.checkAuthentication, login.chatf);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('host') + ':' + app.get('port'));
});

var io = require('socket.io').listen(server);
var users = [];
var usersfb = [];

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('setUsername', (data) => {
    console.log(data);
    if(users.indexOf(data.id) > -1){
    	io.emit('userExists', data.id + ' this id is taken! Try some other username.');
    }
    else{
    	console.log('Into to chat : ' + data.name)
    	users.push(data);
    	socket.emit('userSet', {username: data.name});
    }

  });
  socket.on('msg',(data) => {
  	//Send a message to everyone
    console.log(data.user + ' : ' + data.message);
    //console.log('Info del msg : ' + data.name);
  	io.sockets.emit('newmsg', data);

  });

  socket.on('userExit', (data) => {
    users.splice(users.indexOf(data));
  });

  socket.on('disconnect', (data) => {
    console.log(data);
    console.log('user disconnected');
  });

});



var User = null;
var FACEBOOK_APP_ID = '1603034783103352';
var FACEBOOK_APP_SECRET = 'a757ecc1fee9298212272419e2a4d6aa';
	
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://mionix-express-xxelchexx.c9users.io:8080/auth/facebook/callback",
    profileFields: ['name', 'picture.type(large)']
  },
  function(accessToken, refreshToken, profile, done) {
//    console.log(profile.name.givenName + ' ' + profile.name.familyName);
//    console.log(profile.photos[0].value);
//    console.log(profile.id);

    done(null, profile);
    /*
    User = {
      id: profile.id,
    	name: profile.name.givenName + ' ' + profile.name.familyName,
    	picture: profile.photos[0].value
    }
    */
    usersfb.push(profile.id);
    console.log(usersfb);
  }
));	
/*
app.get('/', function(req, res){
	res.send(user.id);
});*/

app.get('/facebook', function(req, res){
	res.send('<a href="/login">Login with Facebook</a>');
});

app.get('/login', passport.authenticate('facebook'));

app.get('/chat', checkAuthentication, function(req, res) {
    var name = req.session.passport.user.name.givenName + ' ' + req.session.passport.user.name.familyName;
    res.send('Entro al chat : ' + name); 
    //' --> this the picture' + '<img src="' + User.picture + '"></img>');
});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {  successRedirect: '/chatf',
                                		  failureRedirect: '/'}));
                                		  
function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      //if user is looged in, req.isAuthenticated() will return true 
      next();
      console.log('ESTA LOGEADO'); 
  } else{
      res.redirect("/facebook");
  }
}


