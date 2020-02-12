<template>
  <!-- This is for the weird portal shit
  <div
    @mouseenter="registerPopover"
    @mouseleave="unregisterPopover"
  >
    <slot name="trigger"></slot>
    <portal
      v-if="targetId"
      :to="targetId"
    >
      <slot name="content"></slot>
    </portal>
  </div>
  -->
  <div
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <div @click="onClick" ref="trigger">
      <slot name="trigger"></slot>
    </div>
    <div
      v-if="display"
      :style="styles"
      class="popover"
    >
      <div
        ref="content"
        class="popover-inner"
      >
      <!-- onSuccess is to mimic basic functionality of v-popover -->
        <slot
          name="content"
          @onSuccess="hidePopover"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script src="./popover.js" />

<style lang=scss>
@import '../../_variables.scss';

.popover {
  z-index: 8;
  position: absolute;
  min-width: 0;

  .popover-inner {
    box-shadow: 1px 1px 4px rgba(0,0,0,.6);
    box-shadow: var(--panelShadow);
    border-radius: $fallback--btnRadius;
    border-radius: var(--btnRadius, $fallback--btnRadius);
    background-color: $fallback--bg;
    background-color: var(--bg, $fallback--bg);
  }

  .popover-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: $fallback--bg;
    border-color: var(--bg, $fallback--bg);
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .popover-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -4px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .popover-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -4px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .popover-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -4px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .popover-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -4px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }
}

.dropdown-menu {
  display: block;
  padding: .5rem 0;
  font-size: 1rem;
  text-align: left;
  list-style: none;
  max-width: 100vw;
  z-index: 10;
  white-space: nowrap;

  .dropdown-divider {
    height: 0;
    margin: .5rem 0;
    overflow: hidden;
    border-top: 1px solid $fallback--border;
    border-top: 1px solid var(--border, $fallback--border);
  }

  .dropdown-item {
    line-height: 21px;
    margin-right: 5px;
    overflow: auto;
    display: block;
    padding: .25rem 1.0rem .25rem 1.5rem;
    clear: both;
    font-weight: 400;
    text-align: inherit;
    white-space: nowrap;
    border: none;
    border-radius: 0px;
    background-color: transparent;
    box-shadow: none;
    width: 100%;
    height: 100%;

    &-icon {
      padding-left: 0.5rem;

      i {
        margin-right: 0.25rem;
      }
    }

    &:hover {
      // TODO: improve the look on breeze themes
      background-color: $fallback--fg;
      background-color: var(--btn, $fallback--fg);
      box-shadow: none;
    }
  }
}
</style>
