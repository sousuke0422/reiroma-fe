<template>
  <div class="instance-specific-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background base04" v-if="header">
        <div class="title">{{ $t('nav.about') }} {{ sitename }}</div>
      </div>
      <div class="panel-body isp-content">
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="instanceSpecificPanelContent" />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>

<script src="./instance_specific_panel.js" ></script>

<style lang="scss">
.isp-content {
  margin: 1em
}
</style>
