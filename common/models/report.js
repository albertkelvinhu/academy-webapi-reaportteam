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
    
    Report.getAssignment = function(id,db){
    var Assignment = app.models.Assignment;
    
        
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


};
