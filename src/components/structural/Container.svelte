<script lang="ts">
    import ContainerControls from "../widgets/ContainerControls.svelte"
    import {onMount, createEventDispatcher} from "svelte"

    export let maxwidth: string = "";
    export let minwidth: string = "0";
    export let basewidth: string = "";
    export let header: string = ""
    export let showtopbar: string = "false"
    export let showbgcolor: string = "true"
    export let blurbg: string = "false"
    export let custombgfilter: string = ""
    export let dropshadow: string = "false"
    export let headerlevel: string = "h2"
    export let extratoppadding: string = "true"
    export let card: string = "false"
    export let mt: string = "0";
    export let mb: string = "0";
    export let ml: string = "auto";
    export let mr: string = "auto";
    export let mx: string = "";
    export let my: string = "";
    export let m: string = "";

    let margins = {
        t: mt,
        b: mb,
        l: ml,
        r: mr
    }

    //Controls
    export let mac_style_controls: string = "false"
    export let closable: string = "false"
    export let control_options: string = "[]"

    //Event handlers (pass through to parent)
    const dispatch: any = createEventDispatcher()
    function dispatchPassthrough(e: any) { dispatch(e.detail) }

    onMount(()=> {
        //Determine margins
        if(mx) {
            margins.l = mx
            margins.r = mx
        }

        if(my) {
            margins.t = my
            margins.b = my
        }

        if(m) {
            margins.l = m
            margins.r = m
            margins.t = m
            margins.b = m
        }
    })
</script>

<svelte:options tag="rad-container"/>

<div class="container" class:hasBg={showbgcolor === "true"} class:bgBlur={blurbg === "true"} class:dropshadow={dropshadow === "true"} class:card={card === "true"} class:squared={maxwidth === "100%" || maxwidth === "100vw"}
    style="max-width: {maxwidth}; min-width: {minwidth}; width: {basewidth}; {custombgfilter ? `backdrop-filter: ${custombgfilter}` : ""} margin: {margins.t} {margins.r} {margins.b} {margins.l}"
>
    <!-- Container controls -->
    {#if closable || control_options.length}
        <!-- <ContainerControls {closable} {control_options} {mac_style_controls} on:controlMessage={dispatchPassthrough}></ContainerControls> -->
    {/if}
    
    <div class="top" class:topbar={showtopbar === "true"} class:pad-bottom={header !== ""} class:extra-top-padding={extratoppadding === "true"}>
        {#if header}
            {#if headerlevel === "h1"}<h1 class='no-top-margin'>{header}</h1>{/if}
            {#if headerlevel === "h2"}<h2 class='no-top-margin'>{header}</h2>{/if}
            {#if headerlevel === "h3"}<h3 class='no-top-margin'>{header}</h3>{/if}
            {#if headerlevel === "h4"}<h4 class='no-top-margin'>{header}</h4>{/if}
            {#if headerlevel === "h5"}<h5 class='no-top-margin'>{header}</h5>{/if}
            {#if headerlevel === "h6"}<h6 class='no-top-margin'>{header}</h6>{/if}
        {/if}
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>

<style lang="scss">
    @use "sass:math";
    
    .container {      
        position: relative;
        box-sizing: border-box;
        border: variables.$border;
        &:not(.squared) {
            border-radius: variables.$borderRadius;
        }
        overflow: hidden;
        width: 100%;
        height: 100%;

        &.hasBg {
            &:not(.card) {
                background-color: var(--containerBg);
            }
            &.card {
                background-color: var(--cardBg);
            }
        }

        &.bgBlur {
            backdrop-filter: blur(30px);
        }

        &.dropshadow {
            box-shadow: variables.$boxShadow;
        }

        .top {
            padding: variables.$padding;

            &.extra-top-padding {
                padding-top: variables.$padding * 2;
            }

            h1, h2, h3, h4, h5, h6 { 
                margin: 0; 
                margin-bottom: math.div(variables.$padding, 3); 
            }

            &.pad-bottom {
                padding-bottom: 0;
            }
        }
        
        .topbar {
            background: var(--primary);
            h1, h2, h3, h4, h5, h6 { 
                color: white; 
                padding-bottom: math.div(variables.$padding, 2);
                margin-bottom: variables.$padding; 
            }
        }

        .content {
            padding-left: variables.$padding;
            padding-right: variables.$padding;
            padding-bottom: variables.$padding * 2;
        }
    }
</style>