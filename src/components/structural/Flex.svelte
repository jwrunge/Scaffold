<script lang="ts">
    export let f_justify: string = "flex-start"
    export let f_align: string = "center"
</script>

<svelte:options tag="rad-flex"/>

<div class="flex" style="align-items: {f_align}; justify-content: {f_justify}">
    <slot></slot>
</div>

<style lang="scss">
    .flex {
        position: relative;
        display: flex;
    }
</style>