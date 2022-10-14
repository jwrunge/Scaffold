<script lang="ts">
    import { uiMode } from "../../scripts/uiStore"
    import {switchTheme} from "../../scripts/themeSwitch"

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
</script>

<svelte:options tag="rad-theme-switch"/>

<button on:click={switchMode}>
    {#if $uiMode === "light"} Dark
    {:else if $uiMode === "dark"} Light
    {/if}
</button>