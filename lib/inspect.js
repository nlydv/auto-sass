const path = require("path");
const first = require("firstline");

const conf = atom.config.get("auto-sass");

/* ——— Exported functions —————————— */
/* ————————————————————————————————— */

function isSass(file) {
    const ext = path.extname(file);
    return ( ext === ".scss" || ext === ".sass" );
}

function isPartial(file) {
    const base = path.basename(file);
    return ( isSass(base) && base.startsWith("_") );
}

async function checkFirstLine(input) {
    // available arguments that can be passed in first line comment
    const args = { output: null, downstream: null };

    let firstLine = await first(input);
    const isCommentCmd = new RegExp(/^\/(\/|\*)\s*[a-zA-Z]+:/).test(firstLine);

    if ( isCommentCmd ) {
        // normalize comment line to extract parseable key/val pair
        const [ key, value ] = firstLine.split(":").map(i => i.replace(/(\/\/|\/\*|\*\/)/, "").trim());

        let { dir, name } = path.parse(input);

        switch (key) {
            case "out":
            case "output":
            case "compile":
            case "compiles":
                args.output = value;
                args.output = args.output.replace("$1", name);
                args.output = path.normalize(`${dir}/${args.output}`);
                break;
            case "main":
            case "link":
            case "links":
            case "downstream":
            case "downstreams":
                args.downstream = value.split(",");
                args.downstream = args.downstream.map(i => i.replace("$1", name));
                args.downstream = args.downstream.map(i => path.normalize(`${dir}/${i.trim()}`));
                break;
        }
    }

    return args;
}

/* ————————————————————————————————— */
/* ————————————————————————————————— */

module.exports = {
    isSass,
    isPartial,
    checkFirstLine
};
