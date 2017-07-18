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

    Report.getProject = function(task_id,cb){
       app.models.Project.findOne({
           include:{
                relation: 'tasks', // include the owner object
                scope: { // further filter the owner object
                    where: {id: task_id}
                }
           }
        },function(err, project){
        if(err || task_id === 0)
            return cb(err);
        else {
            console.log(project);
            cb(null, project);
        }
        }) 
    };

    Report.remoteMethod("getProject",
    {
        accepts: [{ arg: 'task_id', type: 'string'}],
        http: { path:"/:task_id/project", verb: "get", errorStatus: 401,},
        description: ["Get get project."],
        returns: {arg: "Project", type: "array"}
    })

    Report.getProjectbyUser = function(user_id,cb){
        app.models.Project.find({
           include:{
                relation: 'tasks', // include the owner object
                scope: { // further filter the owner object
                    relation: 'assignment', // include the owner object
                    scope: { // further filter the owner object
                        where: {accountId: user_id}
                    }
                }
           }
        },function(err, project){
        if(err || user_id === 0)
            return cb(err);
        else {
            console.log(project);
            cb(null, project);
        }
        }) 
    };

    Report.remoteMethod("getProjectbyUser",
    {
        accepts: [{ arg: 'user_id', type: 'string'}],
        http: { path:"/:user_id/project", verb: "get", errorStatus: 401,},
        description: ["Get project which an account is involved in."],
        returns: {arg: "Project", type: "array"}
    })

    // Report.countProjectbyUser = function(user_id,cb){
    //     app.models.Project.find({
    //        include:{
    //             relation: 'tasks', // include the owner object
    //             scope: { // further filter the owner object
    //                 relation: 'assignment', // include the owner object
    //                 scope: { // further filter the owner object
    //                     where: {accountId: user_id}
    //                 }
    //             }
    //        }
    //     },function(err, count){
    //     if(err || user_id === 0)
    //         return cb(err);
    //     else {
    //         console.log(count);
    //         cb(null, count);
    //     }
    //     }) 
    // };

    // Report.remoteMethod("countProjectbyUser",
    // {
    //     accepts: [{ arg: 'user_id', type: 'string'}],
    //     http: { path:"/:user_id/project", verb: "get", errorStatus: 401,},
    //     description: ["Get project which an account is involved in."],
    //     returns: {arg: "count", type: "number"}
    // })


//   Report.getAccountTasks = function(account_id,cb){
//         app.models.Task.find({where: {AssignmentaccountId: account_id}},function(err, Tasks){
//         if(err || account_id === 0)
//             return cb(err);
//         else {
//             console.log(projects);
//             cb(null, projects);
//         }
//         })
//     };


//   Report.remoteMethod("getAccountTasks",
//     {
//         accepts: [{ arg: 'accountId', type: 'string'}],
//         http: { path:"/:account_id/projects", verb: "get", errorStatus: 401,},
//         description: ["Get projects every Account"],
//         returns: {arg: "Tasks", type: "array"}
//   })

};

 