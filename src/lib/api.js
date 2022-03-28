import firebase from './firebase'
import utils from 'lib/utils'
import Err from 'lib/err'
import shortId from 'short-uuid'
import axios from 'axios'
import qs from 'query-string'

const SHOULD_REAUTH = true //process.env.NODE_ENV !== 'development'

export const allowContent = (contentId, contentType = 'user') => {
  if (!contentId || !contentType) return true
  const blocked = localStorage.getItem(`blocks:${contentType}:${contentId}`)
  return !blocked
}

// const API_URL = `https://api.giv.link/api`
const API_URL = 'http://localhost:3000/api'
export const _apiClient = async (path, opts = {}) => {
  const token = await firebase.auth().currentUser?.getIdToken()
  const payload = { url: `${API_URL}${path}`, ...opts }
  if (!payload.headers) payload.headers = {}
  payload.headers.authorization = `Bearer ${token}`
  let data
  try {
    const resp = await axios(payload)
    data = resp.data
  } catch (err) {
    console.error(err)
    //ignore get errors
    if (opts.method && opts.method.toLowerCase() !== 'get') {
      throw err
    }
  }
  // console.log(`${path}`, data)
  return data
}

export const listAreas = () => _apiClient('/areas')
export const listPlaceCategories = () => _apiClient('/area-categories')
export const listSkillCategories = () => _apiClient('/skill-categories')
export const listSkills = () => _apiClient('/skills')

export const getMyProfile = () => _apiClient(`/users/profile`)

export const getUserProfile = uid => {
  if (!allowContent(uid, 'user')) {
    return null
  }
  const profile = await _apiClient(`/users/${uid}`)
  if (profile && !['Activated', 'active'].includes(profile.status)) {
    return null
  }
  return profile
}

export const getGivById = id => _apiClient(`/givs/${id}`)
export const getPostById = id => _apiClient(`/posts/${id}`)
export const getPostByGivId = givId => _apiClient(`/posts?givId=${givId}`)
export const getPostsForMe = userId => _apiClient(`/posts?giverId=${userId}`)
export const getGivRequests = () => _apiClient(`/requests`)
export const getInviteCode = code => _apiClient(`/invites/${code}`)

export const reportContent = async ({ description, category, contentPath }) => {
  return _apiClient(`/complaints`, {
    method: 'POST',
    data: { description, category, contentPath },
  })
}
export const deleteComment = id => {
  return _apiClient(`/comments/${id}`, { method: 'DELETE' })
}

const getCommentById = id => _apiClient(`/comments/${id}`)

const listComments = async postId => _apiClient(`/comments?postId=${postId}`)

export const saveDeviceToken = (token = null) => {
  if (!token || token === '') {
    throw new Error('Save device token failed: Token invalid')
  }
  return _apiClient(`/device-tokens/${token}`, { method: 'PUT' })
}

export const updateCurrentUserPhoto = async file => {
  if (!file) return null

  const user = await getCurrentUserProfile()
  if (!user) return null

  const oldPhotoURL = user.photoURL
  const newPhotoURL = `images/${user.id}/profile/${shortId.generate()}`

  const ref = firebase.storage().ref().child(newPhotoURL)

  //1. Upload the image
  await ref.put(file)

  //2. Update the user profile
  await _apiClient(`/users/${user.id}`, {
    method: 'PUT',
    data: { photoURL: newPhotoURL },
  })

  //3. Delete old profile photo if its a local url
  if (oldPhotoURL && !oldPhotoURL.startsWith('http')) {
    await firebase.storage().ref().child(oldPhotoURL).delete()
  }

  //@Todo sentry on err, slack on err
  //@Todo if any of these fail then we have a junk files in db
  //setup a function to clear those
  return newPhotoURL
}

export const updateCurrentUser = data => {
  if (!data) return null

  const user = getCurrentUser()
  if (!user) return null

  return _apiClient(`/users/${user.uid}`, { method: 'PUT', data })
}

