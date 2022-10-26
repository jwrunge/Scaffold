//Window height setting
export function updateWindowHeight() {
    console.log("RESIZING")
    document.documentElement.style.setProperty("--window-height", window.innerHeight + "px")
}

export function setWindowResizeFunction() {
    window.addEventListener("resize", updateWindowHeight)
    updateWindowHeight()
}