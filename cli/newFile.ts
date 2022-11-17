import path from "path"
import fs from "fs"
import inquirer from "inquirer"
import clc from "cli-color"
import type { cfg } from "./cliRoot"
import { checkFile, getFile, readDir, ensureDir } from "./getFile"
import { splitText, processCss, type itemStruct } from "./textProcessing"

//CLI theming
const endpoint = clc.greenBright.underline.bold
const warn = clc.underline.yellow
const err = clc.bold.underline.red
const announce = clc.bold.underline.blue

//Ensures that a base exists
export async function createThemeBaseIfNotExist(config: cfg, extension: string): Promise<string | undefined> {
    try {
        const outputLoc = path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes", `base${extension}`)
        if(!checkFile(outputLoc)) {
            console.warn(
                warn(`Can't find base theme at ${outputLoc}; creating base${extension} theme file`)
            )
            ensureDir(path.dirname(outputLoc))

            let toCopy: string = `default${extension}`
            fs.copyFileSync(path.resolve(__dirname, "..", "..", "defaults", toCopy), outputLoc)

            console.log(`Scaffold just created a base theme for you. The base theme is required, and :root variables not present in the base theme will be omitted in extended themes during compilation.`)

            //Prompt - continue or don't?
            const resp = await inquirer.prompt([
                {
                    name: "continue",
                    type: "list",
                    message: `Do you want to continue without first editing your base theme?`,
                    choices: ["No", "Yes"],
                    default: "No"
                }
            ])

            return resp.continue
        }
    }
    catch(e) {
        console.error(err(`There was an issue finding or creating the default theme. There may be an issue with your Scaffold installation. Please consider reinstalling to see if the issue persists.`))
        return undefined
    }
}

//Add name if not supplied
export async function promptName(altPrompt: string = "", focus: string = "theme"): Promise<string> {
    //Prompt - input name
    const resp = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: altPrompt || `What would you like to call your ${focus}?`,
            default: `new-${focus}`
        }
    ])

    return await confirmName(resp.name)
}

//Name confirm
export async function confirmName(n: string, focus: string = "theme"): Promise<string> {
    let newName: string = n.replace(/[^A-Za-z0-9\.\_\- ]/g, "").replace(/ /g, "-").replace(/--/g, "-").toLowerCase()

    if(newName.length > 64) {
        return await (promptName(warn(`\nYour ${focus} names are limited to 64 characters. Please pick another name.`)))
    }
    else if(newName !== n) {
        console.warn(warn(`\nAccounting for for Scaffold's case and character rules, we've converted your selected ${focus} name to "${newName}".`))
        const resp = await inquirer.prompt([
            {
                name: "continue",
                type: "list",
                message: `Are you OK with calling your new ${focus} "${newName}"?`,
                choices: ["Yes", "No"],
                default: "Yes"
            }
        ])

        if(resp.continue == "Yes") return newName
        else return ""
    }
    else return newName
}