const login = prov => {
  let provider = new firebase.auth.FacebookAuthProvider()
  if (prov && prov === 'apple') {
    provider = new firebase.auth.OAuthProvider('apple.com')
  } else {
    if (SHOULD_REAUTH) {
      provider.setCustomParameters({ auth_type: 'reauthenticate' })
    }
  }

  firebase.auth().signInWithRedirect(provider)
}

const onRedirectResult = () => {
  return firebase.auth().getRedirectResult()
}

const DEFAULT_QUERY_LIST_USERS = {
  activeGroup: null,
  offset: null,
  limit: 20,
}
const DEFAULT_QUERY_LIST_POSTS = {
  activeGroup: null,
  offset: null,
  limit: 20,
}

export const listUsers = async query => {
  const q = { ...DEFAULT_QUERY_LIST_USERS, ...query }

  const qq = {
    activeGroup: q.activeGroup,
    offset: q.offset,
  }
  if (q.filter && q.filter.value) {
    qq.filterType = q.filter.type
    qq.filterValue = q.filter.value
  }

  const result = await _apiClient(`/users?${qs.stringify(qq)}`)
  let users = result
  users = users.filter(u => allowContent(u.id, 'user'))

  let offset = null
  if (result.length) {
    offset = result[result.length - 1].id
  }

  return [users, offset]
}

export const listUsersWhoLikeYourSkills = async (user, activeGroup) => {
  if (!user) {
    user = await getCurrentUserProfile()
  }
  const filters = getRandomItemsInArray(user.skills)
  if (!filters.length) {
    return []
  }

  const qq = {
    activeGroup,
    filterType: 'interests',
    filterValue: filters.join(','),
    limit: 10,
  }
  let items = await _apiClient(`/users?${qs.stringify(qq)}`)
  items = items.filter(u => allowContent(u.id, 'user'))

  return items
}

export const listSimilarUsers = async (user, activeGroup) => {
  if (!user) {
    user = await getCurrentUserProfile()
  }
  const filters = getRandomItemsInArray(user.interests)
  if (!filters.length) {
    return []
  }

  const qq = {
    activeGroup,
    filterType: 'interests',
    filterValue: filters.join(','),
    limit: 10,
  }

  let items = await _apiClient(`/users?${qs.stringify(qq)}`)
  items = items.filter(u => allowContent(u.id, 'user'))

  return items
}

const getRandomItemsInArray = (array, maxItems = 10) => {
  array.slice().sort(() => {
    return 0.5 - Math.random()
  })
  let result = array
  if (array.length > maxItems) result = array.slice(0, maxItems)
  return result
}

export const listRecommendations = async (user, activeGroup) => {
  if (!user) {
    user = await getCurrentUserProfile()
  }

  const filters = getRandomItemsInArray(user.interests)

  const qq = {
    activeGroup,
    filterType: 'skills',
    filterValue: filters.join(','),
    limit: 10,
  }

  let items = await _apiClient(`/users?${qs.stringify(qq)}`)
  items = items.filter(u => allowContent(u.id, 'user'))

  return items
}

export const isActivatedUser = async uid => {
  const user = await _apiClient(`/users/${uid}`)
  if (!user) return false

  return ['active', 'Activated'].includes(user.status)
}

export const getCurrentUserProfile = async () => {
  const user = getCurrentUser()
  if (!user) {
    Err.warn(`No current user found`)
    return null
  }
  return getUserProfile(user.uid)
}

export const getUserReceivedPosts = uid => _apiClient(`/posts?giverId=${uid}`)

export const getUserPosts = async (uid, limit = 20, offset = null) => {
  if (!getCurrentUser()) {
    return []
  }

  const posts = await _apiClient(`/posts?authorId=${uid}`)
  return posts
}

export const getCurrentUser = () => firebase.auth().currentUser

export const updateNotification = ({ id, status = null }) => {
  if (!id || !status) {
    //@Todo log err
    console.log('Invalid payload:', id, status)
    return null
  }

  const VALID_STATUSES = ['read', 'unread']
  if (!VALID_STATUSES.includes(status)) {
    //@Todo log err invalid status
    console.log('Invalid status:', status)
    return null
  }

  return _apiClient(`/notifications/${id}`, { method: 'PUT', data: { status } })
}

