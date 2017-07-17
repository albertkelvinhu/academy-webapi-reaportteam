'use strict';
var app = require('../../server/server');

module.exports = function(Me) {
    Me.profile = function(req, res, cb) {
        var accessToken = req.accessToken;
        if (!accessToken)
            return cb("accessToken required");

        app.models.Account.findById(accessToken.userId, {
            include: "profile"
        }, function(err, user) {
            if (err)
                return cb(err);
            else if (!user)
                return cb(new Error('No user with this access token was found.'));
            else
                cb(null, user.profile());
        });
    };
    Me.assignments = function(req, res, filter, cb) {
        var accessToken = req.accessToken;
        if (!accessToken)
            return cb("accessToken required");

        var userId = accessToken.userId;
        var f = typeof filter === "string" ? JSON.parse(filter) : {};

        f.where = {
            "and": [{
                accountId: userId
            }, f.where]
        };
        var Assignment = app.models.Assignment;
        Assignment.find(f, (err, assignments) => {
            if (err)
                return cb(err);
            else
                cb(null, assignments);
        });
    };

    Me.remoteMethod("profile", {
        http: {
            path: "/",
            verb: "get",
            errorStatus: 401
        },
        description: ["get user profile"],
        accepts: [{
            arg: "req",
            type: "object",
            http: {
                source: "req"
            }
        }, {
            arg: "res",
            type: "object",
            http: {
                source: "res"
            }
        }],
        returns: {
            arg: "profile",
            type: "object",
            root: true
        }
    });


    Me.remoteMethod("assignments", {
        http: {
            path: "/assignments",
            verb: "get",
            errorStatus: 401
        },
        description: ["get asignments"],
        accepts: [{
            arg: "req",
            type: "object",
            http: {
                source: "req"
            }
        }, {
            arg: "res",
            type: "object",
            http: {
                source: "res"
            }
        }, {
            arg: "filter",
            type: "object",
            http: {
                source: "query"
            }
        }],
        returns: {
            arg: "assignments",
            type: "array",
            root: true
        }
    });
};
