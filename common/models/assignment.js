'use strict';
var app = require('../../server/server');

module.exports = function(Assignment) {

  Assignment.countAssigment = function (id,cb){
    app.models.Assignment.count({accountId: id},function(err, count){
      if(err || id === 0)
         return cb(err);
      else {
         console.log(count);
         cb(null, count);
      }
    })
  };

  Assignment.remoteMethod("countAssigment",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/:id/count", verb: "get", errorStatus: 401,},
        description: ["Get number of assignments every Account"],
        returns: {arg: "count", type: "number"}
  })

};
