<template>
  <div>
    <div v-if="group" class="group-page panel panel-default base00-background">
      <group-card-content :groupName="groupName"></group-card-content>
    </div>
    <Timeline :title="'Group Timeline'" v-bind:timeline="timeline" v-bind:timeline-name="'group'" :groupName="groupName" />
  </div>
</template>

<script src="./group_page.js"></script>

<style lang="scss">

.group-page {
  flex: 2;
  flex-basis: 500px;
  padding-bottom: 10px;
  border-radius: 10px;
}

</style>
