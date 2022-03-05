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

const API_URL = `https://api.giv.link/api`
const _apiClient = async (path, opts = {}) => {
  const token = await firebase.auth().currentUser?.getIdToken()
  const payload = { url: `${API_URL}${path}`, ...opts }
  if (!payload.headers) payload.headers = {}
  payload.headers.authorization = `Bearer ${token}`
  const { data } = await axios(payload)
  // console.log(`${path}`, data)
  return data
}

export const listAreas = () => _apiClient('/areas')
export const listPlaceCategories = () => _apiClient('/area-categories')
export const listSkillCategories = () => _apiClient('/skill-categories')
export const listSkills = () => _apiClient('/skills')

export const getUserProfile = uid => {
  if (!allowContent(uid, 'user')) {
    return null
  }
  return _apiClient(`/users/${uid}`)
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

  const offsetItem = result[result.length - 1]

  return [users, offsetItem.id]
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

  return user.status === 'Activated'
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
export const acceptGivRequest = async givRequestId => {
  return firebase.functions().httpsCallable('acceptGivRequest')({
    givRequestId,
  })
}
export const watchGivRequests = (userId, cb1, cb2) => {
  if (!userId) {
    console.log('No user id in request')
    return null
  }

  let snapReceive = firebase
    .firestore()
    .collection(`/givRequests`)
    .where('type', '==', 'receive')
    .where('senderId', '==', userId)
    .orderBy('createdAt', 'desc')
  let snapSend = firebase
    .firestore()
    .collection(`/givRequests`)
    .where('type', '==', 'send')
    .where('receiverId', '==', userId)
    .orderBy('createdAt', 'desc')

  const listeners = [
    snapReceive.onSnapshot(async qs => {
      const requests = []
      for (let doc of qs.docs) {
        const req = { ...doc.data(), id: doc.id }

        try {
          req.receiver = await getUserProfile(req.receiverId)
          if (!req.receiver)
            throw new Error('Receiver not found: ' + req.receiverId)

          requests.push(req)
        } catch (err) {
          console.log('err while parsing requests:', err.message)
          //@Todo notify err
        }
      }

      cb1(requests)
    }),
    snapSend.onSnapshot(async qs => {
      const requests = []
      for (let doc of qs.docs) {
        const req = { ...doc.data(), id: doc.id }

        try {
          req.sender = await getUserProfile(req.senderId)
          if (!req.sender) throw new Error('sender not found: ' + req.senderId)
          requests.push(req)
        } catch (err) {
          console.log('err while parsing requests:', err.message)
          //@Todo notify err
        }
      }

      cb2(requests)
    }),
  ]

  return listeners
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

const SHOW_ALL = false && process.env.NODE_ENV === 'development'

export const watchChatMessages = (groupId, cb) => {
  if (!groupId) {
    console.log('No group id in watchChatMessages')
    return null
  }
  //@Todo optimize limit getting only latest messages
  //@Todo err handling
  const ref = firebase.database().ref(`chat_messages/${groupId}`)

  ref.on('child_added', async s => {
    if (s) {
      const result = { id: s.key, ...s.val() }
      try {
        result.sender = await getUserProfile(result.senderId)
      } catch (err) {
        //@Todo sentry
        result.sender = null
      }
      cb(result)
    }
  })

  return () => ref.off('child_added')
}
export const watchChatGroups = async (userId, cb) => {
  if (!userId) {
    console.log('No user id in listNotifications')
    return []
  }
  const ref = firebase.database().ref(`user_chat_groups/${userId}`)
  ref.on('value', s => {
    let groups = {}
    if (s.exists()) {
      Object.entries(s.val()).forEach(([key, doc]) => {
        groups[key] = { ...doc, id: key }
      })
    }
    cb(groups)
  })

  return () => ref.off('value')
}

export const watchNotifications = (userId, cb, debug = false) => {
  if (!userId) {
    console.log('No user id in listNotifications')
    return 0
  }

  let snap = firebase.firestore().collection(`/users/${userId}/notifications`)

  if (!SHOW_ALL) snap = snap.where('status', '==', 'unread')

  return snap.orderBy('createdAt', 'desc').onSnapshot(async qs => {
    const nots = []
    for (let doc of qs.docs) {
      const not = { ...doc.data(), id: doc.id }

      try {
        if (not.type === 'messageReceived') {
          //Ignore these as chat handles them
          //Note: Make sure these nots are marked as read by default (in backend)
          //otherwise we will have 100s of unread messageReceived nots
          continue
        }

        // @Todo If we discover an unread notification
        // which doesn't have correct data delete it

        //@Todo ideally we should delete the notification as well when
        //deleting the comment or post
        if (not.type === 'commentCreated' && not.commentId && not.postId) {
          //Check if post or comment is 404 and ignore this
          not.post = await getPostById(not.postId)
          not.comment = await getCommentById(not.commentId)
          if (!not.post || !not.comment)
            throw new Error('post or comment not found: ' + not.commentId)
        }

        //@Todo ideally we should delete the notification as well when
        //deleting the giv finished value
        if (not.type === 'givFinished' && not.giverId) {
          not.giv = await getGivById(not.givId)
          if (!not.giv) throw new Error('giv not found: ' + not.givId)

          const posts = await getPostByGivId(not.givId)
          if (posts && posts.length) {
            throw new Error('already have a post for this giv:', not.givId)
          }

          not.giver = await getUserProfile(not.giverId)
          if (!not.giver) throw new Error('giver not found: ' + not.giverId)
        }
        if (not.type === 'givRequest' && not.requestType === 'send') {
          not.sender = await getUserProfile(not.senderId)
          if (!not.sender) throw new Error('sender not found: ' + not.senderId)
        }
        if (not.type === 'givRequest' && not.requestType === 'receive') {
          not.receiver = await getUserProfile(not.receiverId)
          if (!not.receiver)
            throw new Error('Receiver not found: ' + not.receiverId)
        }

        //Only show notification if its clear of any error
        nots.push(not)
      } catch (err) {
        //@Todo notify err
        console.warn('Ignoring erred notification:', err.message)
      }
    }

    cb(nots)
  })
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
  const offset = posts[posts.length - 1].id

  posts = posts.filter(
    p => allowContent(p.authorId, 'user') && allowContent(p.giverId, 'user'),
  )

  return [posts, offset]
}

//@Todo add cache to getUserProfile etc
export const createUserProfile = async ({
  uid,
  code,
  area,
  skills = [],
  interests = [],
  job = '',
  intro = '',
  name = '',
}) => {
  const payload = {
    uid,
    code,
    skills,
    area,
    interests,
    job,
    intro,
    name,
  }

  //@Todo validate payload
  const resp = await firebase.functions().httpsCallable('createUserProfile')(
    payload,
  )
  console.log(resp)
  //@Todo handle errors like
  //	profile already exists,
  //	code already used,
  //	code not found,
  //	skills or interests are empty etc
  return 'OK'
}

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
}
export default api
