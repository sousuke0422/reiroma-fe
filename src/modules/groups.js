import { compact, map, each, merge } from 'lodash'

export const mergeOrAdd = (arr, obj, item) => {
  if (!item) { return false }
  const oldItem = obj[item.nickname]
  if (oldItem) {
    // We already have this, so only merge the new info.
    merge(oldItem, item)
    return {item: oldItem, new: false}
  } else {
    // This is a new item, prepare it
    arr.push(item)
    obj[item.nickname] = item
    return {item, new: true}
  }
}

export const defaultState = {
  groups: [],
  groupsObject: {},
  groupMemberships: {}
}

const groups = {
  state: defaultState,
  mutations: {
    addNewGroups (state, statuses) {
      each(statuses, (groups) => {
        each(groups, (group) => mergeOrAdd(state.groups, state.groupsObject, group))
      })
    },
    addNewGroup (state, group) {
      mergeOrAdd(state.groups, state.groupsObject, group)
    },
    addMembership (state, {groupName, membership}) {
      state.groupMemberships[groupName] = membership
    }
  },
  actions: {
    fetchGroup (store, { groupName }) {
      store.rootState.api.backendInteractor.fetchGroup({ groupName })
        .then((group) => store.commit('addNewGroup', group))
    },
    fetchIsMember (store, { groupName, id }) {
      store.rootState.api.backendInteractor.fetchIsMember({id, groupName})
        .then((membership) => store.commit('addMembership', {groupName, 'membership': membership.is_member}))
    },
    addNewStatuses (store, { statuses }) {
      const groups = compact(map(statuses, 'statusnet_in_groups'))
      store.commit('addNewGroups', groups)
    }
  }
}

export default groups
