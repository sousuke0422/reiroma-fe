<template>
  <div class="popover-targets">
    <portal-target
      v-for="id in ids"
      :key="id"
      :name="id"
      :style="styles[id]"
      class="popover-target"
    />
  </div>
</template>
<script src="./popover_target.js" />
<style lang="scss">

.popover-targets {
  top: 0;
  left: 0;
  position: fixed;
}

.popover-target {
  position: fixed;
}

</style>
