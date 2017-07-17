'use strict';
var app = require('../../server/server');
var codeGenerator = require("../utils/code-generator");

module.exports = function (Task) {
  Task.validatesUniquenessOf('code', { message: 'code already exists' });

  Task.observe("before save", (context, next) => {
    var Backlog = app.models.Backlog;
    var data = context.instance || context.data;

    if (context.isNewInstance) {
      data.code = codeGenerator();
      Backlog.findById(data.backlogId, (err, backlog) => {
        if (err)
          return next(err);
        data.backlogId = backlog.id;
        data.projectId = backlog.projectId;
      })
    }
    next();
  })
};
