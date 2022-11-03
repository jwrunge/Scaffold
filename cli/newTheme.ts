import readline from "readline"
import type {cfg} from "./cliRoot"
import path from "path"
import fs from "fs"
import {checkFile} from "./getFile"

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
})

type theme = {
    name: string,
    extends?: string
}

//Ensures that a base theme exists
export function createBaseIfNotExist(config: cfg) {
    try {
        const outputLoc = path.resolve(config.outputDir || process.cwd(), "scaffold", "themes", "base.default.scss.scaffold")
        if(!checkFile(outputLoc)) {
            console.warn("Can't find base theme at " + outputLoc + "; creating base.default.scss.scaffold theme file")
            fs.mkdirSync(path.dirname(outputLoc), {recursive: true})
            fs.copyFileSync(path.resolve(__dirname, "..", "..", "defaults", "base.default.scss.scaffold"), outputLoc)

            rl.question("Scaffold just created a base theme for you. Do you want to continue extending that base? Future edits to the base theme may override this theme's definitions. ", (resp: string)=> {

            })
        }
    }
    catch(e) {
        console.error("There was an issue finding or creating the default theme. There may be an issue with your Scaffold installation. Please consider reinstalling to see if the issue persists.")
        process.exit(0)
    }
}

export function createNewTheme(config: cfg, name: string = "", ext?: string) {
    //Create base if it doesn't exist
    createBaseIfNotExist(config)

    let newTheme: theme = {
        name: ""
    }

    //Add name if not supplied
    function promptName(altPrompt: string = ""): Promise<string> {
        return new Promise((resolve)=> {
            if(!name) {
                rl.question(altPrompt || "What would you like to call your theme? ", (resp: string)=> {
                    resolve(confirmThemeName(resp.trim()))
                })
            }
            else resolve(name)
        })
    }

    //Name confirm
    function confirmThemeName(n: string): Promise<string> {
        return new Promise((resolve)=> {
            let newName = n.replace(/[^A-Za-z0-9\.\_\- ]/g, "").replace(/ /g, "-").replace(/--/g, "-").toLowerCase()

            if(newName.length > 64) {
                resolve(promptName("Your theme names are limited to 64 characters. Please pick another name: "))
            }
            else if(newName !== n) {
                rl.question(`Accounting for for Scaffold's case and character rules, we've converted your selected theme name to "${newName}". Is that OK? (Y)/n `, (resp: string = "Y")=> {
                    resp = resp.toLowerCase()
                    if(resp === "n") resolve(promptName())
                    else resolve(newName)
                })
            }
            else resolve(newName)
        })
    }

    promptName().then(res=> {
        newTheme.name = res
        rl.close()
    })

    //Select file to extend if not supplied
}