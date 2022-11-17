#!/usr/bin/env node

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSrc = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sass_1 = __importDefault(require("sass"));
const getFile_1 = require("./getFile");
const textProcessing_1 = require("./textProcessing");
function compileSrc(config) {
    const cssPath = path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes");
    compileCss(cssPath, config);
}
exports.compileSrc = compileSrc;
function compileCss(dir, config) {
    var _a, _b, _c, _d, _e, _f, _g;
    const extension = ((_a = config.cssOutput) === null || _a === void 0 ? void 0 : _a.sassSyntax) === "css" ? ".css" : ((_b = config.cssOutput) === null || _b === void 0 ? void 0 : _b.sassSyntax) === "indented" ? ".sass" : ".scss";
    //Get base
    const baseFile = (0, getFile_1.getFile)(path_1.default.join(dir, `base${extension}`));
    const baseParts = (0, textProcessing_1.processCss)(baseFile);
    const baseCss = baseParts[0] || "";
    const baseRoot = (() => {
        let br = baseCss.match(textProcessing_1.rootRx);
        return br ? br[0] : "";
    })();
    const baseVars = baseParts.slice(1);
    //Get themes
    const files = (0, getFile_1.readDir)(dir, false, false);
    let themeVars = [];
    for (let file of files) {
        //Get file, skipping if base
        const data = (0, getFile_1.getFile)(path_1.default.join(dir, file));
        if (file === `base${extension}`)
            continue;
        //Get variables from theme; Loop over current theme variables, adding to global theme vars array or discarding based on if it is in base theme
        const parts = (0, textProcessing_1.processCss)(data);
        const curThemeVars = parts.slice(1);
        const extRx = RegExp(extension);
        for (let v of curThemeVars) {
            if (baseVars.includes(v))
                themeVars.push(`${v.replace("--", `--` + file.replace(extRx, "") + "-")}`);
        }
    }
    //Compile
    let newRoot = baseRoot.replace(/:root\s*?{/, `:root {\n\t${baseVars.join("\n\t")}\n\t${themeVars.join("\n\t")}`);
    let cssOutput = baseCss.replace(textProcessing_1.rootRx, newRoot);
    //Convert
    if ((_c = config.cssOutput) === null || _c === void 0 ? void 0 : _c.cssTransformScript) {
        Promise.resolve().then(() => __importStar(require(path_1.default.resolve(process.cwd(), config.cssOutput.cssTransformScript)))).then(transform => cssOutput = transform(cssOutput, config))
            .catch(err => console.error(err(`Your CSS transform script was specified in the Scaffold config, but could not be loaded or did not run correctly. ${err}`)));
    }
    //Run Sass
    const sassOps = {
        syntax: ((_d = config.cssOutput) === null || _d === void 0 ? void 0 : _d.sassSyntax) || "scss",
        style: ((_e = config.cssOutput) === null || _e === void 0 ? void 0 : _e.cssCompress) !== false ? "compressed" : "expanded",
        loadPaths: [process.cwd(), path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes")]
    };
    let op = sass_1.default.compileString(cssOutput, sassOps);
    cssOutput = op.css;
    //Save CSS file
    let cssDistOutputName = path_1.default.resolve(process.cwd(), config.distOutputDir || "", `${((_g = (_f = config.cssOutput) === null || _f === void 0 ? void 0 : _f.cssName) === null || _g === void 0 ? void 0 : _g.replace(/\.css$/, "")) || "bundle"}.css`);
    (0, getFile_1.ensureDir)(path_1.default.resolve(process.cwd(), config.distOutputDir || ""));
    fs_1.default.writeFileSync(cssDistOutputName, cssOutput);
    return cssOutput;
}
//# sourceMappingURL=compile.js.map