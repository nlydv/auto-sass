
# Auto Sass

Package for the Atom IDE that takes a Sass file on each save and automatically compiles, lints, prefixes, and saves the resulting CSS code.

This plugin was something I developed rather quickly and primarily with my own use in mind. I wouldn't expect that others would find it any more useful than the myriad Sass compiler packages already out there.

Motivation to publicize and provide this brief explainer is mostly to make it easier for me when I eventually have to come back to debug something. Perhaps others might find it useful as well though.

## Recent Changes
`v1.1.1`
- Major speedup on start; from max of 1200ms down to < 5ms (on my machine)
- Big reduction in unnecessary function calls

## Features
 - Uses latest [Dart Sass](https://github.com/sass/dart-sass) Node API
 - Lints and fixes compiled CSS with [Stylelint](https://github.com/stylelint/stylelint) using nearest `.stylintrc` config available
 - Runs [Autoprefixer](https://github.com/postcss/autoprefixer) on compiled CSS
 - Deduplicates multiple selector blocks with [postcss-combine-duplicated-selectors](https://github.com/ChristianMurphy/postcss-combine-duplicated-selectors) _(yet to test if this causes other issues)_
 - Does all the above before actually saving the output to file
 - Makes it easier and quicker to live test a site as you build

## Install

Search for `auto-sass` and install from Atom's in-app settings UI

Or, if you prefer via CLI:
```bash
apm install auto-sass
```

## Usage

In the package settings UI, you can turn on/off any of the three additional post-compilation tasks:
* linting
* prefixing
* deduplicating

There are also some module-specific configs exposed as well, including some of Dart Sass' common options _(e.g. output style, source map)_ and fallback/override options related to Browserlist and Stylelint.

### Output path
You can set the default file name and path for the output CSS relative to its source Sass file. Use `$1` as a stand in for the original file name (without extension).

By default, the output path location is set to `../$1.css`, or in other words:
```
assets/css/src/main.scss
               ↓
assets/css/main.css
```

### File-specific output

You can also override the output path on a per-file basis by following a `compile:` or `out:` keyword in a first-line comment of that Sass file, as shown below:

`css/src/home.scss`:
```scss
// compile: ../$1/styles.css

$sassy-var: 16px;
@include my-mixin();
.
.
```
On save this Sass file would get compiled and saved to:

`css/home/styles.css`

### Partial files

_Auto Sass_ doesn't compile partial Sass files of course—that's the whole point of the partials feature after all, **however**, it's quite handy to have certain downstream Sass files (i.e. those `@import`ing or `@use`ing that partial file) recompiled automatically when the partial is saved.

You can tell _Auto Sass_ to do this by adding a first-line comment similarly as described above to your partial file, but instead using a `downstream:`, `main:`, or `link:` keyword followed by a comma-separated list of Sass file paths—relative to current file, as before—that you would like to have auto-compiled whenever the current file is saved:

`css/src/main.scss`:
```scss
@import "modules/_partial.scss";
.
.
```

`css/src/modules/_partial.scss`:
```scss
// main: ../main.scss

$red: #FF0000;
$etc: "...";
.
.
```

For these couple of files, if we save `_partial.scss`, it will go and compile `main.scss` as if you had just saved that file.

### Notes

With just those two basic first-line comment commands, we can chain up the compilation of files in pretty complex ways, though for simplicity's sake, I'm sure you'd rarely want to have a chain involving more than 3-5 files, _max_.

Also, while I described the "downstream" compiling feature to be for partials... you could make use of this on any other Sass file. The use case in _partials is just most apparent.

## Misc

Not sure what the trend/long-term outlook is with Atom, I've found a lot of widely used packages remain unmaintained with stale deps... weird bugs I thought were due to this package ended up being problems with other linters and such.

I hope future me doesn't pull his hair out trying to squash a bug that's out of his control.

## License

Copyright © 2022 [Neel Yadav](https://neelyadav.com)

_This project is licensed under the terms of the MIT License._<br>_Full license text is available in the [LICENSE.txt](https://github.com/nlydv/auto-sass/blob/master/LICENSE.txt) file._
