'use strict';
var app = require('../../server/server');


module.exports = function (Project) {
  
  // Project.validatesPresenceOf('name');
  Project.validatesUniquenessOf('code');



};