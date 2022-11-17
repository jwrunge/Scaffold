<script lang="ts">
    import ContainerControls from "../widgets/ContainerControls.svelte"
    import {createEventDispatcher} from "svelte"
    import type {containerControl} from "../../scripts/customTypes"

    export let max_width: string = "100%";

    //Controls
    export let mac_style_controls: boolean = false
    export let closable: boolean = false
    export let control_options: containerControl[] = []

    //Event handlers (pass through to parent)
    const dispatch: any = createEventDispatcher()
    function dispatchPassthrough(e: any) { dispatch(e.detail) }
</script>

<svelte:options tag="rad-root"/>

<div class="root" style="max-width: {max_width}">
    <!-- Container controls -->
    {#if closable || control_options.length}
        <ContainerControls {closable} {control_options} {mac_style_controls} on:controlMessage={dispatchPassthrough}></ContainerControls>
    {/if}
    
    <div class="content">
        <slot></slot>
    </div>
</div>

<style lang="scss">
    .root {      
        position: relative;
        box-sizing: border-box;
        margin: 0 auto;
    }
</style>