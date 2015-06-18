# Broccoli Build Helper

Command line utility to build, watch et set your broccoli environment. This project was inspired by `broccoli-timepiece`.

## Usage

```bash
npm install -g broccoli-build-helper
broccoli-build-helper build destination
broccoli-build-helper build destination --watch
broccoli-build-helper build destination --environment=(development|production)
broccoli-build-helper build --output=destination --environment=(development|production) --watch
```

--watch uses `broccoli-sane-watcher` to look for changes in your project.

## License

This project is distributed under the MIT license.
