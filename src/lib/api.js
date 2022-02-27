import firebase from './firebase'
import utils from 'lib/utils'
import Err from 'lib/err'
import shortId from 'short-uuid'
import axios from 'axios'

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
  // offset = null, limit = 20, filter = null
  const q = { ...DEFAULT_QUERY_LIST_USERS, ...query }

  let snap = firebase.firestore().collection('users')
  snap = snap.where(`groups.${q.activeGroup}`, '==', true)

  if (q.filter && q.filter.value) {
    if (q.filter.type === 'skills') {
      snap = snap.where('skills', 'array-contains', q.filter.value)
    }
    if (q.filter.type === 'area') {
      snap = snap.where('area', '==', q.filter.value)
    }
    if (q.filter.type === 'name') {
      snap = snap.where('name', '>', q.filter.value)
    }
  } else {
    snap = snap.orderBy('createdAt', 'desc')
  }

  if (q.offset) snap = snap.startAfter(q.offset)
  snap = await snap.limit(q.limit).get() //@Todo sec rules

  let users = []
  snap.forEach(doc => users.push({ ...doc.data(), id: doc.id }))

  //@Hack : User search hack to show exact matches only
  if (q.filter && q.filter.type === 'name') {
    users = users.filter(u => u.name && u.name.startsWith(q.filter.value))
  }

  users = users.filter(u => allowContent(u.id, 'user'))

  return [users, snap.docs[snap.docs.length - 1]]
}

export const listUsersWhoLikeYourSkills = async (user, activeGroup) => {
  if (!user) {
    user = await getCurrentUserProfile()
  }
  let items = []
  const filters = getRandomItemsInArray(user.skills)
  if (!filters.length) {
    return items
  }
  let snap = firebase
    .firestore()
    .collection('users')
    .where('interests', 'array-contains-any', filters)

  if (activeGroup) {
    snap = snap.where(`groups.${activeGroup}`, '==', true)
  }
  snap = await snap.limit(10).get()
  snap.forEach(doc => {
    if (doc.id === user.id) return //ignore yourself
    items.push({ id: doc.id, ...doc.data() })
  })

  items = items.filter(u => allowContent(u.id, 'user'))

  return items
}
export const listSimilarUsers = async (user, activeGroup) => {
  if (!user) {
    user = await getCurrentUserProfile()
  }
  let items = []
  const filters = getRandomItemsInArray(user.interests)
  if (!filters.length) {
    return items
  }
  let snap = firebase
    .firestore()
    .collection('users')
    .where('interests', 'array-contains-any', filters)

  if (activeGroup) {
    snap = snap.where(`groups.${activeGroup}`, '==', true)
  }
  snap = await snap.limit(10).get()
  snap.forEach(doc => {
    if (doc.id === user.id) return //ignore yourself
    items.push({ id: doc.id, ...doc.data() })
  })
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

  let items = []
  const filters = getRandomItemsInArray(user.interests)
  let snap = firebase
    .firestore()
    .collection('users')
    .where('skills', 'array-contains-any', filters)
  if (activeGroup) {
    snap = snap.where(`groups.${activeGroup}`, '==', true)
  }
  snap = await snap.limit(10).get()
  snap.forEach(doc => {
    if (doc.id === user.id) return //ignore yourself
    items.push({ id: doc.id, ...doc.data() })
  })
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
export const getUserReceivedPosts = async (uid, limit = 20, offset = null) => {
  if (!getCurrentUser()) {
    return []
  }

  let postSnap = firebase
    .firestore()
    .collection('posts')
    .where('giver.id', '==', uid)

  if (offset) postSnap = postSnap.startAfter(offset)
  postSnap = await postSnap.limit(limit).get()
  const posts = []
  postSnap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }))
  return posts
}

export const getUserPosts = async (uid, limit = 20, offset = null) => {
  if (!getCurrentUser()) {
    return []
  }

  let postSnap = firebase
    .firestore()
    .collection('posts')
    .where('authorId', '==', uid)

  if (offset) postSnap = postSnap.startAfter(offset)
  postSnap = await postSnap.limit(limit).get()
  const posts = []
  postSnap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }))
  return posts
}

export const getCurrentUser = () => firebase.auth().currentUser

