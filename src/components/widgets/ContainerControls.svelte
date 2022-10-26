<script lang="ts">
    import {createEventDispatcher} from "svelte"
    import type {containerControl} from "../../scripts/customTypes"

    //Controls
    export let mac_style_controls: string = "false"
    export let closable: string = "false"
    export let control_options: string = "[]"
</script>