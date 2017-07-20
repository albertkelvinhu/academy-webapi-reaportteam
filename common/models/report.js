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

    Report.getProjectbyUser = function(account_id,cb){
        app.models.Project.find({
           include:{
                relation: 'tasks', // include the owner object
                scope: { // further filter the owner object
                    relation: 'assignments', // include the owner object
                    scope: { // further filter the owner object
                        where: {accountId: account_id}
                    }
                }
           }
        },function(err, project){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(project);
            cb(null, project);
        }
        }) 
    };

    Report.remoteMethod("getProjectbyUser",
    {
        accepts: [{ arg: 'account_id', type: 'string'}],
        http: { path:"/:account_id/project", verb: "get", errorStatus: 401,},
        description: ["Count project(s) which an account is involved in."],
        returns: {arg: "Project", type: "array"}
    })

    Report.countClosedAccountbyUser = function(account_id,cb){
        app.models.Assignment.count({accountId: account_id,status: "closed"},function(err, count){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(count);
            cb(null, count);
        }
        }) 
    };

    Report.remoteMethod("countClosedAccountbyUser",
    {
        accepts: [{ arg: 'account_id', type: 'string'}],
        http: { path:"/:account_id/count/closed/assigments", verb: "get", errorStatus: 401,},
        description: ["Count an account's closed assignments."],
        returns: {arg: "count", type: "number"}
    })

    Report.getElapsedbyUser = function(account_id,cb){
        app.models.Assignment.find({where: {accountId: account_id}},function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(assignments);
            var sum = assignments.reduce(function(last, d) {
                return d.elapsed + last;
            }, 0);
            cb(null, sum);
        }
        }) 
    };

    Report.remoteMethod("getElapsedbyUser",
    {
        accepts: [{ arg: 'account_id', type: 'string'}],
        http: { path:"/:account_id/total/elapsed/assigments", verb: "get", errorStatus: 401,},
        description: ["an account's elapsed time."],
        returns: {arg: "total", type: "decimal"}
    })

//belum pasti
    Report.getElapsedbyUserInProject = function(account_id,project_id,cb){
        app.models.Assignment.find({where: {and: [{accountId: account_id},{projectId: project_id}]}},function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(assignments);
            var sum = assignments.reduce(function(last, d) {return d.elapsed + last;}, 0);
            cb(null, sum);
        }
        }) 
    };

    Report.remoteMethod("getElapsedbyUserInProject",
    {
        accepts: [{ arg: 'project_id', type: 'string'},{ arg: 'account_id', type: 'string'}],
        http: { path:"/project/:project_id/account/:account_id/total/elapsed/assigments", verb: "get", errorStatus: 401,},
        description: ["an account's elapsed time for every project."],
        returns: {arg: "total", type: "decimal"}
    })
//belum pasti  
    Report.getEfficiencybyUserInProject = function(project_id,account_id,cb){
        app.models.Assignment.find({where: {accountId: account_id}},function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(assignments)
            
            var sumElapsed = assignments.reduce(function(last, d) {
                if (d.projectId===project_id)
                console.log(d.projectId)
                return 0;
            
            }, 0);
            // var sumBudget = assignments.reduce(function(last, d) {
            //     return d.elapsed + last;
            
            // }, 0);
            // var efficiency = (sumElapsed/sumBudget)*100 ;
            cb(null, sumElapsed);
        }
        }) 
    };

    Report.remoteMethod("getEfficiencybyUserInProject",
    {
        accepts: [{ arg: 'project_id', type: 'string'},{ arg: 'account_id', type: 'string'}],
        http: { path:"/project/:project_id/account/:account_id/efficiency/", verb: "get", errorStatus: 401,},
        description: ["an account's elapsed time for every project."],
        returns: {arg: "efficiency", type: "decimal"}
    })

    






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

 