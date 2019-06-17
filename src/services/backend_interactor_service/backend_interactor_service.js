import apiService from '../api/api.service.js'
import timelineFetcherService from '../timeline_fetcher/timeline_fetcher.service.js'
import notificationsFetcher from '../notifications_fetcher/notifications_fetcher.service.js'

const backendInteractorService = credentials => {
  const fetchStatus = ({ id }) => {
    return apiService.fetchStatus({ id, credentials })
  }

  const fetchConversation = ({ id }) => {
    return apiService.fetchConversation({ id, credentials })
  }

  const fetchFriends = ({ id, maxId, sinceId, limit }) => {
    return apiService.fetchFriends({ id, maxId, sinceId, limit, credentials })
  }

  const exportFriends = ({ id }) => {
    return apiService.exportFriends({ id, credentials })
  }

  const fetchFollowers = ({ id, maxId, sinceId, limit }) => {
    return apiService.fetchFollowers({ id, maxId, sinceId, limit, credentials })
  }

  const fetchUser = ({ id }) => {
    return apiService.fetchUser({ id, credentials })
  }

  const fetchUserRelationship = ({ id }) => {
    return apiService.fetchUserRelationship({ id, credentials })
  }

  const followUser = (id) => {
    return apiService.followUser({ credentials, id })
  }

  const unfollowUser = (id) => {
    return apiService.unfollowUser({ credentials, id })
  }

  const blockUser = (id) => {
    return apiService.blockUser({ credentials, id })
  }

  const unblockUser = (id) => {
    return apiService.unblockUser({ credentials, id })
  }

  const approveUser = (id) => {
    return apiService.approveUser({ credentials, id })
  }

  const denyUser = (id) => {
    return apiService.denyUser({ credentials, id })
  }

  const startFetchingTimeline = ({ timeline, store, userId = false, tag }) => {
    return timelineFetcherService.startFetching({ timeline, store, credentials, userId, tag })
  }

  const startFetchingNotifications = ({ store }) => {
    return notificationsFetcher.startFetching({ store, credentials })
  }

  const tagUser = ({ screen_name }, tag) => {
    return apiService.tagUser({ screen_name, tag, credentials })
  }

  const untagUser = ({ screen_name }, tag) => {
    return apiService.untagUser({ screen_name, tag, credentials })
  }

  const addRight = ({ screen_name }, right) => {
    return apiService.addRight({ screen_name, right, credentials })
  }

  const deleteRight = ({ screen_name }, right) => {
    return apiService.deleteRight({ screen_name, right, credentials })
  }

  const setActivationStatus = ({ screen_name }, status) => {
    return apiService.setActivationStatus({ screen_name, status, credentials })
  }

  const deleteUser = ({ screen_name }) => {
    return apiService.deleteUser({ screen_name, credentials })
  }

  const vote = (pollId, choices) => {
    return apiService.vote({ credentials, pollId, choices })
  }

  const fetchPoll = (pollId) => {
    return apiService.fetchPoll({ credentials, pollId })
  }

  const updateNotificationSettings = ({ settings }) => {
    return apiService.updateNotificationSettings({ credentials, settings })
  }

  const fetchMutes = () => apiService.fetchMutes({ credentials })
  const muteUser = (id) => apiService.muteUser({ credentials, id })
  const unmuteUser = (id) => apiService.unmuteUser({ credentials, id })
  const fetchBlocks = () => apiService.fetchBlocks({ credentials })
  const fetchFollowRequests = () => apiService.fetchFollowRequests({ credentials })
  const fetchOAuthTokens = () => apiService.fetchOAuthTokens({ credentials })
  const revokeOAuthToken = (id) => apiService.revokeOAuthToken({ id, credentials })
  const fetchPinnedStatuses = (id) => apiService.fetchPinnedStatuses({ credentials, id })
  const pinOwnStatus = (id) => apiService.pinOwnStatus({ credentials, id })
  const unpinOwnStatus = (id) => apiService.unpinOwnStatus({ credentials, id })

  const getCaptcha = () => apiService.getCaptcha()
  const register = (params) => apiService.register(params)
  const updateAvatar = ({ avatar }) => apiService.updateAvatar({ credentials, avatar })
  const updateBg = ({ params }) => apiService.updateBg({ credentials, params })
  const updateBanner = ({ banner }) => apiService.updateBanner({ credentials, banner })
  const updateProfile = ({ params }) => apiService.updateProfile({ credentials, params })


  const externalProfile = (profileUrl) => apiService.externalProfile({ profileUrl, credentials })
  const importBlocks = (file) => apiService.importBlocks({ file, credentials })
  const importFollows = (file) => apiService.importFollows({ file, credentials })

  const deleteAccount = ({ password }) => apiService.deleteAccount({ credentials, password })
  const changePassword = ({ password, newPassword, newPasswordConfirmation }) =>
    apiService.changePassword({ credentials, password, newPassword, newPasswordConfirmation })

  const fetchFavoritedByUsers = (id) => apiService.fetchFavoritedByUsers({ id })
  const fetchRebloggedByUsers = (id) => apiService.fetchRebloggedByUsers({ id })
  const reportUser = (params) => apiService.reportUser({ credentials, ...params })
  const fetchSettingsMFA = () => apiService.settingsMFA({ credentials })
  const generateMfaBackupCodes = () => apiService.generateMfaBackupCodes({ credentials })
  const mfaSetupOTP = () => apiService.mfaSetupOTP({ credentials })
  const mfaConfirmOTP = ({ password, token }) => apiService.mfaConfirmOTP({ credentials, password, token })
  const mfaDisableOTP = ({ password }) => apiService.mfaDisableOTP({ credentials, password })

  const favorite = (id) => apiService.favorite({ id, credentials })
  const unfavorite = (id) => apiService.unfavorite({ id, credentials })
  const retweet = (id) => apiService.retweet({ id, credentials })
  const unretweet = (id) => apiService.unretweet({ id, credentials })

  const backendInteractorServiceInstance = {
    fetchStatus,
    fetchConversation,
    fetchFriends,
    exportFriends,
    fetchFollowers,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    fetchUser,
    fetchUserRelationship,
    verifyCredentials: apiService.verifyCredentials,
    startFetchingTimeline,
    startFetchingNotifications,
    fetchMutes,
    muteUser,
    unmuteUser,
    fetchBlocks,
    fetchOAuthTokens,
    revokeOAuthToken,
    fetchPinnedStatuses,
    pinOwnStatus,
    unpinOwnStatus,
    tagUser,
    untagUser,
    addRight,
    deleteRight,
    deleteUser,
    setActivationStatus,
    register,
    getCaptcha,
    updateAvatar,
    updateBg,
    updateBanner,
    updateProfile,
    externalProfile,
    importBlocks,
    importFollows,
    deleteAccount,
    changePassword,
    fetchSettingsMFA,
    generateMfaBackupCodes,
    mfaSetupOTP,
    mfaConfirmOTP,
    mfaDisableOTP,
    fetchFollowRequests,
    approveUser,
    denyUser,
    vote,
    fetchPoll,
    fetchFavoritedByUsers,
    fetchRebloggedByUsers,
    reportUser,
    favorite,
    unfavorite,
    retweet,
    unretweet,
    updateNotificationSettings
  }

  return backendInteractorServiceInstance
}

export default backendInteractorService
