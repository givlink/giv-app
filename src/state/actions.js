import api from 'lib/api'
import utils from 'lib/utils'

const actions = {
  login: provider => {
    return async dispatch => {
      await api.logout()
      dispatch({ type: 'auth/init' })
      await api.login(provider)
    }
  },
  loginWithEmail: (email, password) => {
    return async dispatch => {
      dispatch({ type: 'auth/init' })
      api.loginWithEmail(email, password)
    }
  },
  logout: () => {
    return async dispatch => {
      dispatch({ type: 'auth/init' })
      dispatch({ type: 'app/exit' })
      await api.logout()
    }
  },
  loadInitialAreaCategories: (setLoading = true) => {
    return async dispatch => {
      if (setLoading) {
        dispatch({ type: 'area_categories/loading' })
      }
      const areaCategories = (await api.listPlaceCategories()) || []
      dispatch({ type: 'area_categories/data', areaCategories })
    }
  },
  loadInitialSkillCategories: (setLoading = true) => {
    return async dispatch => {
      if (setLoading) {
        dispatch({ type: 'skill_categories/loading' })
      }
      const skillCategories = await api.listSkillCategories()
      dispatch({ type: 'skill_categories/data', skillCategories })
    }
  },
  loadInitialAreas: (setLoading = true) => {
    return async dispatch => {
      if (setLoading) {
        dispatch({ type: 'areas/loading' })
      }
      const areas = (await api.listAreas()) || []
      dispatch({ type: 'areas/data', areas })
    }
  },
  loadInitialGivTypes: (setLoading = true) => {
    return async dispatch => {
      if (setLoading) {
        dispatch({ type: 'givTypes/loading' })
      }
      const givTypes = (await api.listGivTypes()) || []
      const givTypeMap = {}
      givTypes.forEach(s => (givTypeMap[s.id] = s))
      dispatch({ type: 'givTypes/data', givTypeMap })
    }
  },
  loadInitialSkills: (setLoading = true) => {
    return async dispatch => {
      if (setLoading) {
        dispatch({ type: 'skills/loading' })
      }
      const skills = (await api.listSkills()) || []
      const skillMap = {}
      skills.forEach(s => (skillMap[s.id] = s))
      dispatch({ type: 'skills/data', skills: skillMap })
    }
  },
  loadRecommendations: () => {
    return async (dispatch, getState) => {
      const { activeGroup } = getState()
      dispatch({ type: 'recommendations/loading' })
      const recommendations = {
        matchingYourInterests: await api.listRecommendations(null, activeGroup),
        matchingYourSkills: await api.listUsersWhoLikeYourSkills(
          null,
          activeGroup,
        ),
        similarInterests: await api.listSimilarUsers(null, activeGroup),
      }
      dispatch({ type: 'recommendations/data', recommendations })
    }
  },
  setLiked: (postId, liked) => {
    return async (dispatch, getState) => {
      const { user } = getState()
      // setting optimistic result before actual api call
      dispatch({ type: 'postLike/data', postId, liked })
      //@Todo err handling
      if (liked) {
        api.likePost(postId, user.id)
      } else {
        api.unlikePost(postId, user.id)
      }
    }
  },
  loadUserProfile: () => {
    return async (dispatch, getState) => {
      const { authUser } = getState()
      if (!authUser) {
        console.warn('trying to load user profile but not authUser found')
        return
      }
      dispatch({ type: 'auth/user_profile_loading' })
      const user = await api.getMyProfile()
      dispatch({ type: 'auth/user_profile_data', user })

      const lastActiveGroup = localStorage.getItem('lastActiveGroup')
      if (user?.groups) {
        if (
          !user?.groups[lastActiveGroup] &&
          Object.keys(user?.groups).length >= 1
        ) {
          dispatch({
            type: 'app/switch_active_group',
            activeGroup: Object.keys(user?.groups)[0],
          })
        }
      }
    }
  },
  switchActiveGroup: activeGroup => {
    return async (dispatch, getState) => {
      dispatch({
        type: 'app/switch_active_group',
        activeGroup,
      })
      //Reset all posts and offsets
      dispatch({ type: 'posts/reset' })
      const [posts, offset] = await api.listPosts({ activeGroup })
      dispatch({ type: 'posts/data', posts, offset })

      //Reset scroll pos
      window.scrollTo(0, 0) //reset scroll
      dispatch({
        type: 'nav/scroll',
        page: 'postList',
        pos: 0,
      })

      //@Todo dispatch toast to notify filter changed
    }
  },
  loadUserProfileAndInitialPost: () => {
    return async (dispatch, getState) => {
      const { activeGroup } = getState()
      dispatch({ type: 'auth/user_profile_loading' })
      const user = await api.getMyProfile()

      dispatch({ type: 'auth/user_profile_data', user })
      const groups = await api.getAvailableGroups()
      dispatch({ type: 'groups/data', groups: groups || [] })

      let ag = activeGroup
      if (user?.groups && !user?.groups[activeGroup]) {
        ag = Object.keys(user?.groups)[0]
      }

      dispatch({ type: 'app/switch_active_group', activeGroup: ag })

      dispatch({ type: 'posts/loading' })
      const [posts, offset] = await api.listPosts({ activeGroup: ag })
      dispatch({ type: 'posts/data', posts, offset })
    }
  },
  watchNotifications: () => {
    return async dispatch => {
      dispatch({ type: 'notifications/loading' })
      const listener = api.watchNotifications(notifications => {
        dispatch({ type: 'notifications/data', notifications })
      })
      dispatch({ type: 'app/update_listeners', listeners: [listener] })
    }
  },
  loadInitialPosts: (setLoading = true) => {
    return async (dispatch, getState) => {
      const { activeGroup } = getState()

      if (setLoading) {
        dispatch({ type: 'posts/loading' })
      }
      const [posts, offset] = await api.listPosts({ activeGroup })
      dispatch({ type: 'posts/data', posts, offset })
    }
  },
  loadMorePosts: () => {
    return async (dispatch, getState) => {
      const state = getState()
      dispatch({ type: 'posts/loading_more' })
      const [posts, offset] = await api.listPosts({
        offset: state.postsOffset,
        activeGroup: state.activeGroup,
      })
      dispatch({ type: 'posts/data_more', posts, offset })
    }
  },

  loadInitialUsers: (setLoading = true) => {
    return async (dispatch, getState) => {
      if (setLoading) {
        dispatch({ type: 'users/loading', reset: true })
      }

      await utils.sleep(3000) //Hack to wait until we have activeGroup

      const state = getState()

      if (!state.authUser || !state.activeGroup) return

      const [users, offset] = await api.listUsers({
        activeGroup: state.activeGroup,
      })
      dispatch({ type: 'users/data', users, offset, hasMore: true })
    }
  },
  loadMoreUsers: () => {
    return async (dispatch, getState) => {
      const state = getState()
      const filter = state.userSearchFilter
      dispatch({ type: 'users/loading_more' })
      //@Todo put userlimit in store
      let limit = 10
      if (filter.type === 'name') limit = 5 //for tighter name search
      const [users, offset] = await api.listUsers({
        limit,
        filter,
        offset: state.usersOffset,
        activeGroup: state.activeGroup,
      })
      dispatch({
        type: 'users/data_more',
        users,
        offset,
        hasMore: users.length >= limit,
      })
    }
  },
  updateSearchFilter: (filter = { type: null, value: null }) => {
    return async (dispatch, getState) => {
      const state = getState()
      dispatch({ type: 'users/loading' })
      dispatch({ type: 'users/update_search', filter })

      let limit = 10
      if (filter.type === 'name') limit = 5 //for tighter name search
      const [users, offset] = await api.listUsers({
        limit,
        filter: filter.type ? filter : null,
        activeGroup: state.activeGroup,
      })
      dispatch({
        type: 'users/data',
        users,
        offset,
        hasMore: users.length >= limit,
      })
    }
  },
}

export default actions
