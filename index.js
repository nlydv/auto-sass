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
            title: "Lint output",
            default: true
        },
        prefix: {
            type: "boolean",
            title: "Autoprefix output",
            default: true
        },
        dedupe: {
            type: "boolean",
            title: "Deduplicate output",
            default: true
        },
        stylelintConfigPath: {
            type: "string",
            title: "Stylelint config path",
            description: "Absolute path to the default `.stylelintrc` config to use when linting.",
            default: "./stylelintrc"
        },
        relativePath: {
            type: "string",
            title: "Relative output path",
            description: "Where all compiled CSS files will be saved by default. Use `$1` in place of the original name (w/o ext.)",
            default: "../$1.css"
        },
        sass: {
            type: "object",
            properties: {
                outputStyle: {
                    type: "string",
                    title: "Output style type",
                    description: "Only two choices.",
                    default: "expanded",
                    enum: [
                        { value: "expanded", description: "expanded" },
                        { value: "compressed", description: "compressed" }
                    ]
                },
                sourceMap: {
                    type: "boolean",
                    title: "Source map",
                    description: "you need map?",
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
