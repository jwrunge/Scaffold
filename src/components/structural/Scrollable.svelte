<script lang='ts'>
    export let x: boolean = false
    export let y: boolean = true
    export let vh_height: boolean = true
</script>

<svelte:options tag="rad-scrollable"/>

<div class="scrollable" class:overflowX={x} class:overflowY={y} class:vhHeight={vh_height}>
    <slot></slot>
</div>

<style lang="scss">
    .scrollable {
        top: 0; left: 0;
        width: 100%; height: 100%;
        overflow: hidden;

        &.overflowX {
            overflow-x: scroll;
        }

        &.overflowY {
            overflow-y: scroll;
        }

        &.vhHeight {
            height: var(--window-height);
        }
    }
</style>