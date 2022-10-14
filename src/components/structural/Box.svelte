<script lang="ts">
    export let max_width: string = "100%";
    export let header: string = ""
    export let topbar: boolean = false
</script>

<svelte:options tag="rad-box"/>

<div class="box" style="max-width: {max_width}">
    <slot></slot>
</div>

<div class="box" style="max-width: {max_width}">    
    <div class="top" class:topbar={topbar}>
        <h2 class='no-top-margin'>{header}</h2>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>

<style lang="scss">
    .box {
        position: relative;
        box-sizing: border-box;
        width: 100%; height: 100%;
        padding: variables.$padding;
        border: variables.$border;
        border-radius: variables.$borderRadius;
        background-color: var(--boxBg);
    }
</style>