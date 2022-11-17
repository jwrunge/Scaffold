import {type Writable, writable} from "svelte/store"
export let uiMode: Writable<string> = writable("light")