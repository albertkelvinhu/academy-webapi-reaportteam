'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = module.exports = loopback();
// var cookieParser = require('cookie-parser');
// var session = require('express-session');

// var flash = require('express-flash');

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  // app.use(loopback.token({
  //   headers: ['authorization']
  // }));

  // app.middleware('session:before', cookieParser(app.get('cookieSecret')));
  // app.middleware('session', session({
  //   secret: 'kitty',
  //   saveUninitialized: true,
  //   resave: true,
  // }));
  // app.use(flash());

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
