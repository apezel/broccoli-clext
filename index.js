#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var rimraf = require('rimraf');
var copyDereference = require('ember-cli-copy-dereference').sync;
var SWatcher = require('broccoli-sane-watcher');
var broccoli = require('broccoli');
var argv = require('minimist')(process.argv.slice(2));
var glob = require('glob');
var PleasantProgress = require('pleasant-progress');

function run(args) {
    
  var pleasantProgress = new PleasantProgress();
  pleasantProgress.start(chalk.yellow('Building'));

    /* ENVIRONMENT */
    if (args.environment) {

        process.env.BROCCOLI_ENV = args.environment;

    }


    var tree = broccoli.loadBrocfile();
    var builder = new broccoli.Builder(tree);

    var destDir = args.output || args._[1];

    var atExit = function () {
        builder.cleanup()
            .then(function () {
                process.exit(1);
            });
    };

    process.on('SIGINT', atExit);
    process.on('SIGTERM', atExit);

    var onSuccess = function(res) {

        pleasantProgress.stop();
        console.log(chalk.bold.green('Build successful - ' + Math.floor(res.totalTime / 1e6) + 'ms'));

    };

    var onError = function(err) {

        pleasantProgress.stop();
        console.log(chalk.bold.red(err + '\n\nBuild failed.\n'));

        if (err.message) {
            console.log('Error: ' + err.message);
        }

        if (err.stack) {
            console.log('Stack trace:\n' + err.stack.replace(/(^.)/mg, '  $1'));
        }

    };


    if (args.once) {

        builder.build()
            .then(onSuccess, onError);

    } else {

        var watcher = new SWatcher(builder, {
            watchman: true,
            verbose: true,
            debounce: args.debounce || 100,
            filter: function(name) { return /^([^\.]|node_modules)/.test(name); }
        });

        watcher.on('change', function (results) {

            if(args.clean) {
                rimraf.sync(destDir);
            } else {
              // just make sure the files we want to copy over are deleted in destDir
              var files = glob.sync(path.join(results.directory, '**/*'), { nodir: true });
              files.forEach(function(file) {
                var destFile = path.join(destDir, path.relative(results.directory, file));

                // makes sure the full build also works even if the file to delete does not exist
                try {
                  fs.unlinkSync(destFile);
                } catch (error) {
                  if (error.code !== 'ENOENT') {
                    throw error;
                  }
                }
              });
            }

            copyDereference(results.directory, destDir);

            onSuccess(results);

        });

        watcher.on('error', onError);

        return watcher;

    }
}

if (!(argv._[0] === 'build' && (argv._.length === 2 || (argv._.length === 1 && argv.output)))) {

    console.log('Usage : build destination');
    console.log('Usage : build destination --environment=(development|production)');
    console.log('Usage : build destination --environment=(development|production) --no-watch');
    console.log('Usage : build --output=destination --environment=(development|production) --no-watch');
    console.log('Usage : build --output=destination --rimraf');
    process.exit(1);
}

run(argv);
