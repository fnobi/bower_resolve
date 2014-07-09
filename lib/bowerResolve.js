var fs = require('fs'),
    path = require('path'),
    async = require('async');

var bowerResolve = function (opts, callback) {
    var component = opts.component,
        rootPath = opts.path || process.cwd(),

        bowerDirs = ['bower_components', 'components'],
        bowerJsonFiles = ['component.json', 'bower.json'],
        mainFiles = ['%s.js', 'js/%s.js', 'src/%s.js', 'dist/%s.js'],

        jspath = rootPath,
        bowerJson,
        config;

    if (!component) {
        callback();
    }

    async.series([function (next) {
        // detect bower dir
        async.filter(bowerDirs, function (dir, callback) {
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
    }, function (next) {
        // detect bower json
        async.filter(bowerJsonFiles, function (file, callback) {
            fs.exists(path.join(jspath, file), callback);
        }, function (results) {
            if (results.length) {
                bowerJson = path.join(jspath, results[0]);
            }

            next();
        });
    }, function (next) {
        if (!bowerJson) {
            return next();
        }

        // load bower json
        fs.readFile(bowerJson, function (err, body) {
            if (err) {
                return next(err);
            }
            config = JSON.parse(body);
            next();
        });
    }, function (next) {
        if (!bowerJson) {
            return next();
        }

        // check config main script
        if (!config.main) {
            return next();
        }
        var mainList = (config.main.forEach) ? config.main : [config.main];
        mainList.forEach(function (main) {
            if (main && main.match(/\.js$/)) {
                mainFiles.unshift(main);
            }
        });
        next();
    }, function (next) {
        // search main files
        async.filter(mainFiles, function (file, callback) {
            file = file.replace('%s', component);
            fs.exists(path.join(jspath, file), callback);
        }, function (results) {
            if (!results.length) {
                return next(new Error('script not found.'));
            }

            jspath = path.join(jspath, results[0].replace('%s', component));
            next();
        });
    }], function (err) {
        callback(err, jspath);
    });

};

module.exports = bowerResolve;
