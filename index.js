/*
 * Copyright © 2022 Neel Yadav
 * MIT License
 *
 * Name:      Auto Sass
 * Desc:      Plugin for Atom IDE for automatic Sass file compilation and extra things
 *
 * Author:    Neel Yadav (@nlydv)
 * Website:   https://github.com/nlydv/auto-sass
 * License:   https://github.com/nlydv/auto-sass/blob/master/LICENSE.txt
 *
 */

const { CompositeDisposable } = require("atom");
const inspect = require("./lib/inspect");
const compile = require("./lib/compile");

/* ————————————————————————————————— */

function activate() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add("atom-workspace", this.commands));

    atom.workspace.observeTextEditors(e => {
        this.subscriptions.add(
            e.onDidSave(saved => {
                (async () => await compile(saved.path))();
            })
        );
    });
}

function deactivate() {
    this.subscriptions.dispose();
}

module.exports = {
    activeFile: () => atom.textEditors.getActiveTextEditor().buffer.file.path,
    config: {
        lint: {
            type: "boolean",
            title: "Stylelint",
            description: "Run the compiled CSS through [Stylelint](https://stylelint.io/) to automatically adjust output style, where possible, to match preferred coding syntax/guidelines.",
            default: true
        },
        prefix: {
            type: "boolean",
            title: "Autoprefix",
            description: "Apply vendor-specific prefixes to necessary properties in compile CSS for greater cross-browser consistency. Uses Autoprefixer's built-in default comaptibility metric *(supporting ~95% of users)*.",
            default: true
        },
        dedupe: {
            type: "boolean",
            title: "Deduplicate",
            description: "Merges multiple exact-match selector blocks into one and deletes repeated property-value pairs in compiled CSS *(use with caution for now)*.",
            default: false
        },
        relativePath: {
            type: "string",
            title: "Relative output path",
            description: "Path where all compiled CSS files will be saved by default relative to source Sass file.\nAdd a `$1` in this path where you want to dynamically re-use the name of the source file without its extension.",
            default: "../$1.css"
        },
        stylelint: {
            type: "object",
            title: "Stylelint",
            description: "Auto Sass will use the first `.stylelintrc*` config file found while recursively searching each parent folder up from the source file path. If none are found, and a fallback filepath is set below, that config will used instead.",
            properties: {
                fallback: {
                    type: "string",
                    title: "Fallback config",
                    description: "Absolute path to a fallback `.stylelintrc*` config to use when linting.",
                    default: ""
                },
                standard: {
                    type: "boolean",
                    title: "Use `stylelint-config-standard` as last resort?",
                    description: "If, for whatever reason, no `.stylelintrc*` configs could be discovered at all and this option is enabled, the compiled CSS will still get linted and fixed using the default standard ruleset. If this option is enabled, and no other rulesets could be found, no linting will occur.",
                    default: true
                }
            }
        },
        sass: {
            type: "object",
            title: "Sass Options",
            description: "These are directly configurable when running files through the Sass compiler.",
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
                    description: "Whether or not Sass should generate and output a source map",
                    default: false
                }
            }
        }
    },
    commands: {
        "auto-sass:compile": async () => await exports.compile(exports.activeFile())
    },
    subscriptions: null,
    activate,
    deactivate,
    compile
};
