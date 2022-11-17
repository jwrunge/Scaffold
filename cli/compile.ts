import path from "path"
import fs from "fs"
import sass, { CompileResult, StringOptions } from "sass"
import type { cfg } from "./cliRoot"
import { checkFile, getFile, readDir, ensureDir } from "./getFile"
import { splitText, processCss, rootRx, varsRx, type itemStruct } from "./textProcessing"

export function compileSrc(config: cfg) {
    const cssPath = path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes")
    compileCss(cssPath, config)
}

function compileCss(dir: string, config: cfg): string {
    const extension = config.cssOutput?.sassSyntax === "css" ? ".css" : config.cssOutput?.sassSyntax === "indented" ? ".sass" : ".scss"

    //Get base
    const baseFile: string = getFile(path.join(dir, `base${extension}`))
    const baseParts: string[] = processCss(baseFile)
    const baseCss: string = baseParts[0] || ""
    const baseRoot: string = (()=> {
        let br = baseCss.match(rootRx)
        return br ? br[0] : ""
    })()
    const baseVars: string[] = baseParts.slice(1)

    //Get themes
    const files: string[] = readDir(dir, false, false)
    let themeVars: string[] = []

    for(let file of files) {
        //Get file, skipping if base
        const data = getFile(path.join(dir, file))
        if(file === `base${extension}`) continue

        //Get variables from theme; Loop over current theme variables, adding to global theme vars array or discarding based on if it is in base theme
        const parts: string[] = processCss(data)
        const curThemeVars: string[] = parts.slice(1)

        const extRx = RegExp(extension)
        for(let v of curThemeVars) {
            if(baseVars.includes(v)) themeVars.push(`${v.replace("--", `--` + file.replace(extRx, "") + "-")}`)
        }
    }

    //Compile
    let newRoot = baseRoot.replace(/:root\s*?{/, `:root {\n\t${baseVars.join("\n\t")}\n\t${themeVars.join("\n\t")}`)
    let cssOutput = baseCss.replace(rootRx, newRoot)

    //Convert
    if(config.cssOutput?.cssTransformScript) {
        import(path.resolve(process.cwd(), config.cssOutput.cssTransformScript))
            .then(transform=> cssOutput = transform(cssOutput, config))
            .catch(err=> console.error(err(`Your CSS transform script was specified in the Scaffold config, but could not be loaded or did not run correctly. ${err}`)))
    }

    //Run Sass
    const sassOps: StringOptions<"sync"> = {
        syntax: config.cssOutput?.sassSyntax || "scss",
        style: config.cssOutput?.cssCompress !== false ? "compressed" : "expanded",
        loadPaths: [ process.cwd(), path.resolve(process.cwd(), config.srcOutputDir || "", "scaffold", "themes" )]
    }
    let op: CompileResult = sass.compileString(cssOutput, sassOps)
    cssOutput = op.css

    //Save CSS file
    let cssDistOutputName = path.resolve(process.cwd(), config.distOutputDir || "", `${config.cssOutput?.cssName?.replace(/\.css$/, "") || "bundle"}.css`)
    ensureDir(path.resolve(process.cwd(), config.distOutputDir || ""))
    fs.writeFileSync(cssDistOutputName, cssOutput)

    return cssOutput
}