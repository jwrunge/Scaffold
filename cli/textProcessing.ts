export type itemStruct = {
    style?: string,
    variables?: string,
    extends?: string,
    type?: string,
    attr?: string,
    env?: string,
    mount?: string,
    unmount?: string,
    tick?: string,
    html?: string,
}

export const innerBracesRx = /(?<={)([^}]*)(?=})/gm
export const rootRx = /:root\s*?{([^}]*)}/gm
export const varsRx = /(?<!{[.|\n]*?)(?<!\w[:| ]\s*?)(?<!var\s*?\(\s*?)--.*?[\n|;](?!=[.|\n]*?})/gm

export function processCss(css: string): string[] {
    //Get top-level and :root{} vars seperate from base CSS
    const rootStringArr = css.match(rootRx) as string[]
    const rootString = rootStringArr ? rootStringArr[0].match(innerBracesRx) : ""
    const rootVarStringOnly = rootString ? rootString[0].replace(innerBracesRx, "") : ""
    const rootVars = rootVarStringOnly.replace(innerBracesRx, "").match(varsRx) as string[] || []
    const cssSansVars = css.replace(varsRx, "").replace(/^\s*?[\n|(\r\n)]{2,}/gm, "\n")

    //Return array of strings with [0] = main css and variabels occupying the rest
    return [cssSansVars, ...rootVars]
}

export function splitText(text: string, get: string[]): itemStruct {
    const blocks: string[] = text.split(/}?\s*?@/gmi)

    let items: itemStruct = {}
    for(let block of blocks) {
        const keyMatch: RegExpMatchArray | null = block.match(/.*?(?=\s*?{)/gmi)
        const valMatch: RegExpMatchArray | null = block.match(/(?<=\s*?{\s*?)[\S\s]*/gmi)
        const key: string = keyMatch ? keyMatch[0] : ""

        if(get.includes(key)) {
            const val: string = valMatch ? valMatch[0].replace(/}\s*?$/gmi, "") : ""
            items[key as keyof itemStruct] = val
        }
    }
    return items
}
