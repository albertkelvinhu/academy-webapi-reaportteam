'use strict';
var app = require('../../server/server');
var async = require("async");

module.exports = function (Account) {

  // async.parallel({
  //   account: async.apply(initializeAccount)
  // }, (error, results) => {
  //   if (error) throw error;
  //   var account = results.account;
  //   createProfile(account)
  //   console.log('> models created sucessfully');
  // })

  Account.observe('before save', function event(context, next) {
    var data = context.instance || context.data;
    data.emailVerified = true;
    next();
  });

  Account.countAssigment = function (id,cb){
    app.models.Assignment.find({where: {and: [{accountId: id},{status: "closed"}]}},function(err, assigments){
      if(err || id === 0)
         return cb(err);
      else {
        var count = 0;
        var closed = 0;
        for(var items of assigments){
            closed++;
        }
         console.log(closed);
         cb(null, closed);
      }
    })
  };

   Account.remoteMethod("countAssigment",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/:id/count/closedAssignment", verb: "get", errorStatus: 401,},
        description: ["Get number of assignments every Account"],
        returns: {arg: "closed", type: "number"}
    })


  Account.coba = function (username, password, email, profile, callback) {

    Account.create({
      realm: "moonlay",
      username: username,
      password: password,
      email: email
    }, (error, account) => {
      if (error)
        callback(error);

      var Profile = app.models.Profile;
      profile.accountId = account.id;
      Profile.create(profile, (error, profile) => {
        if (error) {
          Account.destroyById(account.id, () => {
            callback(error);
          });
        }
        else
          callback(null, {});
      })
    })
  };
  Account.remoteMethod(
    'coba',
    {
      accepts: [
        { arg: 'username', type: 'string' },
        { arg: 'password', type: 'string' },
        { arg: 'email', type: 'string' },
        { arg: 'profile', type: 'object' }
      ],
      http: {
        verb: "post",
        path: "/coba"
      },
      returns: { arg: 'Account', type: 'object' }
    }
  );

  Account.countAssigment = function (id,cb){
    app.models.Assignment.find({where: {and: [{accountId: id},{status: "closed"}]}},function(err, assigments){
      if(err || id === 0)
         return cb(err);
      else {
        var count = 0;
        var closed = 0;
        for(var items of assigments){
          count++;
          if (items.status === "closed"){
            closed++;
          }
        }
         console.log(closed);
         cb(null, closed);
      }
    })
  };

  Account.remoteMethod("countAssigment",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/:id/count/closedAssignment", verb: "get", errorStatus: 401,},
        description: ["Get number of assignments every Account"],
        returns: {arg: "closed", type: "number"}
  })

Account.countWorkHour = function (id,cb){
    app.models.Assignment.find({where: {and: [{accountId: id},{status: "closed"}]}},function(err, assigments){
      if(err || id === 0)
         return cb(err);
      else {
        var elapsed = 0;
        var budget = 0;
        for(var items of assigments){
          if (items.status === "closed"){
            budget = budget + items.budget;
            elapsed = elapsed + items.elapsed;
          }
        }
        console.log(elapsed);
        cb(null, elapsed);
      }
    })
  };

  Account.remoteMethod("countWorkHour",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/:id/count/workHour", verb: "get", errorStatus: 401,},
        description: ["Get work hour every Account"],
        returns: {arg: "elapsed", type: "number"}
  })

Account.countBudgetHour = function (id,cb){
    app.models.Assignment.find({where: {and: [{accountId: id},{status: "closed"}]}},function(err, assigments){
      if(err || id === 0)
         return cb(err);
      else {
        var budget = 0;
        for(var items of assigments){
          if (items.status === "closed"){
            budget = budget + items.budget;
          }
        }
        console.log(budget);
        cb(null, budget);
      }
    })
  };

  Account.remoteMethod("countBudgetHour",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/:id/count/budget", verb: "get", errorStatus: 401,},
        description: ["Get work hour every Account"],
        returns: {arg: "budget", type: "number"}
  })

Account.countEfficiency = function (id,cb){
    app.models.Assignment.find({where: {and: [{accountId: id},{status: "closed"}]}},function(err, assigments){
      if(err || id === 0)
         return cb(err);
      else {
        var elapsed = 0;
        var budget = 0;
        var efficiency = 0;

        for(var items of assigments){
          budget = budget + items.budget;
          elapsed = elapsed + items.elapsed;
        } 
        efficiency = (elapsed/budget)*100 ;
        console.log(efficiency);
        cb(null, efficiency);
      } 
    })
  };

  Account.remoteMethod("countEfficiency",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/:id/count/efficiency", verb: "get", errorStatus: 401,},
        description: ["Get efficiency every Account"],
        returns: {arg: "efficiency", type: "decimal"}
  })

  
Account.countEfficiencyPerDate = function (id,date,cb){
    app.models.Assignment.find({where: {and: [{accountId: id},{date: date}]}},function(err, assigments){
      if(err || id === 0)
         return cb(err);
      else {
        var elapsed = 0;
        var budget = 0;
        var efficiency = 0;
        for(var items of assigments){
          if (items.status === "closed" ){
            budget = budget + items.budget;
            elapsed = elapsed + items.elapsed;
          }
        }
        efficiency = (elapsed/budget)*100 ;
        console.log(efficiency);
        cb(null, assigments);
      
      }
    })
  };

  

};

