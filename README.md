# Broccoli CLExt

Command line utility to build, watch et set your broccoli environment. This project was inspired by `broccoli-timepiece`.

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

--no-watchman do disable wathcman and use poll.

--clean to use rimraf. If not used, files are merged.

v0.3
----

+ MAJOR BUG FIXES
+ Default destination to './dist'
+ --exclude option. Uses glob syntax (ex : dir/**/*)

## License

This project is distributed under the MIT license.