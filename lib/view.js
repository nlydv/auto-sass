const path = require("path");

const opt = { dismissable: false };

function success(msg) {
    opt.detail = `Output:\n\n${msg}`;
    const note = atom.notifications.addSuccess("Auto Sass", opt);
}

function warning(msg) {
    opt.detail = `Warning:\n${msg}`;
    const note = atom.notifications.addWarning("Auto Sass", opt);
}

function error(msg) {
    opt.detail = `ERROR:\n${msg}`;
    const note = atom.notifications.addError("Auto Sass", opt);
}

function projectPath(file) {
    const projects = atom.project.rootDirectories.map(i => i.realPath);
    for ( const dir of projects ) {
        if ( file.match(dir) ) {
            return path.basename(file.match(dir)[0]) + "/" + file.split(dir + "/")[1];
        }
    }
}

/* ————————————————————————————————— */

module.exports = {
    projectPath,
    success,
    warning,
    error
};
