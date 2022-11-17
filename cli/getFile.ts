import fs from "fs"
import path from "path"

export function checkFile(fpath: string): boolean {
    return fs.existsSync(fpath)
}

export function ensureDir(dpath: string) {
    if(!fs.existsSync(dpath)){
        fs.mkdirSync(dpath, { recursive: true });
    }
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

export function readDir(fpath: string, fullPath: boolean = false, dirs: boolean = false): string[] {
    let files: string[] = []

    try {
        for(let f of fs.readdirSync(fpath, {withFileTypes: true})) {
            //Ensure we are returning a dir or file as specified
            if(dirs && !f.isDirectory()) continue
            if(!dirs && f.isDirectory()) continue

            //Commit to array
            if(fullPath) files.push(path.resolve(fpath, f.name))
            else files.push(f.name)
        }
    }
    catch(e) {
        return []
    }

    return files
}