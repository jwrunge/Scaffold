#!/usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitText = exports.processCss = exports.varsRx = exports.rootRx = exports.innerBracesRx = void 0;
exports.innerBracesRx = /(?<={)([^}]*)(?=})/gm;
exports.rootRx = /:root\s*?{([^}]*)}/gm;
exports.varsRx = /(?<!{[.|\n]*?)(?<!\w[:| ]\s*?)(?<!var\s*?\(\s*?)--.*?[\n|;](?!=[.|\n]*?})/gm;
function processCss(css) {
    //Get top-level and :root{} vars seperate from base CSS
    const rootStringArr = css.match(exports.rootRx);
    const rootString = rootStringArr ? rootStringArr[0].match(exports.innerBracesRx) : "";
    const rootVarStringOnly = rootString ? rootString[0].replace(exports.innerBracesRx, "") : "";
    const rootVars = rootVarStringOnly.replace(exports.innerBracesRx, "").match(exports.varsRx) || [];
    const cssSansVars = css.replace(exports.varsRx, "").replace(/^\s*?[\n|(\r\n)]{2,}/gm, "\n");
    //Return array of strings with [0] = main css and variabels occupying the rest
    return [cssSansVars, ...rootVars];
}
exports.processCss = processCss;
function splitText(text, get) {
    const blocks = text.split(/}?\s*?@/gmi);
    let items = {};
    for (let block of blocks) {
        const keyMatch = block.match(/.*?(?=\s*?{)/gmi);
        const valMatch = block.match(/(?<=\s*?{\s*?)[\S\s]*/gmi);
        const key = keyMatch ? keyMatch[0] : "";
        if (get.includes(key)) {
            const val = valMatch ? valMatch[0].replace(/}\s*?$/gmi, "") : "";
            items[key] = val;
        }
    }
    return items;
}
exports.splitText = splitText;
//# sourceMappingURL=textProcessing.js.map