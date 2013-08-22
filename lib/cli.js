(function () {
    var path = require('path'),
        optimist = require('optimist'),

        bowerResolve = require('./bowerResolve');

    var argv = optimist
            .boolean('h')
            .alias('h', 'help')
            .default('h', false)
            .describe('h', 'show this help.')

            .string('p')
            .alias('p', 'path')
            .default('p', false)
            .describe('p', 'project path.')

            .argv;

    if (argv.h) {
        optimist.showHelp();
        return;
    }

    var p = argv.p;

    bowerResolve({
        path: p ? path.resolve(p) : process.cwd()
    }, function (err) {
        // done.
    });
})();