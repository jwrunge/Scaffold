#!/usr/bin/env node

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewComponent = exports.createNewTheme = exports.extendBase = exports.selectBase = exports.selectComponentSubdir = exports.confirmName = exports.promptName = exports.createThemeBaseIfNotExist = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const cli_color_1 = __importDefault(require("cli-color"));
const getFile_1 = require("./getFile");
const textProcessing_1 = require("./textProcessing");
//CLI theming
const endpoint = cli_color_1.default.greenBright.underline.bold;
const warn = cli_color_1.default.underline.yellow;
const err = cli_color_1.default.bold.underline.red;
const announce = cli_color_1.default.bold.underline.blue;
//Ensures that a base exists
function createThemeBaseIfNotExist(config, extension) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const outputLoc = path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes", `base${extension}`);
            if (!(0, getFile_1.checkFile)(outputLoc)) {
                console.warn(warn(`Can't find base theme at ${outputLoc}; creating base${extension} theme file`));
                (0, getFile_1.ensureDir)(path_1.default.dirname(outputLoc));
                let toCopy = `default${extension}`;
                fs_1.default.copyFileSync(path_1.default.resolve(__dirname, "..", "..", "defaults", toCopy), outputLoc);
                console.log(`Scaffold just created a base theme for you. The base theme is required, and :root variables not present in the base theme will be omitted in extended themes during compilation.`);
                //Prompt - continue or don't?
                const resp = yield inquirer_1.default.prompt([
                    {
                        name: "continue",
                        type: "list",
                        message: `Do you want to continue without first editing your base theme?`,
                        choices: ["No", "Yes"],
                        default: "No"
                    }
                ]);
                return resp.continue;
            }
        }
        catch (e) {
            console.error(err(`There was an issue finding or creating the default theme. There may be an issue with your Scaffold installation. Please consider reinstalling to see if the issue persists.`));
            return undefined;
        }
    });
}
exports.createThemeBaseIfNotExist = createThemeBaseIfNotExist;
//Add name if not supplied
function promptName(altPrompt = "", focus = "theme") {
    return __awaiter(this, void 0, void 0, function* () {
        //Prompt - input name
        const resp = yield inquirer_1.default.prompt([
            {
                name: "name",
                type: "input",
                message: altPrompt || `What would you like to call your ${focus}?`,
                default: `new-${focus}`
            }
        ]);
        return yield confirmName(resp.name);
    });
}
exports.promptName = promptName;
//Name confirm
function confirmName(n, focus = "theme") {
    return __awaiter(this, void 0, void 0, function* () {
        let newName = n.replace(/[^A-Za-z0-9\.\_\- ]/g, "").replace(/ /g, "-").replace(/--/g, "-").toLowerCase();
        if (newName.length > 64) {
            return yield (promptName(warn(`\nYour ${focus} names are limited to 64 characters. Please pick another name.`)));
        }
        else if (newName !== n) {
            console.warn(warn(`\nAccounting for for Scaffold's case and character rules, we've converted your selected ${focus} name to "${newName}".`));
            const resp = yield inquirer_1.default.prompt([
                {
                    name: "continue",
                    type: "list",
                    message: `Are you OK with calling your new ${focus} "${newName}"?`,
                    choices: ["Yes", "No"],
                    default: "Yes"
                }
            ]);
            if (resp.continue == "Yes")
                return newName;
            else
                return "";
        }
        else
            return newName;
    });
}
exports.confirmName = confirmName;
//Select an extension subdirectory
function selectComponentSubdir(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const basedir = path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components");
        (0, getFile_1.ensureDir)(basedir);
        let dirs = (0, getFile_1.readDir)(basedir, false, true);
        if ((!dirs.includes("structure") || !dirs.includes("widget") || dirs.includes("meta"))) {
            //Create subdirs and reassess
            (0, getFile_1.ensureDir)(path_1.default.join(basedir, "structure"));
            (0, getFile_1.ensureDir)(path_1.default.join(basedir, "widget"));
            (0, getFile_1.ensureDir)(path_1.default.join(basedir, "meta"));
            dirs = (0, getFile_1.readDir)(path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components"), false, true);
        }
        //Prompt for subdir
        const subdir = yield inquirer_1.default.prompt([
            {
                name: "dir",
                type: "list",
                message: `Would you like to extend an existing component? Your new component will occupy the extension's slot and inherit all data and functionality.`,
                choices: ["no ~ start from scratch!", ...dirs],
                default: "no ~ start from scratch!"
            }
        ]);
        if (subdir.dir !== "no ~ start from scratch!")
            (0, getFile_1.ensureDir)(path_1.default.join(basedir, subdir.dir));
        return subdir.dir;
    });
}
exports.selectComponentSubdir = selectComponentSubdir;
//Select a file to extend
function selectBase(name, config, extension, focus = "theme", subdir = "") {
    return __awaiter(this, void 0, void 0, function* () {
        const extTest = new RegExp(`${extension}$`);
        if (!extTest.test(name))
            name += `${extension}`;
        if (subdir == "no ~ start from scratch!")
            return "";
        //Get a list of files that can act as bases
        const pluralFocus = focus + (['s', 'ss', 'z', 'ch', 'sh', 'x'].includes(focus[focus.length - 1]) ? "es" : "s");
        let bases = (0, getFile_1.readDir)(path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", pluralFocus, subdir));
        bases = bases.map(b => b.replace(extTest, ""));
        if (focus !== "theme")
            bases = ["none ~ start from scratch!", ...bases];
        //Prompt for base
        const base = yield inquirer_1.default.prompt([
            {
                name: "base",
                type: "list",
                message: `OK, now we need to determine our starting point. What file would you like to use as your base ${focus}?`,
                choices: bases,
                default: focus === "theme" ? "base" : "none ~ start from scratch!"
            }
        ]);
        return base.base;
    });
}
exports.selectBase = selectBase;
//Extend a base
function extendBase(ext, name, config, extension, focus = "theme", subdir = "") {
    const extTest = new RegExp(`${extension}$`);
    if (!extTest.test(ext))
        ext += `${extension}`;
    if (!extTest.test(name))
        name += `${extension}`;
    const pluralFocus = focus + (['s', 'ss', 'z', 'ch', 'sh', 'x'].includes(focus[focus.length - 1]) ? "es" : "s");
    //End process if extend focus is not found
    const extendLoc = path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", pluralFocus, subdir, ext);
    const newLoc = path_1.default.resolve(path_1.default.dirname(extendLoc), name);
    try {
        if (!(0, getFile_1.checkFile)(extendLoc)) {
            console.error(err(`Can't find ${focus} to extend at ${extendLoc}.`));
            process.exit(0);
        }
        //Otherwise copy extend file
        else {
            //Check if file exists
            if ((0, getFile_1.checkFile)(newLoc)) {
                console.error(err(`Unable to create new ${focus} file -- file ${name} already exists.`));
                process.exit(0);
            }
            else {
                return (0, getFile_1.getFile)(extendLoc);
            }
        }
    }
    catch (e) {
        console.error(err(`There was an issue finding your specified base ${focus} (${extendLoc}) or writing your new ${focus} (${newLoc}).`));
        process.exit(0);
    }
}
exports.extendBase = extendBase;
//Prompt for category
function promptCategory(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const basedir = path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components");
        const dirs = (0, getFile_1.readDir)(basedir, false, true);
        let cat = yield inquirer_1.default.prompt([
            {
                name: "cat",
                type: "list",
                message: `How would you categorize this component?`,
                choices: ["NEW", ...dirs],
                default: "NEW"
            }
        ]);
        if (cat.cat === "NEW") {
            cat = yield inquirer_1.default.prompt([
                {
                    name: "cat",
                    type: "input",
                    message: "Enter a new category name: "
                }
            ]);
            (0, getFile_1.ensureDir)(path_1.default.join(basedir, cat.cat));
        }
        return cat.cat;
    });
}
function createNewTheme(config, middleware) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        //Determine css file extension
        const extension = ((_a = config.cssOutput) === null || _a === void 0 ? void 0 : _a.sassSyntax) === "css" ? ".css"
            : ((_b = config.cssOutput) === null || _b === void 0 ? void 0 : _b.sassSyntax) === "indented" ? ".sass"
                : ".scss";
        //Welcome
        console.log(endpoint(`Let's make a new Scaffold theme! 🚀\n`));
        //Check if base exists
        const continueAfterBaseCreate = yield createThemeBaseIfNotExist(config, extension);
        if (continueAfterBaseCreate == "No") {
            process.exit(0);
        }
        else if (continueAfterBaseCreate == "Yes") {
            console.log("\n👍 OK! Let's get going.");
        }
        //Set name/confirm loop
        let name = "";
        while (!name) {
            name = yield promptName();
        }
        console.log(announce("\n🤩 That's a great name! This is gonna be cool.\n"));
        //Select base and validate contents
        const base = yield selectBase(name, config, extension);
        let contents = extendBase(base, name, config, extension);
        //Validate
        const parts = (0, textProcessing_1.processCss)(contents);
        let variables = parts.slice(1);
        //Run any middleware on variables text
        if (middleware && middleware.length) {
            for (let mw of middleware)
                variables = mw(variables);
        }
        //Convert to style format
        const openBrace = ((_c = config.cssOutput) === null || _c === void 0 ? void 0 : _c.sassSyntax) === "indented" ? "" : "{";
        const closeBrace = ((_d = config.cssOutput) === null || _d === void 0 ? void 0 : _d.sassSyntax) === "indented" ? "" : "}";
        contents = `:root ${openBrace}\n\t${variables.join("\n\t")}\n${closeBrace}`;
        //Write the file
        if (!/(\.css|.scss|.sass)/.test(name))
            name += extension;
        let filename = path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes", name);
        fs_1.default.writeFileSync(filename, contents);
        console.log(endpoint(`\nAll done! Have fun with your new theme.\n`));
    });
}
exports.createNewTheme = createNewTheme;
function createNewComponent(config, middleware) {
    return __awaiter(this, void 0, void 0, function* () {
        //Welcome
        console.log(endpoint(`Let's make a new Scaffold component! 🚀\n`));
        //Set name/confirm loop
        let name = "";
        while (!name) {
            name = yield promptName("", "component");
        }
        console.log(announce("\n😎 Nice.\n"));
        //Select base and validate contents
        const subdir = yield selectComponentSubdir(config);
        const base = yield selectBase(name, config, "component", subdir);
        console.log(announce("\nAwesome! Let's do this.\n"));
        let contents;
        console.log("BASE", base);
        if (base && base !== "none ~ start from scratch!")
            contents = extendBase(base, name, config, "component", subdir);
        else {
            let attr = "@attr {\n\t//Declare all attributes that can be set on your web component here. You can set defaults, but be aware that all passed properties will be interpreted as strings.\n\tlet time = 3\n}\n\n";
            let env = "@env {\n\t//All other declarations and JavaScript logic goes here. Imports are relative to your project directory.\n\tfunction runAlert() {\n\t\tsetTimeout(window.alert(\"Time's up!\"), time * 1000)\n\t}\n}\n\n";
            let mount = "@mount {\n\t//Include all logic on component mount here\n\trunAlert()\n}\n\n";
            let html = "@html {\n\t//All HTML component logic goes here. You can use Svelte-style bindings.\n}\n\n";
            let style = "@style {\n\t//Component-scope style goes here. You can refer to variables set in your base theme.\n}\n\n";
            contents = attr + env + mount + html + style;
        }
        //Where do you want to save it?
        const saveCategory = yield promptCategory(config);
        //Validate
        let parts = (0, textProcessing_1.splitText)(contents, ["attr", "env", "mount", "unmount", "html", "style"]);
        // if(!parts.variables) {
        //     //Handle missing attribute
        //     contents = `@variables{\n\t\n}`
        //     process.exit(0)
        // }
        // else {
        //     //Run any middleware on variables text
        //     if(middleware && middleware.length) {
        //         for(let mw of middleware) parts.variables = mw(parts.variables)
        //     }
        //     //Convert to style format
        //     contents = `@variables{${parts.variables}}`
        // }
        //Write the file
        if (!/.scaffold/.test(name))
            name += ".scaffold";
        let filename = path_1.default.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components", saveCategory, name);
        fs_1.default.writeFileSync(filename, contents);
        console.log(endpoint(`\nAll done! Have fun with your new component.\n`));
    });
}
exports.createNewComponent = createNewComponent;
//# sourceMappingURL=newFile.js.map