let properties: string[] = [
    "bg", "containerBg", "cardBg", "fontColor"
]

export const themes: string[] = [
    "light", "dark"
]

export function switchTheme(theme = "light") {
    let root: HTMLElement = document.querySelector(":root")!
    for(let property of properties) {
        let ucProperty: string = property[0].toUpperCase() + property.slice(1)
        root.style.setProperty(`--${property}`, `var(--${theme + ucProperty})`)
    }
}