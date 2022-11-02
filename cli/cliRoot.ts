import path from "path"
import {getArg} from "./getCommandLineArgs"
import {checkFile, getFile} from "./getFile"
import {createNewTheme} from "./newTheme"

//Set up config
export type cfg = {
    inputDir?: string,
    outputDir?: string,
}

let config: cfg = {
    inputDir: path.resolve(process.cwd(), "scaffold"),
    outputDir: path.resolve(process.cwd(), "dist/scaffold")
}

//Override defaults with config file
const configPath = path.resolve(process.cwd(), "scaffold.config.json")
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
let key: keyof cfg
for(key in config) {
    const a: string = getArg(key)
    console.log(a)
    if(a) config[key] = a
}

switch(getArg("mode")) {
    case "new-theme": 
        createNewTheme(config, getArg("theme-name"))
        break
    default: 
        console.error("No mode specified")
}