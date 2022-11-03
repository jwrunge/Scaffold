type itemStruct = {
    styleConstants?: string,
    styleVariables?: string,
    extends?: string,
    type?: string,
    attr?: string,
    env?: string,
    mount?: string,
    unmount?: string,
    tick?: string,
    html?: string,
    style?: string
}

export function splitText(text: string) {
    //Match keys and values from .scaffold files
    const matches: RegExpMatchArray | null = text.match(/(?<=[@|{]\s*?)(.|\n)*?(?=\s*?[{|}])/gmi)

    //Sort into key-val map
    let items: itemStruct = {}
    for(let i: number = 0; matches && i+1 < matches.length; i+=2) {
        items[matches[i]] = matches[i+1].replace(/(^\s*|\s*$|(?<= ) )/gmi, "")
    }
}
