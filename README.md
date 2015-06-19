# Broccoli CLExt

Command line utility to build, watch et set your broccoli environment. This project was inspired by `broccoli-timepiece`.

## Usage

```bash
npm install -g broccoli-clext
broccoli-clext build destination
broccoli-clext build destination --watch
broccoli-clext build destination --environment=(development|production)
broccoli-clext build --output=destination --environment=(development|production) --watch
```

--watch uses `broccoli-sane-watcher` to look for changes in your project.

## License

This project is distributed under the MIT license.