//Select an extension subdirectory
export async function selectComponentSubdir(config: cfg): Promise<string> {
    const basedir = path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components")
    ensureDir(basedir)

    let dirs: string[] = readDir(basedir, false, true)
    if((!dirs.includes("structure") || !dirs.includes("widget") || dirs.includes("meta"))) {
        //Create subdirs and reassess
        ensureDir(path.join(basedir, "structure"))
        ensureDir(path.join(basedir, "widget"))
        ensureDir(path.join(basedir, "meta"))
        dirs = readDir(path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components"), false, true)
    }

    //Prompt for subdir
    const subdir = await inquirer.prompt([
        {
            name: "dir",
            type: "list",
            message: `Would you like to extend an existing component? Your new component will occupy the extension's slot and inherit all data and functionality.`,
            choices: ["no ~ start from scratch!", ...dirs],
            default: "no ~ start from scratch!"
        }
    ])

    if(subdir.dir !== "no ~ start from scratch!") ensureDir(path.join(basedir, subdir.dir))
    return subdir.dir
}

//Select a file to extend
export async function selectBase(name: string, config: cfg, extension: string, focus: string = "theme", subdir: string = ""): Promise<string> {
    const extTest: RegExp = new RegExp(`${extension}$`)
    if(!extTest.test(name)) name += `${extension}`

    if(subdir == "no ~ start from scratch!") return ""

    //Get a list of files that can act as bases
    const pluralFocus = focus + ([ 's', 'ss', 'z', 'ch', 'sh', 'x' ].includes(focus[focus.length - 1]) ? "es" : "s")
    let bases = readDir(path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", pluralFocus, subdir))
    bases = bases.map(b=> b.replace(extTest, ""))
    if(focus !== "theme") bases = ["none ~ start from scratch!", ...bases]

    //Prompt for base
    const base = await inquirer.prompt([
        {
            name: "base",
            type: "list",
            message: `OK, now we need to determine our starting point. What file would you like to use as your base ${focus}?`,
            choices: bases,
            default: focus === "theme" ? "base" : "none ~ start from scratch!"
        }
    ])

    return base.base
}

//Extend a base
export function extendBase(ext: string, name: string, config: cfg, extension: string, focus: string = "theme", subdir: string = ""): string {
    const extTest: RegExp = new RegExp(`${extension}$`)
    if(!extTest.test(ext)) ext += `${extension}`
    if(!extTest.test(name)) name += `${extension}`

    const pluralFocus = focus + ([ 's', 'ss', 'z', 'ch', 'sh', 'x' ].includes(focus[focus.length - 1]) ? "es" : "s")

    //End process if extend focus is not found
    const extendLoc = path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", pluralFocus, subdir, ext)
    const newLoc = path.resolve(path.dirname(extendLoc), name)

    try {
        if(!checkFile(extendLoc)) {
            console.error(err(`Can't find ${focus} to extend at ${extendLoc}.`))
            process.exit(0)
        }
        //Otherwise copy extend file
        else {
            //Check if file exists
            if(checkFile(newLoc)) {
                console.error(err(`Unable to create new ${focus} file -- file ${name} already exists.`))
                process.exit(0)
            }
            else {
                return getFile(extendLoc)
            }
        }
    }
    catch(e) {
        console.error(err(`There was an issue finding your specified base ${focus} (${extendLoc}) or writing your new ${focus} (${newLoc}).`))
        process.exit(0)
    }
}

//Prompt for category
async function promptCategory(config: cfg): Promise<string> {
    const basedir = path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components")
    const dirs = readDir(basedir, false, true)

    let cat = await inquirer.prompt([
        {
            name: "cat",
            type: "list",
            message: `How would you categorize this component?`,
            choices: ["NEW", ...dirs],
            default: "NEW"
        }
    ])

    if(cat.cat === "NEW") {
        cat = await inquirer.prompt([
            {
                name: "cat",
                type: "input",
                message: "Enter a new category name: "
            } 
        ])

        ensureDir(path.join(basedir, cat.cat))
    }

    return cat.cat
}

export async function createNewTheme(config: cfg, middleware?: ((input: string[])=> string[])[]) {
    //Determine css file extension
    const extension =   config.cssOutput?.sassSyntax === "css" ? ".css" 
                        : config.cssOutput?.sassSyntax === "indented" ? ".sass"
                        : ".scss"

    //Welcome
    console.log(endpoint(`Let's make a new Scaffold theme! 🚀\n`))

    //Check if base exists
    const continueAfterBaseCreate = await createThemeBaseIfNotExist(config, extension)
    if(continueAfterBaseCreate == "No") {
        process.exit(0)
    }
    else if(continueAfterBaseCreate == "Yes") {
        console.log("\n👍 OK! Let's get going.")
    }

    //Set name/confirm loop
    let name: string = ""

    while(!name) {
        name = await promptName()
    }

    console.log(announce("\n🤩 That's a great name! This is gonna be cool.\n"))

    //Select base and validate contents
    const base = await selectBase(name, config, extension)
    let contents = extendBase(base, name, config, extension)

    //Validate
    const parts: string[] = processCss(contents)
    let variables: string[] = parts.slice(1)

    //Run any middleware on variables text
    if(middleware && middleware.length) {
        for(let mw of middleware) variables = mw(variables)
    }

    //Convert to style format
    const openBrace = config.cssOutput?.sassSyntax === "indented" ? "" : "{"
    const closeBrace = config.cssOutput?.sassSyntax === "indented" ? "" : "}"
    contents = `:root ${openBrace}\n\t${variables.join("\n\t")}\n${closeBrace}`

    //Write the file
    if(!/(\.css|.scss|.sass)/.test(name)) name += extension

    let filename = path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes", name)
    fs.writeFileSync(filename, contents)

    console.log(endpoint(`\nAll done! Have fun with your new theme.\n`))
}

export async function createNewComponent(config: cfg, middleware?: ((input: string)=> string)[]) {
    //Welcome
    console.log(endpoint(`Let's make a new Scaffold component! 🚀\n`))

    //Set name/confirm loop
    let name: string = ""

    while(!name) {
        name = await promptName("", "component")
    }

    console.log(announce("\n😎 Nice.\n"))

    //Select base and validate contents
    const subdir = await selectComponentSubdir(config)
    const base = await selectBase(name, config, "component", subdir)

    console.log(announce("\nAwesome! Let's do this.\n"))

    let contents: string
    console.log("BASE", base)
    if(base && base !== "none ~ start from scratch!") contents = extendBase(base, name, config, "component", subdir)
    else {
        let attr = "@attr {\n\t//Declare all attributes that can be set on your web component here. You can set defaults, but be aware that all passed properties will be interpreted as strings.\n\tlet time = 3\n}\n\n"
        let env = "@env {\n\t//All other declarations and JavaScript logic goes here. Imports are relative to your project directory.\n\tfunction runAlert() {\n\t\tsetTimeout(window.alert(\"Time's up!\"), time * 1000)\n\t}\n}\n\n"
        let mount = "@mount {\n\t//Include all logic on component mount here\n\trunAlert()\n}\n\n"
        let html = "@html {\n\t//All HTML component logic goes here. You can use Svelte-style bindings.\n}\n\n"
        let style = "@style {\n\t//Component-scope style goes here. You can refer to variables set in your base theme.\n}\n\n"
        contents = attr + env + mount + html + style
    }

    //Where do you want to save it?
    const saveCategory = await promptCategory(config)

    //Validate
    let parts: itemStruct = splitText(contents, [ "attr", "env", "mount", "unmount", "html", "style" ])
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
    if(!/.scaffold/.test(name)) name += ".scaffold"
    let filename = path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "components", saveCategory, name)
    fs.writeFileSync(filename, contents)

    console.log(endpoint(`\nAll done! Have fun with your new component.\n`))
}