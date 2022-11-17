<script lang="ts">
    import {onMount} from "svelte"
    import {setWindowResizeFunction} from "../../scripts/utils"
    import type {websocketSetupOptions} from "../../scripts/customTypes"
    import WS from "../../scripts/ws"

    export let vh100: string = "false"
    export let registerwsfunc: string = "false"
    
    onMount(()=> {
        if(vh100 === "true") {
            setWindowResizeFunction()
        }

        if(registerwsfunc === "true") {
            window.createWebsocket = function(options: websocketSetupOptions): WS {
                return new WS(options)
            }
        }
    })
</script>

<svelte:options tag="rad-window"/>