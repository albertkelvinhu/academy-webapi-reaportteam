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

    Report.getAssignmentsIncludeTask = function(account_id,cb){
        app.models.Assignment.find(
            {
                where:
                {
                accountId: account_id
            },
            include:{
                relation: 'task'
            }
           },function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log("dipanggil loh assignmnentsnya");
            cb(null, assignments);
        }
        })
    };


    Report.remoteMethod("getAssignmentsIncludeTask",
        {
            accepts: [{ arg: 'accountId', type: 'string'}],
            http: { path:"/account/:account_id/assignments/", verb: "get", errorStatus: 401,},
            description: ["Mengambil assignments termasuk task setiap akun"],
            returns: {arg: "Assignments", type: "object"}
    })
    
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
        http: { path:"/account/:account_id/assignments/count", verb: "get", errorStatus: 401,},
        description: ["Mengambil jumlah assignments setiap akun"],
        returns: {arg: "count", type: "number"}
  })

    Report.getProjectbyUser = function(account_id,cb){
        app.models.Project.find({ 
           include:{
                relation: 'tasks', // include the owner object
                scope: 
                {
                    include:
                    { 
                    relation: 'assignments', // include the owner object
                    scope: 
                        { // further filter the owner object
                        where: {accountId: account_id}
                        }
                    }    
                }
           }
        },function(err, projects){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(projects);
            cb(null, projects);
        }
        }) 
    };

    Report.remoteMethod("getProjectbyUser",
    {
        accepts: [{ arg: 'account_id', type: 'string'}],
        http: { path:"/account/:account_id/projects", verb: "get", errorStatus: 401,},
        description: ["Mengambil project dari setiap akun."],
        returns: {arg: "Projects", type: "object"}
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
        http: { path:"/account/:account_id/assigments/closed/", verb: "get", errorStatus: 401,},
        description: ["Menghitung assignment yang telah closed dari setiap akun."],
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
        http: { path:"/account/:account_id/assignments/elapsed/", verb: "get", errorStatus: 401,},
        description: ["Mengambil total elapsed time dari setiap akun."],
        returns: {arg: "total", type: "decimal"}
    })


    Report.getElapsedbyUserInProject = function(account_id,project_id,cb){
        app.models.Assignment.find({where: {and: [{accountId: account_id},{projectId: project_id}]}},function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            var sumElapsed = assignments.reduce(function(last, d) {
                if (d.projectId===project_id){
                    console.log(d.projectId)
                    return d.elapsed + last;
                }
            }, 0);
            cb(null, sumElapsed);
        }
        }) 
    };

    Report.remoteMethod("getElapsedbyUserInProject",
    {
        accepts: [{ arg: 'project_id', type: 'string'},{ arg: 'account_id', type: 'string'}],
        http: { path:"/account/:account_id/project/:project_id/elapsed", verb: "get", errorStatus: 401,},
        description: ["Mengambil elapsed time setiap akun berdasarkan project."],
        returns: {arg: "total", type: "decimal"}
    })

    Report.getEfficiencybyUserInProject = function(project_id,account_id,cb){
        app.models.Assignment.find({where: {accountId: account_id}},function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(assignments)
            var sumElapsed = assignments.reduce(function(last, d) {
                if (d.projectId===project_id){
                    console.log(d.projectId)
                    return d.elapsed + last;
                }
            }, 0);
            var sumBudget = assignments.reduce(function(last, d) {
                if (d.projectId===project_id){
                    console.log(d.projectId)
                    return d.budget + last;
                }
            }, 0);
            var efficiency = (sumElapsed/sumBudget)*100 ;
            cb(null, efficiency);
        }
        }) 
    };

    Report.remoteMethod("getEfficiencybyUserInProject",
    {
        accepts: [{ arg: 'project_id', type: 'string'},{ arg: 'account_id', type: 'string'}],
        http: { path:"/account/:account_id/project/:project_id/efficiency/", verb: "get", errorStatus: 401,},
        description: ["Mengambil efisiensi setiap akun berdasarkan project."],
        returns: {arg: "efficiency", type: "array"}
    })

    Report.getEfficiencyInAllAssignments = function(account_id,cb){
        app.models.Assignment.find({where: {accountId: account_id}},function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            var getEfficiency=[];
            var efficiency;

            console.log(assignments)
            var sumElapsed = assignments.reduce(function(last, d) {
                return d.elapsed + last;
            }, 0);
            var sumBudget = assignments.reduce(function(last, d) {
                return d.budget + last;
            }, 0);
            efficiency = ((sumElapsed/sumBudget)*100).toFixed(2);
        
            getEfficiency.push(sumElapsed);
            getEfficiency.push(sumBudget);
            getEfficiency.push(efficiency);
            cb(null, getEfficiency);
        }
        }) 
    };

    Report.remoteMethod("getEfficiencyInAllAssignments",
    {
        accepts: [{ arg: 'account_id', type: 'string'}],
        http: { path:"/account/:account_id/assignments/efficiency/", verb: "get", errorStatus: 401,},
        description: ["Mengambil efisiensi setiap akun pada semua assignments."],
        returns: {arg: "efficiency", type: "object"}
    })
//fungsi get belum bisa
    Report.getEfficiencyPerDate = function(account_id,date_start,date_end,cb){

        var start_time = new Date(date_start);
        
        console.log(start_time);
        var end_time = new Date(date_end);
        console.log(date_end);

        start_time.toUTCString();
        console.log(start_time);
        end_time.toUTCString();
        console.log(date_end);
        app.models.Assignment.find ({where:{accountId: account_id,
            date:{
                between: [start_time, end_time]
            }}},
            function(err, assignments){
        if(err || account_id === 0)
            return cb(err);
        else {
            console.log(assignments)
            var sumElapsed = assignments.reduce(function(last, d) {
                return d.elapsed + last;
            }, 0);
            var sumBudget = assignments.reduce(function(last, d) {
                return d.budget + last;
            }, 0);
            var efficiency = (sumElapsed/sumBudget)*100 ;
            cb(null, efficiency);
        }
        }) 
    };
    Report.remoteMethod("getEfficiencyPerDate",
    {
        accepts: [{ arg: 'account_id', type: 'string'},{ arg: 'date_start', type: 'date'},{ arg: 'date_end', type: 'date'}],
        http: { path:"/account/:account_id/:date/efficiency/", verb: "get", errorStatus: 401,},
        description: ["Total efisiensi per akun berdasarkan tanggal."],
        returns: {arg: "efficiency", type: "decimal"}
    })
};

 