declare global {
    interface Window { createWebsocket: Function }
}

import './style/core.scss'

//Meta
export * from './components/meta/Window.svelte'

//Structural
export * from './components/structural/Root.svelte'
export * from './components/structural/Container.svelte'
export * from './components/structural/Scrollable.svelte'
export * from './components/structural/TextLimiter.svelte'
export * from './components/structural/Grid.svelte'
export * from './components/structural/Flex.svelte'

//Form Elements

//Widgets
export * from './components/widgets/ThemeSwitch.svelte'

//Scripts
export * from "./scripts/themeSwitch"