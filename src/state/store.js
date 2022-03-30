import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import * as Sentry from '@sentry/react'
import thunk from 'redux-thunk'

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
})

const DEFAULT_EDIT_BEFORE = {
  skills: {},
  name: '',
  job: '',
  intro: '',
}

const initialState = {
  activeGroup: localStorage.getItem('lastActiveGroup') || 'all',
  debugLogs: [],
  appListeners: [],
  gotoLink: 'home',
  token: '', //device token, unused @Todo

  authLoading: true,
  authUser: null,

  userLoading: true,
  user: null,

  recommendations: {},
  recommendationsLoading: false,

  postsLoading: true,
  postsOffset: null,
  postsLoadingMore: false,
  postSingleLoading: false,
  postsHasMore: true,
  posts: [],
  postById: {},

  postLikeLoading: false,
  postLikeById: {},

  usersLoading: true,
  usersOffset: null,
  usersLoadingMore: false,
  usersHasMore: true,
  users: [],
  userById: {},
  userSingleLoading: false,

  skillsLoading: true,
  skillCategories: [],
  skills: {},
  areasLoading: true,
  areaCategories: [],
  areas: {},

  //Search
  userSearchFilter: {
    type: null,
    value: null,
  },

  //Editing
  userEditBefore: DEFAULT_EDIT_BEFORE,
  userEditForm: DEFAULT_EDIT_BEFORE,

  userEditingChanged: false,
  userEditingLoading: false,

  //Nav
  postListScrollPos: 0,
  userListScrollPos: 0,
  chatListScrollPos: 0,
  notificationListScrollPos: 0,

  //notifications
  notifications: [],
  notificationsLoading: false,
  notificationsUnreadCount: 0,

  //Requests
  requests: [],
  requestsLoading: false,
  requestsPendingCount: 0,

  //Chats
  chatsLoading: false,
  chatsUnreadCount: 0,
  chatMessagesLoading: false,

  chatGroups: {},
  chatMessages: {},
}

const recalcUnreadCount = chatGroupMap => {
  let result = 0

  Object.values(chatGroupMap).forEach(g => {
    let lastReadId = localStorage.getItem(`lastRead-${g.id}`)
    if (lastReadId) {
      try {
        lastReadId = JSON.parse(lastReadId)
      } catch (err) {
        //ignore
      }
    }
    const currentMsgId = g.lastMessage?.id
    if (!!lastReadId && !!currentMsgId && lastReadId !== currentMsgId) {
      result++
    }
  })
  return result
}

const didChangeEdit = (state, newState) => {
  const before = JSON.stringify(state.userEditBefore)
  const after = JSON.stringify(newState.userEditForm)
  const changed = before !== after
  return changed
}

const getUpdatedUserMap = (users = [], state) => {
  const map = { ...state.userById }
  users.forEach(p => {
    if (!p) return
    map[p.id] = p
  })
  return map
}
const getUpdatedPostMap = (posts = [], state) => {
  const map = { ...state.postById }
  posts.forEach(p => {
    if (!p) return
    map[p.id] = p
  })
  return map
}

//this assumes each item has .id field else ignores it
const mergeById = (oldList = [], newList = []) => {
  const byId = {}
  oldList.forEach(i => {
    if (!i || !i.id) {
      console.warn('No id field found in item: mergeById')
      return
    }
    byId[i.id] = i
  })
  newList.forEach(i => {
    if (!i || !i.id) {
      console.warn('No id field found in item: mergeById')
      return
    }
    byId[i.id] = i
  })
  return Object.values(byId)
}

