export function getArg(key: string): string {
    // Return true if the key exists and a value is defined
    if(process.argv.includes( `--${key}`)) return "true"
    const value = process.argv.find(element => element.startsWith(`--${key}=`))

    // Return null if the key does not exist and a value is not defined
    if(!value) return ""
    return value.replace(`--${key}=` , '')
}