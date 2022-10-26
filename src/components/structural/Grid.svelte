<script lang="ts">
    import {onMount} from "svelte"

    export let gridjustify: string = "start"
    export let gridalign: string = "center"
    export let max_cols: string = "4"
    export let min_cols: string = "1"

    let gridEl: HTMLElement
    onMount(()=> {
        gridEl.style.setProperty("--min-columns", min_cols)
        gridEl.style.setProperty("--max-columns", max_cols)
    })
</script>

<svelte:options tag="rad-grid"/>

<div bind:this={gridEl} class="grid" style="align-items: {gridalign}; justify-items: {gridjustify};">
    <slot></slot>
</div>

<style lang="scss">
    @use "sass:math";
    
    .grid {
        --min-columns: 1;
        --max-columns: 4;
        
        display: grid;
        grid-template-columns: repeat(var(--min-columns), 1fr);
        gap: 1rem;
        box-sizing: border-box;
        position: relative;

        @include variables.for-tablet {
            grid-template-columns: repeat(clamp(var(--min-columns), 2, var(--max-columns)), 1fr);
        }

        @include variables.for-sm {
            grid-template-columns: repeat(clamp(var(--min-columns), 3, var(--max-columns)), 1fr);
        }

        @include variables.for-lg {
            grid-template-columns: repeat(clamp(var(--min-columns), 4, var(--max-columns)), 1fr);
        }

        @include variables.for-xl {
            grid-template-columns: repeat(var(--max-columns), 1fr);
        }
    }
</style>