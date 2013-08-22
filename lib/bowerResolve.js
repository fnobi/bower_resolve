var fs = require('fs'),
    path = require('path'),
    async = require('async');

var bowerResolve = function (opts, callback) {
    var component = opts.component,
        rootPath = opts.path || process.cwd(),
        bowerDir = ['components', 'bower_components'],
        jspath = rootPath;

    if (!component) {
        callback();
    }

    async.series([function (next) {
        // detect bower dir
        async.filter(bowerDir, function (dir, callback) {
            fs.exists(path.join(rootPath, dir), callback);
        }, function (results) {
            if (!results.length) {
                return next(new Error('bower not found.'));
            }

            jspath = path.join(jspath, results[0]);
            next();
        });
    }, function (next) {
        // check component directory
        fs.exists(path.join(jspath, component), function (exists) {
            if (!exists) {
                return next(new Error('component "' + component + '" is not found.'));
            } else {
                jspath = path.join(jspath, component);
                return next();
            }
        });
    }], function (err) {
        callback(err, jspath);
    });

};

module.exports = bowerResolve;