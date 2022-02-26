# Auto Sass Changelog
I'll try to keep up with documenting notable changes here in this file.

## 1.2.1
`February 26, 2022`
### Fixed
- Patch type error during package loading that blocked activation
- Isolated specific alert notification only meant for "manual" compilation actions

## 1.2.0
`February 25, 2022`
### New
- Added [busy-signal](https://github.com/steelbrain/busy-signal) integration since I noticed that little UI would sometime freeze up in the middle of a big compilation, not sure if this helps with that, but it's a nice UX thing.

### Changed
- Manual compilation package command `auto-sass:compile` works now
- Refactored and made stylelint config resolving more robust to allow for more complex stylelint-based autofixing configs

## 1.1.4
`February 11, 2022`
### Fixed
- Downstream compilation bug

## 1.1.3
`February 8, 2022`
### Fixed
- Patch for failed hotfix

## 1.1.2
`February 8, 2022`
- ~~fixed~~ activation error on opening empty workspace

## 1.1.1
`February 8, 2022`
### Fixed
- Major speedup on start; from max of 1200ms down to < 5ms (on my machine)
- Big reduction in unnecessary function calls

## 1.1.0
`February 6, 2022`
### Added
- Option to specify fallback browerslist query to be used by Autoprefixer

### Changed
- Run stylelint & fix last instead of first
- Refactor certain config settings/displays
- Correct typo and cleaned up descriptions for settings
- Documention of downstream compiling feature that I forgot to add

## 1.0.0 - 1.0.3
`January 20–21, 2022`

- Init commits
- Misc changes