export const updateNotification = ({ userId, id, status = null }) => {
  if (!userId || !id || !status) {
    //@Todo log err
    console.log('Invalid payload:', userId, id, status)
    return null
  }

  const VALID_STATUSES = ['read', 'unread']
  if (!VALID_STATUSES.includes(status)) {
    //@Todo log err invalid status
    console.log('Invalid status:', status)
    return null
  }

  const payload = { status }

  return firebase
    .firestore()
    .doc(`/users/${userId}/notifications/${id}`)
    .update(payload)
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
export const likePost = async (postId, userId) => {
  if (!postId) {
    console.log('No postId in like')
    return
  }
  if (!userId) {
    console.log('No userId in like')
    return
  }
  //@Todo need a function to aggregate likes on a post
  //When this happens
  await firebase
    .firestore()
    .doc(`/users/${userId}/likes/${postId}`)
    .set({ liked: true })
}
export const unlikePost = async (postId, userId) => {
  if (!postId) {
    console.log('No postId in unlike')
    return
  }
  if (!userId) {
    console.log('No userId in unlike')
    return
  }
  //@Todo need a function to aggregate likes on a post
  //When this happens
  await firebase.firestore().doc(`/users/${userId}/likes/${postId}`).delete()
}
export const postComment = async ({
  message = '',
  author = null,
  postId = null,
}) => {
  if (!author) {
    console.log('No author')
    return null
  }
  if (!postId) {
    console.log('No postid')
    return null
  }
  const payload = {
    author: {
      id: author.id,
      name: author.name,
      photoURL: author.photoURL,
    },
    authorId: author.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    message,
    parentCommentId: null,
    postId,
  }
  const response = await firebase
    .firestore()
    .collection(`/comments`)
    .add(payload)
  payload.id = response.id
  return payload
}

export const checkLiked = async (postId, userId) => {
  if (!postId) {
    console.log('No postId in checklike')
    return false
  }
  if (!userId) {
    console.log('No userId in checklike')
    return false
  }
  const resp = await firebase
    .firestore()
    .doc(`/users/${userId}/likes/${postId}`)
    .get()
  return resp.exists
}

const SHOW_ALL = false && process.env.NODE_ENV === 'development'
export const sendMessage = async (groupId, msg) => {
  if (!groupId || !msg || msg === '') {
    console.log('Invalid groupId or msg')
    return
  }
  const currUser = await getUserProfile(getCurrentUser().uid)
  const result = await firebase
    .database()
    .ref(`chat_messages/${groupId}`)
    .push({
      senderId: currUser.id,
      senderName: currUser.name,
      content: msg,
      timestamp: new Date().toISOString(), //@Todo validate this server side
    })
  //@Todo err handling
  return result.key
}
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

          const post = await getPostByGivId(not.givId)
          if (post) {
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

export const getUnreadNotificationCount = async userId => {
  if (!userId) {
    console.log('No user id in listNotifications')
    return 0
  }

  const snap = await firebase
    .firestore()
    .collection(`/users/${userId}/notifications`)
    .where('status', '==', 'unread')
    .get()

  return snap.docs.length
}

export const listNotifications = async (userId, limit = 50, offset = 0) => {
  if (!userId) {
    console.log('No user id in listNotifications')
    return null
  }

  const snap = await firebase
    .firestore()
    .collection(`/users/${userId}/notifications`)
    .where('status', '==', 'unread')
    .limit(limit)
    .get()
  const notifications = []
  for (let doc of snap.docs) {
    const not = { ...doc.data(), id: doc.id }
    try {
      if (not.type === 'givFinished' && not.giverId) {
        not.giver = await getUserProfile(not.giverId)
      }
      if (not.type === 'givRequest' && not.requestType === 'send') {
        not.sender = await getUserProfile(not.senderId)
      }
      if (not.type === 'givRequest' && not.requestType === 'receive') {
        not.receiver = await getUserProfile(not.receiverId)
      }
    } catch (err) {
      //@Todo notify err
      console.log(err)
    }
    notifications.push(not)
  }

  return notifications
}

export const logout = () => {
  return firebase.auth().signOut()
}

export const createGivRequest = async (senderId, receiverId, type) => {
  const payload = {
    senderId,
    receiverId,
    type,
    createdAt: new Date().toISOString(),
  }

  //@Todo sec rule to prevent duplicate requests
  //@Todo sec rule to prevent read access for other than these two users

  return firebase.firestore().collection(`/givRequests`).add(payload)
}

export const deleteImage = path => {
  console.log('deleting image:', path)
  return firebase.storage().ref().child(path).delete()
}
export const uploadImage = (img, path) => {
  console.log('uploading', img, path)
  return firebase.storage().ref().child(path).put(img)
}
export const deletePost = id => {
  //@Todo error handling

  if (!id) return

  return firebase.firestore().doc(`/posts/${id}`).delete()
}

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

export const updatePost = ({
  id,
  title = null,
  message = null,
  images = null,
}) => {
  const payload = {
    updatedAt: new Date().toISOString(),
  }
  if (title && title !== '') payload.title = title
  if (message && message !== '') payload.message = message
  if (images && images !== '') payload.images = images

  return firebase.firestore().doc(`/posts/${id}`).update(payload)
}

export const createPost = async ({
  authorId,
  images = [],
  title = '',
  message = '',
  giv,
  giver,
  activeGroup = 'all',
}) => {
  //@Todo error handling
  const author = await getUserProfile(authorId)

  const payload = {
    author: {
      id: author.id,
      name: author.name,
      photoURL: author.photoURL,
    },
    authorId,
    givId: giv.id,
    giver: {
      id: giver.id,
      name: giver.name,
      photoURL: giver.photoURL,
    },
    title,
    message,
    images: [],
    createdAt: new Date().toISOString(),
    group: activeGroup,
  }
  if (giver && giver.area) {
    payload.area = giver.area
  }

  const doc = await firebase.firestore().collection('posts').add(payload)
  const post = { ...payload, id: doc.id }

  const imagePaths = images.map(img => {
    const path = `images/${authorId}/posts/${
      post.id
    }/images/${shortId.generate()}`
    return path
  })

  //@Todo sec rule to prevent duplicate posts for same giv
  //@Todo sec rule to validate input data

  const promises = imagePaths.map((path, index) => {
    const img = images[index]
    return uploadImage(img, path)
  })
  //@Todo if upload fails write to sentry
  //and also try uploading via functions
  await Promise.all(promises)
  await firebase
    .firestore()
    .doc(`/posts/${post.id}`)
    .set({ images: imagePaths }, { merge: true })

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

  let snap = firebase.firestore().collection('posts')

  snap = snap.where('group', '==', q.activeGroup)
  snap = snap.orderBy('createdAt', 'desc')

  if (q.offset) {
    snap = snap.startAfter(q.offset)
  }

  snap = await snap.limit(q.limit).get()

  let posts = []
  snap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }))
  const offset = snap.docs[snap.docs.length - 1]

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
  listNotifications,
  getUnreadNotificationCount,
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
