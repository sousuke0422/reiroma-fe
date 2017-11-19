<template>
  <div id="heading" class="group-panel-background" :style="headingStyle">
    <div class="panel-heading text-center">
      <div class='group-info'>
        <div class='container'>
          <router-link :to="{ name: 'group-page', params: { name: group.nickname } }">
            <img v-if="!!group.original_logo" :src="group.original_logo">
            <img v-else src="https://placehold.it/48x48">
          </router-link>
          <span class="glyphicon glyphicon-user"></span>
          <div class="name-and-screen-name">
            <div class='group-name'>{{group.nickname}}</div>
            <router-link :to="{ name: 'group-page', params: { name: group.nickname } }">
              <div class='group-full-name'>{{group.fullname}}</div>
            </router-link>
          </div>
        </div>
        <div class="group-interactions">
          <div class="member" v-if="loggedIn">
            <span v-if="isMember">
              <button @click="leaveGroup" class="base04 base00-background pressed">
                {{ $t('group_card.leave') }}
              </button>
            </span>
            <span v-if="!isMember">
              <button @click="joinGroup" class="base05 base02-background">
                {{ $t('group_card.join') }}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-body group-panel-body">
      <div class="member-counts">
        <div class="member-count">
          <a href="#" v-on:click.prevent="setGroupView('statuses')"><h5 class="base05">{{ $t('user_card.statuses') }}</h5></a>
        </div>
        <div class="member-count">
          <a href="#" v-on:click.prevent="setGroupView('members')"><h5 class="base05">{{ $t('group_card.members') }}</h5></a>
          <span class="base05">{{group.member_count}}</span>
        </div>
      </div>
      <p>{{group.description}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: [ 'groupName' ],
    computed: {
      group () {
        return this.$store.state.groups.groupsObject[this.groupName]
      },
      headingStyle () {
        let color = this.$store.state.config.colors['base00']
        if (color) {
          let rgb = this.$store.state.config.colors['base00'].match(/\d+/g)
          return {
            backgroundColor: `rgb(${Math.floor(rgb[0] * 0.53)}, ${Math.floor(rgb[1] * 0.56)}, ${Math.floor(rgb[2] * 0.59)})`,
            backgroundImage: `url(${this.group.cover_photo})`
          }
        }
      },
      loggedIn () {
        return !!this.$store.state.users.currentUser
      },
      isMember () {
        return this.$store.state.groups.groupMemberships[this.groupName]
      }
    },
    methods: {
      setMember (value) {
        this.$store.state.groups.groupMemberships[this.groupName] = value
      },
      joinGroup () {
        const store = this.$store
        store.state.api.backendInteractor.joinGroup({'groupName': this.group.nickname})
          .then((joinedGroup) => {
            store.commit('addNewGroup', joinedGroup)
            this.setMember(true)
          })
      },
      leaveGroup () {
        const store = this.$store
        store.state.api.backendInteractor.leaveGroup({'groupName': this.group.nickname})
          .then((leftGroup) => {
            store.commit('addNewGroup', leftGroup)
            this.setMember(false)
          })
      },
      setGroupView (v) {
        const store = this.$store
        store.commit('setGroupView', { v })
      }
    }
  }
</script>

<style lang="scss">
@import '../../_variables.scss';

.group-panel-background {
  background-size: cover;
  border-radius: 10px;

  .panel-heading {
    padding: 0.6em 0em;
    text-align: center;
  }
}

.group-panel-body {
  top: -0em;
  padding-top: 4em;

  word-wrap: break-word;
}

.group-info {
	color: white;
  padding: 0 16px 16px 16px;
  margin-bottom: -4em;

  .container{
    padding: 16px 10px 4px 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
    max-height: 56px;
    overflow: hidden;
  }

  img {
    border-radius: 5px;
    flex: 1 0 100%;
    width: 56px;
    height: 56px;
    box-shadow: 0px 1px 8px rgba(0,0,0,0.75);
    object-fit: cover;
  }

	text-shadow: 0px 1px 1.5px rgba(0, 0, 0, 1.0);

  .name-and-screen-name {
    display: block;
    margin-left: 0.6em;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-name{
      color: white;
	}

  .group-full-name {
      color: white;
      font-weight: lighter;
      font-size: 15px;
      padding-right: 0.1em;
      flex: 0 0 auto;
  }

  .group-interactions {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;

    div {
      flex: 1;
    }
    margin-top: 0.7em;
    margin-bottom: -1.0em;

    .following {
      color: white;
      font-size: 14px;
      flex: 0 0 100%;
      margin: -0.7em 0.0em 0.3em 0.0em;
      padding-left: 16px;
      text-align: left;
    }

    .mute {
      max-width: 220px;
      min-height: 28px;
    }

    .follow {
      max-width: 220px;
      min-height: 28px;
    }

    button {
      width: 92%;
      height: 100%;
    }
    .pressed {
      border-bottom-color: rgba(255, 255, 255, 0.2);
      border-top-color: rgba(0, 0, 0, 0.2);
    }
  }
}

.member-counts {
    display: flex;
    line-height:16px;
    padding: 1em 1.5em 0em 1em;
    text-align: center;
}

.member-count {
    flex: 1;

    h5 {
    	font-size:1em;
        font-weight: bolder;
        margin: 0 0 0.25em;
    }
    a {
        text-decoration: none;
    }
}
</style>
