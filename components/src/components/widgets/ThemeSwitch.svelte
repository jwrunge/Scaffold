<script lang="ts">
    import { onMount } from "svelte"
    import { uiMode } from "../../scripts/uiStore"
    import {switchTheme, themes} from "../../scripts/themeSwitch"

    export let initialMode: string = "light"

    function switchMode() {
        if($uiMode === "light") {
            switchTheme("dark")
            $uiMode = "dark"
        }
        else if($uiMode === "dark") {
            switchTheme("light")
            $uiMode = "light"
        }
    }

    onMount(()=> {
        $uiMode = initialMode
        switchTheme(initialMode)
    })
</script>

<svelte:options tag="rad-theme-switch"/>

<button on:click={switchMode}>
    {#if $uiMode === "light"} Dark
    {:else if $uiMode === "dark"} Light
    {/if}
</button>