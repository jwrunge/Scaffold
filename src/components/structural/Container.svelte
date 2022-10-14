<script lang="ts">
    import {createEventDispatcher} from "svelte"

    export let max_width: string = "100%";
    export let header: string = ""
    export let topbar: boolean = false

    //Controls
    type customControl = {
        name: string,
        icon: string,
        dispatchMsg: string
    }

    export let mac_style_controls: boolean = false
    export let closable: boolean = false
    export let control_options: object[] = []

    //Event handlers
    function handleClose(e: any) {
        if(e.key == "Enter" || e.key == "Space") {
            dispatch("close")
        }
    }

    const dispatch: any = createEventDispatcher()
</script>

<svelte:options tag="rad-container"/>

<div class="container" style="max-width: {max_width}">
    {#if closable}
        <div class="control-bar" class:leftAlign={mac_style_controls}>
            {#if closable}
                <div class="control-button closer" on:click={()=> dispatch("close")} on:keydown={handleClose}>&times;</div>
            {/if}
        </div>
    {/if}
    
    <div class="top" class:topbar={topbar}>
        <h2 class='no-top-margin'>{header}</h2>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>

<style lang="scss">
    .container {      
        position: relative;
        box-sizing: border-box;
        margin: 0 auto;
        border: variables.$border;
        border-radius: variables.$borderRadius;
        box-shadow: variables.$boxShadow;
        backdrop-filter: blur(30px);
        background-color: var(--containerBg);
        overflow: hidden;

        .top {
            padding: variables.$padding;
            padding-top: variables.$padding * 2;
            h2 { margin: 0; }
        }
        
        .topbar {
            background: var(--primary);
            h2 { color: white; }
        }

        .content {
            padding-left: variables.$padding;
            padding-right: variables.$padding;
            padding-bottom: variables.$padding * 2;
        }
    }
</style>