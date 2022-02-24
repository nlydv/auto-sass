/*
 * Copyright © 2022 Neel Yadav
 * MIT License
 *
 *     Plugin for the Atom IDE to allow automatic Sass
 *     source file compilation execution upon save and
 *     also optionally apply additional build steps on
 *     resulting CSS before finally outputing to file.
 *
 * Authors:    Neel Yadav <mail@neelyadav.com>
 * Created:    January 20th, 2022
 * Website:    https://github.com/nlydv/auto-sass
 *
 */

const { CompositeDisposable } = require("atom");
const path = require("path");
const compile = require("./lib/compile");
const view = require("./lib/view");

/* ————————————————————————————————— */

function activate() {
    atom.commands.add("atom-workspace", this.commands);
    this.watchers = new CompositeDisposable();

    atom.workspace.observeActiveTextEditor(e => {
        const filePath = ( e?.buffer?.file?.path ?? null );

        const ext = path.extname(filePath ?? "/file.null");
        const isSass = ( ext === ".scss" || ext === ".sass" );

        if ( filePath && isSass ) {
            const watcher = e.onDidSave(async () => await compile(filePath));

            this.watchers.add(watcher);
            this.watchers.add(e.onDidDestroy(() => watcher.dispose()));
        }

        this.activeFile = filePath;
    });

    this.isActivated = true;
    console.log("activated 'auto-sass'");
}

function deactivate() {
    this.watchers.dispose();
    this.isActivated = false;
}

module.exports = {
    activate,
    deactivate,
    compile,

    isActivated: null,
    watchers: null,

    commands: {
        "auto-sass:compile": async function () {
            const success = await compile(this.activeFile);
            if ( success === null ) view.warning("The man behind the curtain refused to compile the currently active file.");
        }
    },

    config: {
        lint: {
            order: 1,
            type: "boolean",
            title: "Stylelint Fix",
            description: "Run the compiled CSS through [Stylelint](https://stylelint.io/) to automatically fix output formatting to match preferred coding syntax/guidelines, where possible.",
            default: true
        },
        prefix: {
            order: 2,
            type: "boolean",
            title: "Autoprefix",
            description: "Run [Autoprefixer](https://github.com/postcss/autoprefixer) on compiled CSS to apply vendor-specific prefixes for greater cross-browser consistency.",
            default: true
        },
        dedupe: {
            order: 3,
            type: "boolean",
            title: "Deduplicate",
            description: "Merges multiple exact-match selector blocks into one and deletes repeated property-value pairs in compiled CSS *(use with caution for now)*.",
            default: false
        },
        relativePath: {
            order: 4,
            type: "string",
            title: "Relative output path",
            description: "Path where all compiled CSS files will be saved by default relative to source Sass file.\nAdd a `$1` in this path where you want to dynamically re-use the name of the source file without its extension.",
            default: "../$1.css"
        },
        browserlist: {
            order: 5,
            type: "string",
            title: "Browserlist query fallback",
            description: "We let Autoprefixer automatically discover a Browserlist config object as either a key within a nearby package.json or dedicated .browserlistrc file. If none are found, and you don't want Autoprefixer to use the default Browserlist query set, you can set a custom Browserlist query here.",
            default: ""
        },
        stylelint: {
            order: 6,
            type: "object",
            title: "Stylelint Options",
            properties: {
                fallback: {
                    type: "string",
                    title: "Fallback config",
                    description: "**Auto Sass** will use the first `.stylelintrc` config file found while recursively searching each parent folder up from the source file path. If none are found, and an absolute path to a fallback `.stylelintrc` file is set here, that config will be used instead.",
                    default: ""
                },
                standard: {
                    type: "boolean",
                    title: "Use stylelint-config-standard",
                    description: "If for whatever reason, no `.stylelintrc` configs could be discovered at all, the compiled CSS will still get linted and fixed using the default standard ruleset, unless this option is disabled, in which case no linting/fixing will occur.",
                    default: true
                }
            }
        },
        sass: {
            type: "object",
            title: "Sass Options",
            order: 7,
            properties: {
                outputStyle: {
                    type: "string",
                    title: "Output style type",
                    description: "Structure of output code",
                    default: "expanded",
                    enum: [
                        { value: "expanded", description: "expanded" },
                        { value: "compressed", description: "compressed" }
                    ]
                },
                sourceMap: {
                    type: "boolean",
                    title: "Source map",
                    description: "Whether or not Sass should generate an output a source map",
                    default: false
                }
            }
        }
    }
};
