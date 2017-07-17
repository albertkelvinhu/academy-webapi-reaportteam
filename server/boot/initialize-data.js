// 'use strict';
// var async = require("async");

// module.exports = function initializeData(app) {
//   var mongoDs = app.dataSources["mongodb-ds"];

//   async.parallel({
//     account: async.apply(initializeAccount)
//   }, (error, results) => {
//     if (error) throw error;
//     var account = results.account;
//     createProfile(account)
//     console.log('> models created sucessfully');
//   })

//   function initializeAccount(callback) {
//     mongoDs.automigrate("Account", function (error) {
//       if (error)
//         callback(error);

//       var Account = app.models.Account;
//       var query = { "where": { username: "academy" } };

//       Account.findOne(query, (error, user) => {
//         if (!user) {
//           Account.create({
//             realm: "moonlay",
//             username: "academy",
//             password: "Standar123",
//             email: "academy@moonlay.com"
//           }, callback)
//         }
//       })
//     });
//   }

//   function createProfile(account) {
//     var Profile = app.models.Profile;
//     mongoDs.automigrate("Profile", function (error) {
//       var query = { "where": { accountId: account.id } }
//       Profile.findOne(query, (error, profile) => {
//         if (!profile) {
//           Profile.create({
//             accountId: account.id,
//             firstname: "moonlay",
//             lastname: "academy",
//             dob: new Date(),
//             gender: "male"
//           }, (error, profile) => {
//             if (error)
//               throw error;
//           })
//         }
//       })
//     })
//   }

// };
