const style = require("stylelint");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const deduplicate = require("postcss-combine-duplicated-selectors");
const view = require("./view");

const conf = atom.config.get("auto-sass");

/* ————————————————————————————————— */

async function lintFix(input, css) {
    let rc = await style.resolveConfig(input);

    if ( ! rc ) rc = conf.stylelintConfigPath;
    if ( ! rc ) return css;

    const linted = await style.lint({code: css, config: rc, fix: true});
    return linted.output;
}

async function autoPrefix(input, css) {
    const result = await postcss([ autoprefixer ]).process(css, { from: input });

    for ( const warn of result.warnings() ) {
        const msg = warn.toString();
        view.warning(msg);
        console.warn(`Auto Sass\nWarning:\n${msg}`);
    }

    return result.css;
}

async function dedupe(input, css) {
    const result = await postcss([ deduplicate({removeDuplicatedValues: true}) ]).process(css, { from: input });

    for ( const warn of result.warnings() ) {
        const msg = warn.toString();
        view.warning(msg);
        console.warn(`Auto Sass\nWarning:\n${msg}`);
    }

    return result.css;
}

/* ————————————————————————————————— */

module.exports = {
    lintFix,
    autoPrefix,
    dedupe
};
