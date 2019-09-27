<template>
  <div
    v-if="usePlaceHolder"
    @click="openModal"
  >
    <a
      v-if="type !== 'html'"
      class="placeholder"
      target="_blank"
      :href="attachment.url"
    >
      [{{ nsfw ? "NSFW/" : "" }}{{ type.toUpperCase() }}]
    </a>
  </div>
  <div
    v-else
    v-show="!isEmpty"
    class="attachment"
    :class="{[type]: true, loading, 'fullwidth': fullwidth, 'nsfw-placeholder': hidden}"
  >
    <a
      v-if="hidden"
      class="image-attachment"
      :href="attachment.url"
      @click.prevent="toggleHidden"
    >
      <div v-if="nsfwUseBlur && type !== 'video'" class="centered-hider">
        <a href="#">
          {{$t('general.sensitive')}}<br><small>{{$t('general.sensitive_hint')}}</small>
        </a>
      </div>
      <img
        v-if="!nsfwUseBlur"
        :key="nsfwImage"
        class="nsfw"
        :src="nsfwImage"
        :class="{'small': isSmall}"
      >
      <StillImage
        v-else-if="type === 'image' || attachment.large_thumb_url"
        class="nsfw-blur"
        :referrerpolicy="referrerpolicy"
        :mimetype="attachment.mimetype"
        :src="attachment.large_thumb_url || attachment.url"
      />
      <VideoAttachment
        v-else-if="type === 'video'"
        class="video nsfw-blur"
        :attachment="attachment"
        :controls="allowPlay"
      />
      <i
        v-if="type === 'video'"
        class="play-icon icon-play-circled"
      />
    </a>
    <div
      v-if="nsfw && hideNsfwLocal && !hidden"
      class="hider"
    >
      <a
        href="#"
        @click.prevent="toggleHidden"
      >{{$t('general.hide')}}</a>
    </div>

    <a
      v-if="type === 'image' && (!hidden || preloadImage)"
      class="image-attachment"
      :class="{'hidden': hidden && preloadImage && !nsfwUseBlur}"
      :href="attachment.url"
      target="_blank"
      :title="attachment.description"
      @click="openModal"
    >
      <StillImage
        :referrerpolicy="referrerpolicy"
        :mimetype="attachment.mimetype"
        :src="attachment.large_thumb_url || attachment.url"
      />
    </a>

    <a
      v-if="type === 'video' && !hidden"
      class="video-container"
      :class="{'small': isSmall}"
      :href="allowPlay ? undefined : attachment.url"
      @click="openModal"
    >
      <VideoAttachment
        class="video"
        :attachment="attachment"
        :controls="allowPlay"
      />
      <i
        v-if="!allowPlay"
        class="play-icon icon-play-circled"
      />
    </a>

    <audio
      v-if="type === 'audio'"
      :src="attachment.url"
      controls
    />

    <div
      v-if="type === 'html' && attachment.oembed"
      class="oembed"
      @click.prevent="linkClicked"
    >
      <div
        v-if="attachment.thumb_url"
        class="image"
      >
        <img :src="attachment.thumb_url">
      </div>
      <div class="text">
        <!-- eslint-disable vue/no-v-html -->
        <h1><a :href="attachment.url">{{ attachment.oembed.title }}</a></h1>
        <div v-html="attachment.oembed.oembedHTML" />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>
  </div>
</template>

<script src="./attachment.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.attachments {
  display: flex;
  flex-wrap: wrap;

  .attachment.media-upload-container {
    flex: 0 0 auto;
    max-height: 200px;
    max-width: 100%;
    display: flex;
    align-items: center;
    video {
      max-width: 100%;
    }
  }

  .placeholder {
    margin-right: 8px;
    margin-bottom: 4px;
  }

  .nsfw-placeholder {
    cursor: pointer;

    &.loading {
      cursor: progress;
    }
  }

  .attachment {
    position: relative;
    margin-top: 0.5em;
    align-self: flex-start;
    line-height: 0;

    border-style: solid;
    border-width: 1px;
    border-radius: $fallback--attachmentRadius;
    border-radius: var(--attachmentRadius, $fallback--attachmentRadius);
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    overflow: hidden;
  }

  .non-gallery.attachment {
    &.video {
      flex: 1 0 40%;
    }
    .nsfw {
      height: 260px;
    }
    .small {
      height: 120px;
      flex-grow: 0;
    }
    .video {
      height: 260px;
      display: flex;
    }
    video {
      max-height: 100%;
      object-fit: contain;
    }
  }

  .fullwidth {
    flex-basis: 100%;
  }
  // fixes small gap below video
  &.video {
    line-height: 0;
  }

  .video-container {
    display: flex;
    max-height: 100%;
  }

  .video {
    width: 100%;
    height: 100%;
  }

  .play-icon {
    position: absolute;
    font-size: 64px;
    top: calc(50% - 32px);
    left: calc(50% - 32px);
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  }

  .play-icon::before {
    margin: 0;
  }

  &.html {
    flex-basis: 90%;
    width: 100%;
    display: flex;
  }

  .hider {
    position: absolute;
    right: 0;
    white-space: nowrap;
    margin: 10px;
    padding: 5px;
    background: rgba(230,230,230,0.6);
    font-weight: bold;
    z-index: 4;
    line-height: 1;
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  }

  .centered-hider {
    position: absolute;
    width: 14em;
    height: 2em;
    top: calc(50% - 1em);
    left: calc(50% - 7em);
    text-align: center;
    white-space: nowrap;
    margin: auto;
    padding: 5px;
    background: rgba(230,230,230,0.6);
    font-weight: bold;
    z-index: 4;
    line-height: 1;
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  }

  .hider a, .centered-hider a {
    color: rgba(25,25,25,1.0);
  }

  video {
    z-index: 0;
  }

  audio {
    width: 100%;
  }

  img.media-upload {
    line-height: 0;
    max-height: 200px;
    max-width: 100%;
  }

  .oembed {
    line-height: 1.2em;
    flex: 1 0 100%;
    width: 100%;
    margin-right: 15px;
    display: flex;

    img {
      width: 100%;
    }

    .image {
      flex: 1;
      img {
        border: 0px;
        border-radius: 5px;
        height: 100%;
        object-fit: cover;
      }
    }

    .text {
      flex: 2;
      margin: 8px;
      word-break: break-all;
      h1 {
        font-size: 14px;
        margin: 0px;
      }
    }
  }

  .image-attachment {
    width: 100%;
    height: 100%;

    &.hidden {
      display: none;
    }

    .nsfw {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    .nsfw-blur {
      filter: blur(3.0rem);
    }

    img {
      image-orientation: from-image; // NOTE: only FF supports this
    }
  }
}
</style>
