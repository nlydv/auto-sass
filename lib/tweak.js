const style = require("stylelint");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const deduplicate = require("postcss-combine-duplicated-selectors");
const view = require("./view");


/* ————— STYLELINT FIXING ——————————————————————————————————————————— */
/* —————————————————————————————————————————————————————————————————— */

async function lintFix(input, output, css) {
    const conf = atom.config.get("auto-sass");

    const rc = (
        await style.resolveConfig(output)
        ?? await style.resolveConfig(input)
        ?? ( require("fs").existsSync(conf.stylelint.fallback)
            ? conf.stylelint.fallback
            : ( conf.stylelint.standard
                ? require("stylelint-config-standard")
                : null
            )
        )
    );

    const opt = {
        code:   css,
        config: rc,
        fix:    true
    };

    return ( rc ? await style.lint(opt).then(i => i.output) : css );
}

/* ————— AUTOPREFIXING —————————————————————————————————————————————— */
/* —————————————————————————————————————————————————————————————————— */

async function autoPrefix(input, css) {
    const conf = atom.config.get("auto-sass");

    const opt = {
        overrideBrowserslist: ( conf.browserlist ?? undefined )
    };

    const result = await postcss([ autoprefixer(opt) ]).process(css, { from: input });

    for ( const warn of result.warnings() ) {
        const msg = warn.toString();
        view.warning(msg);
        console.warn(`Auto Sass\nWarning:\n${msg}`);
    }

    return result.css;
}

/* ————— DEDUPLICATING —————————————————————————————————————————————— */
/* —————————————————————————————————————————————————————————————————— */

async function dedupe(input, css) {
    const result = await postcss([ deduplicate({removeDuplicatedValues: true}) ]).process(css, { from: input });

    for ( const warn of result.warnings() ) {
        const msg = warn.toString();
        view.warning(msg);
        console.warn(`Auto Sass\nWarning:\n${msg}`);
    }

    return result.css;
}

/* —————————————————————————————————————————————————————————————————— */

module.exports = {
    lintFix,
    autoPrefix,
    dedupe
};
