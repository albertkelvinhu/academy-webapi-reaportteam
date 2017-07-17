module.exports = function (Model, options) {

  Model.defineProperty('_active', { type: Boolean, default: true });
  Model.defineProperty('_deleted', { type: Boolean, default: false });
  Model.defineProperty('_createdDate', { type: Date, default: '$now' });
  Model.defineProperty('_createdBy', { type: String, default: '' });
  Model.defineProperty('_createAgent', { type: String, default: '' });
  Model.defineProperty('_updatedDate', { type: Date, default: '$now' });
  Model.defineProperty('_updatedBy', { type: String, default: '' });
  Model.defineProperty('_updateAgent', { type: String, default: '' });

  Model.observe('before save', function event(context, next) {
    var data = context.instance || context.data;
    var accessToken = context.options.accessToken;
    var actor = accessToken && accessToken.userId ? accessToken.userId : "#anonymous";
    if (context.instance) {
      data._createdDate = Date.now();
      data._createdBy = actor;
    }

    data._updatedDate = Date.now();
    data._updatedBy = actor;
    next();
  });
}
