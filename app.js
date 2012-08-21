/*jshint laxcomma:true, forin:true, noarg:true, noempty:true, eqeqeq:true, laxbreak:true, bitwise:true, undef:true, curly:true, devel:true, node:true, indent:4, maxerr:50 */

/**
 * Module dependencies
 */

var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , routes = require('./routes');

// Go here to create a client ID: https://code.google.com/apis/console/b/0/
var GOOGLE_CLIENT_ID = ""; // define client ID here
var GOOGLE_CLIENT_SECRET = ""; // define client secret here
var googleCallbackURL = ""; // leave as "" here. Set it per environment under app.configure

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


/**
 * Configuration
 */

var app = module.exports = express.createServer();

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    googleCallbackURL = "http://127.0.0.1:3000/auth/google/callback";
});

app.configure('production', function () {
    app.use(express.errorHandler());
    googleCallbackURL = ""; // set this callback URL to the full http path to your app plus /auth/google/callback
});


// This has to stay below the development and production settings otherwise googleCallbackURL stays empty.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: googleCallbackURL
  },
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
    });
  }
));

/** 
 * Routes
 */

app.get('/', routes.index);

app.get('/admin', ensureAuthenticated, routes.adminGet);

app.post('/admin', ensureAuthenticated, routes.adminPost);

app.get('/login', function (req, res) {
    res.render('login', { title: 'Login', user: req.user });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
    function (req, res) {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
});

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/admin');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

/**
 * Start Server
 */

var port = process.env.PORT || 3000;
app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        var id = req.user.id;
        if (isAdmin(id)) {
            return next();
        } else {
        res.redirect('/login');
        }
    } else {
        res.redirect('/auth/google');
    }
}

function isAdmin(id) {
    var admins = [];
    var i = 0;
    admins = [ 
      // Add the google IDs of your admins here
    ];
    for (i = 0; i < admins.length; i++) {
        if (id === admins[i]) {
            return true;
        }
    }
    return false;
}
