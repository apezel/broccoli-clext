# Broccoli CLExt

Command line utility to build, watch and set your broccoli environment. This project was inspired by `broccoli-timepiece`. Comes with a hot css replacement plugin. (No refresh)

## Usage

```bash
npm install -g broccoli-clext
broccoli-clext help
broccoli-clext build
broccoli-clext build destination
broccoli-clext build destination --environment=(development|production)
broccoli-clext build --output=destination --environment=(development|production) --once
broccoli-clext build --clean
broccoli-clext build --no-watchman
broccoli-clext build --exclude 'dir1/**' --exclude 'dir2/**'
```

Watching for changes is the default behavior and broccoli-clext uses `broccoli-sane-watcher` to do that.

Options :

--once if you only want to disable the watch feature.

--no-watchman do disable wathcman and use fs.watch.

--clean to use rimraf. If not used, files are merged.

--hot-css (experimental and not fully implemented). You need to import lib/hot-css-client.js into your project or html file.

--hot-css-port=1234 to define hot css port

HotCSS
======

Every time you modify a style file (css, sass, less...), hot-css will tell the browser to reload the linked css stylesheet. If Build failed, the browser will display the error message.

HotCSS Usage : 
-------------

Launch CLExt with --hot-css argument. It will generate a `hot-css-client.js` file in your build folder. 
Include `<script src="destFolder/hot-css-client.js"></script>` in your page to enable css hot replacement.
Et voilà !

v0.5
----
+ code refactoring
+ added --hot-css-port option
+ now a hot-css-client.js file is generated in your destination folder

v0.3
----

+ MAJOR BUG FIXES
+ Default destination to './dist'
+ --exclude option. Uses glob syntax (ex : dir/**/*)

## License

This project is distributed under the MIT license.