const reducer = (state = initialState, action) => {
  if (!state) return initialState
  switch (action.type) {
    case 'app/debug':
      return {
        ...state,
        debugLogs: [...state.debugLogs, action.log],
      }
    case 'app/gotoLink':
      return {
        ...state,
        gotoLink: action.gotoLink,
      }
    case 'app/token':
      return {
        ...state,
        token: action.token,
      }
    case 'app/update_listeners':
      return {
        ...state,
        appListeners: [...state.appListeners, ...action.listeners],
      }
    case 'app/exit':
      //assuming that we just have to call each
      try {
        console.log('cleaning up app listeners')
        for (let unsub of state.appListeners) {
          unsub()
        }
      } catch (err) {
        console.log('err cleaning up:', err.message)
      }
      return { ...state, appListeners: [] }
    case 'app/switch_active_group':
      localStorage.setItem('lastActiveGroup', action.activeGroup)
      return { ...state, activeGroup: action.activeGroup }
    case 'auth/init':
      return { ...state, authLoading: true, authUser: null }
    case 'auth/loading':
      return { ...state, authLoading: true }
    case 'auth/data':
      return { ...state, authUser: action.user, authLoading: false }

    //Chats

    case 'chat_groups/loading':
      return { ...state, chatsLoading: true }
    case 'chat_groups/data':
      const { groups } = action

      return {
        ...state,
        //@Todo unread count is wrong atm. Incomplete
        chatsUnreadCount: recalcUnreadCount(groups),
        chatGroups: groups,
        chatsLoading: false,
      }
    case 'chat_messages/loading': {
      const chatMessages = { ...state.chatMessages }
      chatMessages[action.chatGroupId] = [] //Reset @Todo optmize can we  not fetch old msgs EVERYTIME??
      return { ...state, chatMessagesLoading: true, chatMessages }
    }
    case 'chat_messages/reset': {
      const chatMessages = { ...state.chatMessages }
      chatMessages[action.chatGroupId] = [] //Reset @Todo optmize can we  not fetch old msgs EVERYTIME??
      return { ...state, chatMessages }
    }
    case 'chat_messages/loading_done':
      return { ...state, chatMessagesLoading: false }
    case 'chat_messages/data':
      const chatMessages = { ...state.chatMessages }
      if (action.messages) {
        chatMessages[action.chatGroupId] = action.messages
      }
      if (action.message) {
        chatMessages[action.chatGroupId].push(action.message)
      }
      return {
        ...state,
        chatMessages,
        chatsUnreadCount: recalcUnreadCount(state.chatGroups),
        chatMessagesLoading: false,
      }

    case 'notifications/loading':
      return { ...state, notificationsLoading: true }
    case 'notifications/data':
      return {
        ...state,
        notificationsUnreadCount: action.notifications.length,
        notifications: action.notifications,
        notificationsLoading: false,
      }
    case 'requests/loading':
      return { ...state, requestsLoading: true }
    case 'requests/data':
      const newReqs = mergeById(state.requests, action.requests)
      newReqs.sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1
      })
      const requestsPendingCount = newReqs.filter(
        i => i.status !== 'match',
      ).length
      return {
        ...state,
        requestsPendingCount,
        requests: newReqs,
        requestsLoading: false,
      }

    case 'auth/user_profile_loading':
      return { ...state, userLoading: true }
    case 'auth/user_profile_data':
      return { ...state, user: action.user, userLoading: false }

    case 'posts/reset':
      return {
        ...state,
        postsLoading: true,
        postsHasMore: true,
        posts: [],
        postsOffset: null,
      }
    case 'posts/loading':
      return { ...state, postsLoading: true, postsHasMore: true }
    case 'posts/loading_more':
      return { ...state, postsLoadingMore: true }
    case 'posts/data':
      return {
        ...state,
        posts: action.posts,
        postsOffset: action.offset,
        postsLoading: false,
        postById: getUpdatedPostMap(action.posts, state),
      }
    case 'postLike/loading':
      return {
        ...state,
        postLikeLoading: true,
      }
    case 'postLike/data':
      const postLikeById = {
        ...state.postLikeById,
        [action.postId]: action.liked,
      }
      return {
        ...state,
        postLikeById,
        postLikeLoading: false,
      }
    case 'posts/data_more':
      return {
        ...state,
        //@Todo dedupe and fix ordering
        posts: [...state.posts, ...action.posts],
        postsOffset: action.offset,
        postsLoadingMore: false,
        postById: getUpdatedPostMap(action.posts, state),
        postsHasMore: action.posts.length > 0,
      }
    case 'posts/data_single_loading':
      return {
        ...state,
        postSingleLoading: true,
      }
    case 'posts/data_single':
      return {
        ...state,
        postSingleLoading: false,
        postById: getUpdatedPostMap([action.post], state),
      }
    case 'edit_post/new_data':
      return {
        ...state,
        userEditingLoading: false,
        postById: getUpdatedPostMap([action.post], state),
      }

    //Users
    case 'users/loading': {
      const newState = { ...state, usersLoading: true }
      if (action.reset) {
        newState.users = []
        newState.usersOffset = null
      }
      return newState
    }
    case 'users/loading_done':
      return { ...state, usersLoading: false }
    case 'users/loading_more':
      return { ...state, usersLoadingMore: true }
    case 'users/data':
      return {
        ...state,
        users: action.users,
        usersOffset: action.offset,
        usersLoading: false,
        userById: getUpdatedUserMap(action.users, state),
        usersHasMore: action.hasMore,
      }
    case 'users/update_search':
      const payload = {
        userSearchFilter: action.filter,

        //reset offset and existing users
        usersOffset: null,
        usersHasMore: true,

        users: [],
      }

      return { ...state, ...payload }
    case 'users/data_more':
      return {
        ...state,
        //@Todo dedupe and fix ordering
        users: [...state.users, ...action.users],
        usersOffset: action.offset,
        usersLoadingMore: false,
        userById: getUpdatedUserMap(action.users, state),
        usersHasMore: action.hasMore,
      }
    case 'users/data_single_loading':
      return {
        ...state,
        userSingleLoading: true,
      }
    case 'users/data_single':
      return {
        ...state,
        userSingleLoading: false,
        userById: getUpdatedUserMap([action.user], state),
      }
    //Skills
    case 'skills/loading':
      return { ...state, skillsLoading: true }
    case 'skills/data':
      return {
        ...state,
        skills: action.skills,
        skillsLoading: false,
      }
    //Skill Categories
    case 'skill_categories/loading':
      return { ...state, skillCategoriesLoading: true }
    case 'skill_categories/data':
      return {
        ...state,
        skillCategories: action.skillCategories,
        skillCategoriesLoading: false,
      }
    //Recommendations
    case 'recommendations/loading':
      return { ...state, recommendationsLoading: true }
    case 'recommendations/data':
      return {
        ...state,
        recommendations: action.recommendations,
        recommendationsLoading: false,
      }
    //Areas
    case 'areas/loading':
      return { ...state, areasLoading: true }
    case 'areas/data':
      return {
        ...state,
        areas: action.areas,
        areasLoading: false,
      }
    //Area Categories
    case 'area_categories/loading':
      return { ...state, areaCategoriesLoading: true }
    case 'area_categories/data':
      return {
        ...state,
        areaCategories: action.areaCategories,
        areaCategoriesLoading: false,
      }
    case 'nav/scroll':
      return { ...state, [action.page + 'ScrollPos']: action.pos }
    case 'edit_user/new_data':
      return {
        ...state,
        userById: getUpdatedUserMap([action.user], state),
      }
    case 'edit_user/update_value': {
      const newState = {
        ...state,
      }
      if (action.name) {
        newState.userEditForm.name = action.name
      }
      if (action.job) {
        newState.userEditForm.job = action.job
      }
      if (action.intro) {
        newState.userEditForm.intro = action.intro
      }

      //Check if changed
      const changed = didChangeEdit(state, newState)
      newState.userEditingChanged = changed

      return newState
    }
    case 'edit_user/reset':
      const user = state.userById[state.authUser?.uid]
      const skillMap = {}
      user?.skills.forEach(s => (skillMap[s] = true))
      return {
        ...state,
        userEditBefore: {
          name: user?.name,
          job: user?.job,
          intro: user?.intro,
          skills: skillMap,
        },
        userEditForm: {
          name: user?.name,
          job: user?.job,
          intro: user?.intro,
          skills: skillMap,
        },
      }
    case 'edit_user/change_skill':
      const newSkills = {
        ...state.userEditForm.skills,
        [action.id]: action.selected,
      }

      //remove false keys
      for (let key in newSkills) {
        if (!newSkills[key]) delete newSkills[key]
      }

      const newState = {
        ...state,
        userEditForm: {
          ...state.userEditForm,
          skills: newSkills,
        },
      }

      //Check if changed
      const changed = didChangeEdit(state, newState)
      newState.userEditingChanged = changed

      return newState
    default:
      return state
  }
}

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk), sentryReduxEnhancer),
)
export default store
