"use strict"
var loopback = require("loopback");
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;

module.exports = function(app) {

  // Passport configurators..
  var passportConfigurator = new PassportConfigurator(app);

  // attempt to build the providers/passport config
  var config = {};
  try {
    config = require('../../providers.json');
  }
  catch (err) {
    console.trace(err);
    process.exit(1); // fatal
  }

  var AccountModel = app.models.Account;
  var AccountIdentityModel = app.models.AccountIdentity;
  var AccountCredentialModel = app.models.AccountCredential;
  var AccessTokenModel = app.models.AccessToken;

  app.middleware('auth', loopback.token({
    model: AccessTokenModel,
  }));

  passportConfigurator.init();
  passportConfigurator.setupModels({
    userModel: AccountModel,
    userIdentityModel: AccountIdentityModel,
    userCredentialModel: AccountCredentialModel,
  });

  for (var s in config) {
    var c = config[s];
    c.session = c.session !== false;
    passportConfigurator.configureProvider(s, c);
  }

  app.get('/local', function(req, res, next) {
    res.send({
      user: req.user,
      url: req.url,
    });
  });

  app.get('/auth/account', function(req, res, next) {
    res.send({
      user: req.user,
      url: req.url,
    });
  });

}
