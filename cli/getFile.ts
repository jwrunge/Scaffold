import fs from "fs"
import path from "path"

export function checkFile(fpath: string): boolean {
    return fs.existsSync(fpath)
}

export function getFile(fpath: string, noExist?: Function): string {
    if(fs.existsSync(fpath)) {
        return fs.readFileSync(fpath).toString()
    }
    else {
        if(noExist) return noExist(fpath)
        else return ""
    }
}

export function readDir(fpath: string, fullPath: boolean = false) {
    let files: string[] = []
    for(let filename of fs.readdirSync(fpath)) {
        if(fullPath) files.push(path.resolve(fpath, filename))
        else files.push(filename)
    }

    return files
}