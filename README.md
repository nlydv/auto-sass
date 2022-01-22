# Auto Sass

Package for the Atom IDE that takes a Sass file on each save and automatically compiles, lints, prefixes, and saves the resulting CSS code.

## Overview

This plugin was something I developed rather quickly and primarily with my own use in mind. I wouldn't expect that others would find it any more useful than the myriad Sass compiler packages already out there.

Motivation to publicize and provide this brief explainer is mostly to make it easier for me when I eventually have to come back to debug something. Perhaps others might find it useful as well though.

### Features
 - Uses latest [Dart Sass](https://github.com/sass/dart-sass) Node API
 - Lints and fixes compiled CSS with [Stylelint](https://github.com/stylelint/stylelint) using nearest `.stylintrc` config available
 - Runs [Autoprefixer](https://github.com/postcss/autoprefixer) on compiled CSS
 - Deduplicates multiple selector blocks with [postcss-combine-duplicated-selectors](https://github.com/ChristianMurphy/postcss-combine-duplicated-selectors) _(yet to test if this causes other issues)_
 - Does all the above before actually saving the output to file
 - Makes it easier and quicker to live test a site as you build

## Usage

### Install

This is the first Atom package I've created, ~~haven't looked into how the package registry works and since it's mostly for my own use, probably won't bother~~. Publishing to the registry was pretty simple.

Search for `auto-sass` and install from Atom's in-app settings UI

If you prefer via CLI:
```bash
apm install auto-sass
```

### Configuration

In the package settings UI, you can turn on/off any of the three extra post-compilation task: linting, prefixing, and deduplicating.

#### Output path
You can also set the default file name and path for the output CSS relative to its source Sass file. Use `$1` as a stand in for the original file name (without extension). The default location is: `../$1.css`

Which means a Sass file at: `~/assets/css/src/main.scss`

... has its compiled CSS saved to: `~/assets/css/main.css`

#### File-specific output
You can also override whatever the default output path is on a per-file basis by creating a first-line comment in that Sass file as shown below.

`~/assets/css/src/home.scss`:
```scss
// compile: ../$1/styles.css

$sassy-var: 16px;
@include my-mixin();
.
.
```
on save this file would get compiled to: `~/assets/css/home/styles.css`

## Warning

Not sure what the trend/long-term outlook is with Atom, I've found a lot of widely used packages remain unmaintained with stale deps... weird bugs I thought were due to this package ended up being problems with other linters and such.

I hope future me doesn't pull his hair out trying to squash a bug that's out of his control.

## License

This project is licensed under the terms of the MIT License _(see [LICENSE.txt](https://github.com/nlydv/auto-sass/blob/master/LICENSE.txt) file published therein)_.
