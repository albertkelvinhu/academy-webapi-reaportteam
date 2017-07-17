'use strict';
var app = require('../../server/server');


module.exports = function (Project) {
  
  // Project.validatesPresenceOf('name');
  Project.validatesUniquenessOf('code');


 Project.tasks = function(id, cb) {
      console.log("id project %d",id);
      app.models.Task.find({where: {projectId: id}}, 
            function(err, tasks) {
                if(err)
                    return cb(err);
                else {
                    console.log(tasks);
                    cb(null, tasks);
                }
            });

  };
  Project.remoteMethod("tasks",
    {
        accepts: [{ arg: 'id', type: 'string'}],
        http: { path:"/tasks", verb: "get", errorStatus: 401,},
        description: ["get project tasks"],
        returns: {arg: "Task", type: "array"}
    })

//  Project.assignments = function(projectId, cb) {
//       console.log("id project %d",projectId);
     
//       app.models.Task.find({where: {projectId: projectId}}, 
//             function(err, tasks) {
//                 if(err)
//                     return cb(err);
//                 else {
//                     console.log(tasks);
//                     var arrayAssignments = [];
//                     for(var item of tasks){
//                        app.models.Assignment.findOne({where: {taskId: item.id}}, 
//                         function(err, assignments) {
//                           if(err){
//                               return cb(err)
//                           }else{
//                           console.log(assignments);
//                           }
//                         });
//                     }
                    
//                     cb(null,arrayAssignments);  
//                   }
//                 });
//   };

//     Project.remoteMethod("assignments",
//     {
//         accepts: [{ arg: 'projectId', type: 'string'}],
//         http: { path:"/:projectId/assignments", verb: "get", errorStatus: 401,},
//         description: ["get project assignments"],
//         returns: {arg: "Assignment", type: "array"}
//     });

};