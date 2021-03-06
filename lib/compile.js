const fs = require("fs");
const path = require("path");
const sass = require("sass");
const inspect = require("./inspect");
const tweak = require("./tweak");
const view = require("./view");


/* ————— C O M P I L A T I O N —————————————————————————————————————— */
/* —————————————————————————————————————————————————————————————————— */

async function compile(input, repeat = false) {
    let css;
    const { output, downstream } = await inspect.checkFirstLine(input);

    // skip if input is second-round downstream
    if ( ! repeat )
        if ( ! await shouldCompile(input, downstream) )
            return null;

    try {

        const conf = atom.config.get("auto-sass");
        css = sass.compile(input, conf.sass).css;

        if ( conf.prefix ) css = await tweak.autoPrefix(input, css);
        if ( conf.dedupe ) css = await tweak.dedupe(input, css);
        if ( conf.lint )   css = await tweak.lintFix(input, output, css);

        fs.writeFileSync(output, css);

    } catch (e) {

        view.error(e.message);
        return false;

    }

    if ( ! repeat ) view.success(view.projectPath(output));
    return true;
}

/* ————— LOCAL UTILITIES ———————————————————————————————————————————— */
/* —————————————————————————————————————————————————————————————————— */

async function shouldCompile(input, downstream) {
    // Reject non-sass files straight off the bat and quick affirm that
    // regular (non-partial) sass' are a go for compilation.

    if ( ! inspect.isSass(input) )    return false;
    if ( ! inspect.isPartial(input) ) return true;

    // The remaining outcome is a partial Sass file input; need to
    // check for downstream file(s) in first line comment and run
    // compile() on each separately. Only care about `args.downstream`
    // here... compile() will deal with `args.output` individually.

    if ( downstream ) {
        let multi = "";
        for ( const d of downstream ) {
            // Second argument of compile(), "repeat", set to true in order
            // to skip running this same function for each downstream; user
            // said that it needs compiling, so compile it we shall.
            await compile(d, true);
            multi += `\n${view.projectPath(d)}`;
        }

        view.success(multi);
    }

    // Even though, by getting here, we did have to compile stuff... we
    // still need to actually return an answer re: "should compile?"
    // The given input *itself* should not be compiled (it's a partial)
    // and indicated downstreams that *should* be compiled have already
    // been taken care of, just exit the original compile() thread now.

    return false;
}

/* —————————————————————————————————————————————————————————————————— */

module.exports = compile;
