const path = require("path");
const first = require("firstline");


/* ————— COMMENT COMMANDS ——————————————————————————————————————————— */
/* —————————————————————————————————————————————————————————————————— */

async function checkFirstLine(input) {
    const conf = atom.config.get("auto-sass");

    // available args that can be passed in first line comment
    const args = {
        output: null,
        downstream: null
    };

    // set default output if no first-line override
    const { dir, name } = path.parse(input);
    args.output = path.normalize(`${dir}/${conf.relativePath.replace("$1", name)}`);

    // extract first line from file and check if it's looks like something we need to inspect
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

/* ————— EXPORTED UTILITIES ——————————————————————————————————————————— */
/* ———————————————————————————————————————————————————————————————————— */

function isSass(file) {
    const ext = path.extname(file);
    return ( ext === ".scss" || ext === ".sass" );
}

function isPartial(file) {
    const base = path.basename(file);
    return ( isSass(base) && base.startsWith("_") );
}

/* —————————————————————————————————————————————————————————————————— */

module.exports = {
    isSass,
    isPartial,
    checkFirstLine
};
