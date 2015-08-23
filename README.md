# Broccoli CLExt

Command line utility to build, watch et set your broccoli environment. This project was inspired by `broccoli-timepiece`.

## Usage

```bash
npm install -g broccoli-clext
broccoli-clext build destination
broccoli-clext build destination
broccoli-clext build destination --environment=(development|production)
broccoli-clext build --output=destination --environment=(development|production) --once
broccoli-clext build --clean
```

Watching for changes is the default behavior and broccoli-clext uses `broccoli-sane-watcher` to do that.
Use --once if you only want to disable the watch feature.

## License

This project is distributed under the MIT license.