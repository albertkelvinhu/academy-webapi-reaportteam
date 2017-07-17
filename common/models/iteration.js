'use strict';
var app = require('../../server/server');

module.exports = function (Iteration) {
    Iteration.observe("before save", (context, next) => {
        var Project = app.models.Project;
        var data = context.instance || context.data;

        Project.findById(data.projectId, (err, project) => {
            if (err)
                return next(err);

            if (context.isNewInstance) {
                var collection = Iteration.getDataSource().connector.collection(Iteration.modelName);
                collection.aggregate([
                    { $match: { projectId: project.id } },
                    { $group: { _id: "$projectId", maxNo: { $max: '$no' } } }
                ], (err, results) => {
                    var result = results[0];
                    data.no = result ? (result.maxNo + 1) : 1;//r.no + 1;
                    data.projectId = project.id;
                    next();
                })
            }
            else
                next();
        })
    })

    Iteration.findByProject = (filter, callback) => {
        var Project = app.models.Project;
        Project.find(filter.where, (error, results) => {
            if (error)
                callback(error)
            else
                callback(null, results);
        })
    }

    Iteration.remoteMethod(
        'findByProject',
        {
            accepts: [{ arg: 'filter', type: 'object' }],
            http: {
                verb: "get",
                path: "/project"
            },
            returns: { type: 'Array' }
        }
    );
};