export const mock = async payload => {
  const p = { ms: 2000, fail: false, ...payload }
  await utils.sleep(p.ms)
  console.log('Payload for mock:')
  console.log(payload)
  if (p.fail) throw Error('Err: error in mock api')
}
export const acceptGivRequest = id =>
  _apiClient(`/requests/${id}`, { method: 'PUT' })

export const watchGivRequests = cb => {
  const listener = setInterval(() => {
    _apiClient(`/requests`, { timeout: 4000 }).then(r => cb(r))
  }, 10000)

  return () => clearInterval(listener)
}

export const likePost = postId =>
  _apiClient(`/posts/${postId}/like`, { method: 'PUT' })
export const unlikePost = postId =>
  _apiClient(`/posts/${postId}/like`, { method: 'DELETE' })
export const checkLiked = async postId => {
  const resp = await _apiClient(`/posts/${postId}/like`)
  return resp.liked
}
export const postComment = ({ message, postId }) =>
  _apiClient(`/comments`, { method: 'POST', data: { message, postId } })
export const sendMessage = (groupId, message) =>
  _apiClient(`/chat-messages`, { method: 'POST', data: { message, groupId } })

const userCache = {}
const getCachedProfile = async id => {
  if (userCache[id]) return userCache[id]

  try {
    const item = await getUserProfile(id)
    userCache[id] = item
    return item
  } catch (err) {
    return null
  }
}

export const watchChatMessages = (groupId, cb) => {
  if (!groupId) {
    console.log('No group id in watchChatMessages')
    return null
  }

  const run = () => {
    _apiClient(`/chat-messages/${groupId}`, { timeout: 5000 }).then(async r => {
      let msgs = []
      for (const item of r) {
        item.sender = await getCachedProfile(item.senderId)
        item.groupId = groupId
        msgs.push(item)
      }
      cb(msgs)
    })
  }
  const listener = setInterval(run, 5000)

  run()

  return () => clearInterval(listener)
}
export const watchChatGroups = cb => {
  const run = () => {
    _apiClient(`/chat-groups`, { timeout: 4000 }).then(groups => cb(groups))
  }
  const listener = setInterval(run, 10000)

  run()

  return () => clearInterval(listener)
}

export const watchNotifications = cb => {
  const run = () => {
    _apiClient(`/notifications`, { timeout: 4000 }).then(async (r = []) => {
      const items = []
      for (const item of r) {
        if (item.type === 'givFinished') {
          const [giver, giv] = await Promise.all([
            getCachedProfile(item.giverId),
            getGivById(item.givId),
          ])
          item.giver = giver
          item.giv = giv
          if (!item.giver || !item.giv) {
            continue
          }
        }
        if (item.type === 'commentCreated') {
          item.comment = await getCommentById(item.commentId)
          if (!item.comment) continue
        }
        items.push(item)
      }
      cb(items)
    })
  }
  run()
  const listener = setInterval(run, 10000)
  return () => clearInterval(listener)
}

export const logout = () => firebase.auth().signOut()

export const createGivRequest = (senderId, receiverId, type) =>
  _apiClient(`/requests`, {
    method: 'POST',
    data: { senderId, receiverId, type },
  })

export const deleteImage = path => {
  return firebase.storage().ref().child(path).delete()
}
export const uploadImage = (img, path) => {
  return firebase.storage().ref().child(path).put(img)
}
export const deletePost = id => _apiClient(`/posts/${id}`, { method: 'DELETE' })

