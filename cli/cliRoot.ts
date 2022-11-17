import path from "path"
import { Syntax } from "sass"
import { compileSrc } from "./compile"
import {getArg} from "./getCommandLineArgs"
import {checkFile, getFile} from "./getFile"
import {createNewTheme, createNewComponent} from "./newFile"

//Set up config
type cssConfig = {
    cssName?: string,
    cssTransformScript?: string,
    sassSyntax?: Syntax,
    cssCompress?: boolean,
}
export type cfg = {
    srcOutputDir?: string,
    distOutputDir?: string,
    newThemeMiddleware?: string[],
    processThemeMiddleware?: string[],
    buildComponents?: object,
    cssOutput?: cssConfig,
}

//Set default config
let config: cfg = JSON.parse(getFile(path.resolve(__dirname, "../..", "defaults", "config.json"))) as cfg

//Override defaults with config file
const configArg = getArg("config")
const configFile = configArg || "scaffold.config.json"
let configPath = path.resolve(process.cwd(), configFile)

if(checkFile(configPath)) {
    try {
        const configFile: cfg = JSON.parse(
            getFile(configPath)
        )

        config = {...config, ...configFile}
    }
    catch(e) {
        console.error("Invalid scaffold.config.json file", e)
    }
}

//Override config with command arg
// let key: keyof cfg
// for(key in config) {
//     const a: string = getArg(key)
//     console.log(a)
//     if(a) config[key] = a
// }

switch(getArg("mode")) {
    case "new-theme": 
        createNewTheme(config)
        break
    case "new-component": 
        createNewComponent(config)
        break
    case "compile": 
        compileSrc(config)
        break
    default: 
        console.error("No mode specified")
}