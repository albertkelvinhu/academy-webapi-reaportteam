'use strict';
var app = require('../../server/server');

module.exports = function(Report) {
    Report.status = function(cb) {
        var currentDate = new Date();
        var currentHour = currentDate.getHours();
        var OPEN_HOUR = 8;
        var CLOSE_HOUR = 17;
        console.log('Current hour is %d:%d', currentHour,currentDate.getMinutes());
        var response;
        if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
        response = 'Masih jam kerja.';
        } else {
        response = 'Tidak jam kerja.';
        }
        cb(null, response);
    };


    Report.remoteMethod(
        'status', {
        http: {
            path: '/status',
            verb: 'get'
        },
        returns: {
            arg: 'status',
            type: 'string'
        }
        }
    );
    
    Report.countAssignment = function(account_id,cb){
        app.models.Assignment.count({accountId: account_id},function(err, count){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(count);
            cb(null, count);
        }
        })
    };


  Report.remoteMethod("countAssignment",
    {
        accepts: [{ arg: 'accountId', type: 'string'}],
        http: { path:"/:account_id/count", verb: "get", errorStatus: 401,},
        description: ["Get number of assignments every Account"],
        returns: {arg: "count", type: "number"}
  })


  Report.getAccountProject = function(account_id,cb){
        app.models.Task.count({where: {accountId: account_id}},function(err, Tasks){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(projects);
            cb(null, projects);
        }
        })
    };


  Report.remoteMethod("getAccountProject",
    {
        accepts: [{ arg: 'accountId', type: 'string'}],
        http: { path:"/:account_id/projects", verb: "get", errorStatus: 401,},
        description: ["Get projects every Account"],
        returns: {arg: "Tasks", type: "array"}
  })

};

 