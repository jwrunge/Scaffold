#!/usr/bin/env node

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArg = void 0;
function getArg(key) {
    // Return true if the key exists and a value is defined
    if (process.argv.includes(`--${key}`))
        return "true";
    const value = process.argv.find(element => element.startsWith(`--${key}=`));
    // Return null if the key does not exist and a value is not defined
    if (!value)
        return "";
    return value.replace(`--${key}=`, '');
}
exports.getArg = getArg;
//# sourceMappingURL=getCommandLineArgs.js.map