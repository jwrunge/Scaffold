const fs = require("fs")
const path = require("path")

//Get all files in cli folder
const files = fs.readdirSync(path.resolve(__dirname, "../cli"))
let libs = []

for(let file of files) {
  libs.push({
    entry: path.resolve(__dirname, `cli/${file}`),
    fileName: file.replace(/.ts$/, "")
  })
}

for(let lib of libs) {
    //Add shebang
    const shebang = "#!/usr/bin/env node"
    const outFile = path.resolve(__dirname, `../dist/cli/${lib.fileName}.js`)

    //Read, add shebang, write
    const js = shebang + "\n\n" + fs.readFileSync(outFile)
    fs.writeFileSync(outFile, js)

    //chmod+x
    fs.chmodSync(outFile, "755")
}