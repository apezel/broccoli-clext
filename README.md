# Broccoli Build Helper

Command line utility to build, watch et set your broccoli environment. This project was inspired by `broccoli-timepiece`.

## Usage

```bash
npm install -g broccoli-build-helper
build destination
build destination --environment=(development|production)
build destination --environment=(development|production) --watch
build --output=destination --environment=(development|production) --watch
```

--watch uses the `broccoli-sane-watcher` watcher to look for change in your project root.

## License

This project is distributed under the MIT license.
