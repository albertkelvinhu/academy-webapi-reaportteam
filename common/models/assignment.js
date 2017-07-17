'use strict';
var app = require('../../server/server');

module.exports = function(Assignment) {

    Assignment.countAssignment = function (accountId,cb){
    app.models.Assignment.count({where: {and: [{accountId: accountId}]}},function(err, count){
      if(err || id === 0)
         return cb(err);
      else {
        cb(null, count);
      
      }
    })
  };

  Assignment.remoteMethod("countAssignment",
    {
        accepts: [{ arg: 'accountId', type: 'string'}],
        http: { path:"/:accountId/count/", verb: "get", errorStatus: 401,},
        description: ["Get number of assignment per account."],
        returns: {arg: "count", type: "number"}
  })
};
