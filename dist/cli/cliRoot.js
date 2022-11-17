#!/usr/bin/env node

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const compile_1 = require("./compile");
const getCommandLineArgs_1 = require("./getCommandLineArgs");
const getFile_1 = require("./getFile");
const newFile_1 = require("./newFile");
//Set default config
let config = JSON.parse((0, getFile_1.getFile)(path_1.default.resolve(__dirname, "../..", "defaults", "config.json")));
//Override defaults with config file
const configArg = (0, getCommandLineArgs_1.getArg)("config");
const configFile = configArg || "scaffold.config.json";
let configPath = path_1.default.resolve(process.cwd(), configFile);
if ((0, getFile_1.checkFile)(configPath)) {
    try {
        const configFile = JSON.parse((0, getFile_1.getFile)(configPath));
        config = Object.assign(Object.assign({}, config), configFile);
    }
    catch (e) {
        console.error("Invalid scaffold.config.json file", e);
    }
}
//Override config with command arg
// let key: keyof cfg
// for(key in config) {
//     const a: string = getArg(key)
//     console.log(a)
//     if(a) config[key] = a
// }
switch ((0, getCommandLineArgs_1.getArg)("mode")) {
    case "new-theme":
        (0, newFile_1.createNewTheme)(config);
        break;
    case "new-component":
        (0, newFile_1.createNewComponent)(config);
        break;
    case "compile":
        (0, compile_1.compileSrc)(config);
        break;
    default:
        console.error("No mode specified");
}
//# sourceMappingURL=cliRoot.js.map