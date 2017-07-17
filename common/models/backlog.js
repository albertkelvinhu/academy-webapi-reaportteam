'use strict';
var app = require('../../server/server');
var codeGenerator = require("../utils/code-generator");

module.exports = function (Backlog) {
  Backlog.validatesUniquenessOf('code', { message: 'code already exists' });

  Backlog.observe("before save", (context, next) => {
    var Project = app.models.Project;
    var data = context.instance || context.data;

    if (context.isNewInstance)
      data.code = codeGenerator();

    Project.findById(data.projectId, (err, project) => {
      if (err)
        return next(err);
      data.projectId = project.id;
      next();
    })
  })
};
