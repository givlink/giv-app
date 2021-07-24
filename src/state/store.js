import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const initialState = {
  authLoading: true,
  authUser: null,

  postsLoading: true,
  postsOffset: null,
  postsLoadingMore: false,
  postsHasMore: true,
  posts: [],
  postById: {},

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
}

const getUpdatedUserMap = (users, state) => {
  const map = { ...state.userById }
  users.forEach((p) => (map[p.id] = p))
  return map
}
const getUpdatedPostMap = (posts, state) => {
  const map = { ...state.postById }
  posts.forEach((p) => (map[p.id] = p))
  return map
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'auth/init':
      return { ...state, authLoading: true, authUser: null }
    case 'auth/loading':
      return { ...state, authLoading: true }
    case 'auth/data':
      return { ...state, authUser: action.user, authLoading: false }

    case 'posts/loading':
      return { ...state, postsLoading: true }
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
    case 'posts/data_more':
      return {
        ...state,
        //@Todo dedupe and fix ordering
        posts: [...state.posts, ...action.posts],
        postsOffset: action.offset,
        postsLoadingMore: false,
        postById: getUpdatedPostMap(action.posts, state),
      }

    //Users
    case 'users/loading':
      return { ...state, usersLoading: true }
    case 'users/loading_more':
      return { ...state, usersLoadingMore: true }
    case 'users/data':
      return {
        ...state,
        users: action.users,
        usersOffset: action.offset,
        usersLoading: false,
        userById: getUpdatedUserMap(action.users, state),
      }
    case 'users/data_more':
      return {
        ...state,
        //@Todo dedupe and fix ordering
        users: [...state.users, ...action.users],
        usersOffset: action.offset,
        usersLoadingMore: false,
        userById: getUpdatedUserMap(action.users, state),
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
    default:
      return state
  }
}

const store = createStore(reducer, initialState, applyMiddleware(thunk))
export default store
