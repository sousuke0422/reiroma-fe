<template>
  <video
    class="video"
    :src="attachment.url"
    :loop="loopVideo"
    :controls="controls"
    :alt="attachment.description"
    :title="attachment.description"
    :poster="attachment.large_thumb_url"
    playsinline
    @loadeddata="onVideoDataLoad"
  />
</template>

<script src="./video_attachment.js"></script>