export const updatePostImages = async (postId, newImages, oldImages) => {
  //new images contains old image urls and new File objects
  //old images ONLY contain string urls
  //first we upload all newImage file objects and generate ids
  //then we delete any image that was in the old list but not it newList
  //then we update post in db with new image urls

  const user = getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const newImageUrls = []

  //Uploading files
  //we need to do this kind of loop to preserve ordering
  for (let f of newImages) {
    if (typeof f === 'string') {
      newImageUrls.push(f)
      continue
    }

    //else its a file so upload it
    const path = `images/${
      user.uid
    }/posts/${postId}/images/${shortId.generate()}`
    await api.uploadImage(f, path)

    newImageUrls.push(path)
  }

  for (let f of oldImages) {
    if (newImages.includes(f)) {
      continue
    }

    await api.deleteImage(f)
  }

  return updatePost({ id: postId, images: newImageUrls })
}

export const updatePost = ({ id, title, message, images }) =>
  _apiClient(`/posts/${id}`, {
    method: 'PUT',
    data: { title, message, images },
  })

export const createPost = async ({
  images = [],
  title = '',
  message = '',
  giv,
  activeGroup = 'all',
}) => {
  const payload = {
    givId: giv.id,
    title,
    message,
    images: [],
    group: activeGroup,
  }

  const post = await _apiClient(`/posts`, { method: 'POST', data: payload })

  const imagePaths = images.map(img => {
    const path = `images/${post.authorId}/posts/${
      post.id
    }/images/${shortId.generate()}`
    return path
  })

  const promises = imagePaths.map((path, index) => {
    const img = images[index]
    return uploadImage(img, path)
  })
  //@Todo if upload fails write to sentry
  //and also try uploading via functions
  await Promise.all(promises)

  await updatePost({ id: post.id, images: imagePaths })

  return post
}

//Simple block system, we just put it in localStorage
//This was only done to satify Google policies
export const blockUser = async userId => {
  if (firebase.auth().currentUser?.uid === userId) {
    return
  }
  localStorage.setItem(`blocks:user:${userId}`, true)
}

const listPosts = async (query = {}) => {
  const q = { ...DEFAULT_QUERY_LIST_POSTS, ...query }

  const qq = {
    groupId: q.activeGroup,
    offset: q.offset,
  }

  let posts = await _apiClient(`/posts?${qs.stringify(qq)}`)
  let offset = null
  if (posts.length) {
    offset = posts[posts.length - 1].id
  }

  posts = posts.filter(
    p => allowContent(p.authorId, 'user') && allowContent(p.giverId, 'user'),
  )

  return [posts, offset]
}

export const createUserProfile = data =>
  _apiClient(`/users`, { method: 'POST', data })

export const setupNotifications = async (token = null) => {
  if (token) {
    //ios and android
    await saveDeviceToken(token)
  } else {
    //web
    const messaging = firebase.messaging()
    try {
      await messaging.requestPermission()
      const token = await messaging.getToken()
      await saveDeviceToken(token)
    } catch (err) {
      console.log('Err setting notifications')
      console.log(err)
      throw err
    }
  }
}

const api = {
  listSkills,
  listSkillCategories,
  listPlaceCategories,
  listUsers,
  listAreas,
  listPosts,
  watchNotifications,
  watchChatGroups,
  watchChatMessages,
  sendMessage,
  watchGivRequests,
  acceptGivRequest,
  updateNotification,
  getUserProfile,
  getCurrentUserProfile,
  getUserPosts,
  getUserReceivedPosts,
  getCurrentUser,
  listRecommendations,
  listSimilarUsers,
  listUsersWhoLikeYourSkills,

  updateCurrentUser,
  updateCurrentUserPhoto,

  uploadImage,
  deleteImage,

  createGivRequest,
  createPost,
  updatePost,
  updatePostImages,
  deletePost,

  getPostByGivId,
  getPostById,
  getGivById,
  getPostsForMe,
  getGivRequests,
  getInviteCode,
  createUserProfile,
  isActivatedUser,

  setupNotifications,
  checkLiked,
  likePost,
  unlikePost,
  postComment,
  getCommentById,
  deleteComment,
  mock,

  login,
  logout,
  onRedirectResult,
  listComments,
  reportContent,
  blockUser,
  allowContent,
  _apiClient,
  getMyProfile,
}
export default api
