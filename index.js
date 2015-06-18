#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var rimraf = require('rimraf');
var helpers = require('broccoli-kitchen-sink-helpers');
var SWatcher = require('broccoli-sane-watcher/index');
var broccoli = require('broccoli');
var argv = require('minimist')(process.argv.slice(2));

function run(args) {
    
    var command = args._[0];
    
    /* ENVIRONMENT */
    if (args.environment) {
        
        process.env['BROCCOLI_ENV'] = args.environment;
        
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
        
        console.log(chalk.bold.green("Build successful - " + Math.floor(res.totalTime / 1e6) + 'ms'));
        
    }
    
    var onError = function(err) {
        
        console.log(chalk.bold.red(err + '\n\nBuild failed.\n'));

        if (err.message) {
            console.log('Error: ' + err.message);
        }

        if (err.stack) {
            console.log('Stack trace:\n' + err.stack.replace(/(^.)/mg, "  $1"));
        }
        
    }

    
    if (args.watch) {
        
        var watcher = new SWatcher(builder, {
            debounce: args.debounce || 100,
            filter: function(name) { return /^([^\.]|node_modules)/.test(name); }
        });

        watcher.on('change', function (results) {

            rimraf.sync(destDir);
            helpers.copyRecursivelySync(results.directory, destDir);

            onSuccess(results);
            
        });

        watcher.on('error', onError);

        return watcher;
        
    } else {
        
        builder.build()
            .then(onSuccess,onError);
        
    }
}

if (!(argv._[0] === "build" && (argv._.length === 2 || (argv._.length === 1 && argv.output)))) {
    
    console.log("Usage : build destination");
    console.log("Usage : build destination --environment=(development|production)");
    console.log("Usage : build destination --environment=(development|production) --watch");
    console.log("Usage : build --output=destination --environment=(development|production) --watch");
    process.exit(1);
}

run(argv);