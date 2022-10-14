<script lang="ts">
    import {createEventDispatcher} from "svelte"

    {#if closable}
        <div class="control-bar" class:leftAlign={mac_style_controls}>
            {#if closable}
                <div class="control-button closer" on:click={()=> dispatch("close")} on:keydown={handleClose}>&times;</div>
            {/if}
        </div>
    {/if}
</script>