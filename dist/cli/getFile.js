#!/usr/bin/env node

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDir = exports.getFile = exports.ensureDir = exports.checkFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function checkFile(fpath) {
    return fs_1.default.existsSync(fpath);
}
exports.checkFile = checkFile;
function ensureDir(dpath) {
    if (!fs_1.default.existsSync(dpath)) {
        fs_1.default.mkdirSync(dpath, { recursive: true });
    }
}
exports.ensureDir = ensureDir;
function getFile(fpath, noExist) {
    if (fs_1.default.existsSync(fpath)) {
        return fs_1.default.readFileSync(fpath).toString();
    }
    else {
        if (noExist)
            return noExist(fpath);
        else
            return "";
    }
}
exports.getFile = getFile;
function readDir(fpath, fullPath = false, dirs = false) {
    let files = [];
    try {
        for (let f of fs_1.default.readdirSync(fpath, { withFileTypes: true })) {
            //Ensure we are returning a dir or file as specified
            if (dirs && !f.isDirectory())
                continue;
            if (!dirs && f.isDirectory())
                continue;
            //Commit to array
            if (fullPath)
                files.push(path_1.default.resolve(fpath, f.name));
            else
                files.push(f.name);
        }
    }
    catch (e) {
        return [];
    }
    return files;
}
exports.readDir = readDir;
//# sourceMappingURL=getFile.js.map