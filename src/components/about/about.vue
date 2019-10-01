<template>
  <div class="sidebar">
    <instance-specific-panel v-if="isMobileLayout || showInstanceSpecificPanel" />
    <features-panel v-if="showFeaturesPanel" />
    <terms-of-service-panel />
  </div>
</template>

<script src="./about.js" ></script>

<style lang="scss">
</style>
