#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var rimraf = require('rimraf');
var copyDereference = require('copy-dereference').sync;
var SWatcher = require('broccoli-sane-watcher');
var broccoli = require('broccoli');
var argv = require('minimist')(process.argv.slice(2));
var glob = require('glob');
var PleasantProgress = require('pleasant-progress');
var mkdirp = require('mkdirp');
var minimatch = require('minimatch');

function run(args) {
    
  var pleasantProgress = new PleasantProgress();
  pleasantProgress.start(chalk.blue('Building'));

    /* ENVIRONMENT */
    if (args.environment) {

        process.env.BROCCOLI_ENV = args.environment;

    }

    var tree = broccoli.loadBrocfile();
    var builder = new broccoli.Builder(tree);

    var destDir = args.output || (args.length === 2 ? args._[1]:"dist");

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
        console.log(chalk.bold.green('\nBuild successful - ' + Math.floor(res.totalTime / 1e6) + 'ms'));

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
    
    var onBuild = function(results) {
        
        if (args.clean) {

            rimraf.sync(destDir);

        }

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

            copy(file, destFile);

        });


        onSuccess(results);
        
    };

    if (!args.once) {

        var watcher = new SWatcher(builder, {
            watchman: args.watchman == null || args.watchman,
            verbose: true,
            debounce: args.debounce || 300,
            filter: function(name, filePath, root) {
                
                var f = true,
                    excludes = ['tmp/**', path.normalize(destDir)+'/**'];
                
                if (args.exclude) {
                    
                    excludes = excludes.concat(!(args.exclude instanceof Array) ? [args.exclude]:args.exclude);
                    
                }
                
                excludes.forEach(function(exclude) {
                    
                    f = f && !minimatch(path.join(root, filePath), process.cwd()+'/'+exclude);
                        
                });
                
                return f;
                
            }
        });

        watcher.on('change', onBuild);
        watcher.on('error', onError);

        return watcher;

    } else {
        
        builder.build().then(onBuild, onError);
        
    }
    
}

function copy(source, dest) {
    
    mkdirp(path.parse(dest).dir, function(err) { if (!err) copyDereference(source, dest); });
    
};

if (!(argv._[0] === 'build') || argv._[0] === 'help') {

    console.log('Usage : build');
    console.log('Usage : build destination');
    console.log('Usage : build destination --environment=(development|production)');
    console.log('Usage : build destination --environment=(development|production)');
    console.log('Usage : build --output=destination --environment=(development|production) --once');
    console.log('Usage : build --output=destination --clean');
    console.log('Usage : build --no-watchman');
    console.log('Usage : build --exclude \'dir1/**\' --exclude \'dir2/**\'');
    process.exit(1);
}

run(argv);
