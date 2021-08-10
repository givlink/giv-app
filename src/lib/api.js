import firebase from './firebase'
import utils from 'lib/utils'
import shortId from 'short-uuid'

const SHOULD_REAUTH = true //process.env.NODE_ENV !== 'development'

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

const cache = {
  users: {},
  comments: {},
}

//@Todo better caching library

const DEFAULT_QUERY_LIST_USERS = {
  offset: null,
  limit: 20,
}
const DEFAULT_QUERY_LIST_POSTS = {
  area: null,
  offset: null,
  limit: 20,
}
const DEFAULT_QUERY_LIST_COMMENTS = {
  offset: null,
  limit: 50,
}

export const listUsers = async query => {
  // offset = null, limit = 20, filter = null
  const q = { ...DEFAULT_QUERY_LIST_USERS, ...query }

  let snap = firebase.firestore().collection('users')

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

  return [users, snap.docs[snap.docs.length - 1]]
}

export const listUsersWhoLikeYourSkills = async user => {
  if (!user) {
    user = await getCurrentUserProfile()
  }
  const items = []
  const filters = getRandomItemsInArray(user.skills)
  const snap = await firebase
    .firestore()
    .collection('users')
    .where('interests', 'array-contains-any', filters)
    .limit(10)
    .get()
  snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }))
  return items
}
export const listSimilarUsers = async user => {
  if (!user) {
    user = await getCurrentUserProfile()
  }
  const items = []
  const filters = getRandomItemsInArray(user.interests)
  const snap = await firebase
    .firestore()
    .collection('users')
    .where('interests', 'array-contains-any', filters)
    .limit(10)
    .get()
  snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }))
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

export const listRecommendations = async user => {
  if (!user) {
    user = await getCurrentUserProfile()
  }

  const items = []
  const filters = getRandomItemsInArray(user.interests)
  const snap = await firebase
    .firestore()
    .collection('users')
    .where('skills', 'array-contains-any', filters)
    .limit(10)
    .get()
  snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }))
  return items
}
export const listPlaceCategories = async () => {
  const result = []
  const snap = await firebase
    .firestore()
    .collection('place-categories')
    .orderBy('order', 'asc')
    .get()
  snap.forEach(doc => result.push({ id: doc.id, ...doc.data() }))
  return result
}
export const listSkillCategories = async () => {
  const result = []
  const snap = await firebase
    .firestore()
    .collection('skill-categories')
    .orderBy('order', 'asc')
    .get()
  snap.forEach(doc => result.push({ id: doc.id, ...doc.data() }))
  return result
}
export const listSkills = async () => {
  const skills = {}
  const snap = await firebase
    .firestore()
    .collection('skills')
    .orderBy('order', 'asc')
    .get()
  snap.forEach(doc => (skills[doc.id] = { id: doc.id, ...doc.data() }))
  return skills
}

export const getGiv = async givId => {
  const doc = await firebase.firestore().doc(`/givs/${givId}`).get()
  const giv = { ...doc.data(), id: givId }
  giv.giver = await getUserProfile(giv.giverId)
  giv.receiver = await getUserProfile(giv.receiverId)
  giv.post = await getPostByGivId(giv.id)
  return giv
}
//@Todo add caching
export const getUserProfile = async (uid, preferCache = true) => {
  if (preferCache) {
    const fromCache = cache.users[uid]
    if (fromCache) {
      return fromCache
    }
  }

  const doc = await firebase.firestore().doc(`/users/${uid}`).get()
  if (!doc.exists) {
    return null
  }
  const result = { ...doc.data(), id: uid }

  //Update cache
  cache.users[uid] = result

  return result
}
export const getCurrentUserProfile = async () => {
  const user = getCurrentUser()
  if (!user) return null
  return getUserProfile(user.uid)
}
export const getUserReceivedPosts = async (uid, limit = 20, offset = null) => {
  if (!getCurrentUser()) {
    return []
  }

  let postSnap = await firebase
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

  let postSnap = await firebase
    .firestore()
    .collection('posts')
    .where('authorId', '==', uid)

  if (offset) postSnap = postSnap.startAfter(offset)
  postSnap = await postSnap.limit(limit).get()
  const posts = []
  postSnap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }))
  return posts
}

export const getCurrentUser = () => {
  return firebase.auth().currentUser
}

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

const SHOW_ALL = true && process.env.NODE_ENV === 'development'
export const sendMessage = async (groupId, msg) => {
  if (!groupId || !msg || msg === '') {
    console.log('Invalid groupId or msg')
    return
  }
  return firebase.database().ref(`chat_messages/${groupId}`).push({
    senderId: getCurrentUser().uid,
    content: msg,
    timestamp: new Date().toISOString(), //@Todo validate this server side
  })
}
export const watchChatMessages = (groupId, cb) => {
  if (!groupId) {
    console.log('No group id in watchChatMessages')
    return null
  }
  //@Todo optimize limit getting only latest messages
  //@Todo err handling
  return firebase
    .database()
    .ref(`chat_messages/${groupId}`)
    .on('value', s => {
      const result = []
      if (s && s.exists()) {
        Object.entries(s.val()).forEach(([id, v]) => {
          result.push({ id, ...v })
        })
      }
      cb(result)
    })
}
export const watchChatGroups = (userId, cb) => {
  if (!userId) {
    console.log('No user id in listNotifications')
    return 0
  }

  //first watch /users/:id/chat_groups
  return firebase
    .firestore()
    .collection(`/chat_groups`)
    .where('members', 'array-contains', userId)
    .onSnapshot(async qs => {
      //then for Each get the data from realtime db
      const groups = []
      qs.forEach(doc => {
        groups.push({ id: doc.id, ...doc.data() })
      })
      cb(groups)
    })
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
  //@Todo error handling

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

export const deleteComment = async (id = null) => {
  if (!id) {
    console.log('No id in delete comment')
    return
  }
  await firebase.firestore().doc(`/comments/${id}`).delete()
}

const getCommentById = async id => {
  const fromCache = cache.comments[id]
  if (fromCache) {
    return fromCache
  }
  const doc = await firebase.firestore().doc(`comments/${id}`).get()
  if (doc.exists) {
    const comment = { ...doc.data(), id: doc.id }
    console.log('comment id:', comment)
    // const user = await getUserProfile(comment.author.id);
    // post.author = user;

    //Update cache
    cache.comments[id] = comment
    return comment
  } else {
    return null
  }
}

const listComments = async (postId, query = {}) => {
  const q = { ...DEFAULT_QUERY_LIST_COMMENTS, ...query }

  let snap = firebase
    .firestore()
    .collection('comments')
    .where('postId', '==', postId)
    .orderBy('createdAt', 'asc')

  if (q.offset) {
    snap = snap.startAfter(q.offset)
  }

  snap = await snap.limit(q.limit).get()

  const comments = []
  snap.forEach(doc => comments.push({ ...doc.data(), id: doc.id }))
  const offset = snap.docs[snap.docs.length - 1]
  return [comments, offset]
}

const listPosts = async (query = {}) => {
  const q = { ...DEFAULT_QUERY_LIST_POSTS, ...query }

  let snap = firebase.firestore().collection('posts')

  if (q.area && q.area !== 'all') {
    snap = snap.where('area', '==', q.area)
  }

  snap = snap.orderBy('createdAt', 'desc')

  if (q.offset) {
    snap = snap.startAfter(q.offset)
  }

  snap = await snap.limit(q.limit).get()

  const posts = []
  snap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }))
  const offset = snap.docs[snap.docs.length - 1]
  return [posts, offset]
}

const listAreas = async () => {
  const areas = {}
  const snap = await firebase
    .firestore()
    .collection('areas')
    .orderBy('order', 'asc')
    .get()
  snap.forEach(doc => (areas[doc.id] = { id: doc.id, ...doc.data() }))
  return areas
}
const listUserGivs = async (userId, type = 'receive') => {
  let queryKey = 'receiverId'
  if (type === 'send') {
    queryKey = 'senderId'
  }

  const snap = await firebase
    .firestore()
    .collection('givs')
    .where(queryKey, '==', userId)
    .where('status', '==', 'Finished')
    .get()
  const givs = []
  snap.forEach(doc => {
    givs.push({ ...doc.data(), id: doc.id })
  })
  return givs
}
const getNewGivs = async receiverId => {
  const snap = await firebase
    .firestore()
    .collection('givs')
    .where('receiverId', '==', receiverId)
    .where('status', '==', 'Pending')
    .get()
  const givs = []
  snap.forEach(doc => {
    givs.push({ ...doc.data(), id: doc.id })
  })
  return givs
}

const getFinishedGivs = async receiverId => {
  const snap = await firebase
    .firestore()
    .collection('givs')
    .where('receiverId', '==', receiverId)
    .where('status', '==', 'Finished')
    .get()
  const givs = []
  snap.forEach(async doc => {
    const giv = { ...doc.data(), id: doc.id }
    giv.giver = await getUserProfile(giv.giverId)
    givs.push(giv)
  })
  return givs
}
//@Todo add caching
const getGivById = async id => {
  const doc = await firebase.firestore().doc(`givs/${id}`).get()
  if (doc.exists) {
    const result = { ...doc.data(), id: doc.id }
    return result
  } else {
    return null
  }
}

const getPostById = async id => {
  const doc = await firebase.firestore().doc(`posts/${id}`).get()
  if (doc.exists) {
    const post = { ...doc.data(), id: doc.id }
    //@Todo hack because we don't update each post author photoURL
    //if user change their photo then it wont show up
    //for now just fetching the latest. Fix this by updating all post photo url
    //when user updates their profile
    const user = await getUserProfile(post.author.id)
    post.author = user
    return post
  } else {
    return null
  }
}

const getPostByGivId = async givId => {
  const snap = await firebase
    .firestore()
    .collection('posts')
    .where('givId', '==', givId)
    .get()
  if (!snap.empty) {
    const doc = snap.docs[0] //@Todo assert only one
    return { ...doc.data(), id: doc.id }
  } else {
    return null
  }
}

const getPostsForMe = async userId => {
  const snap = await firebase
    .firestore()
    .collection('posts')
    .where('giver.id', '==', userId)
    .get()

  const posts = []
  snap.forEach(doc => {
    posts.push({ ...doc.data(), id: doc.id })
  })
  return posts
}

const getGivRequests = async userId => {
  const snap1 = await firebase
    .firestore()
    .collection('givRequests')
    .where('giverId', '==', userId)
    .where('type', '==', 'receive')
    .get()
  const snap2 = await firebase
    .firestore()
    .collection('givRequests')
    .where('receiverId', '==', userId)
    .where('type', '==', 'send')
    .get()

  const requests = []
  snap1.forEach(async doc => {
    const payload = { ...doc.data(), id: doc.id }
    const receiver = await getUserProfile(payload.receiverId)
    payload.receiver = receiver
    requests.push(payload)
  })
  //@Todo need to tighten the rules for givRequest, current open for all
  snap2.forEach(async doc => {
    const payload = { ...doc.data(), id: doc.id }
    const sender = await getUserProfile(payload.senderId)
    payload.sender = sender
    requests.push(payload)
  })
  return requests
}
export const getInviteCode = async code => {
  const resp = await firebase.firestore().doc(`/invites/${code}`).get()
  if (resp.exists) return { ...resp.data() }
  return null
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
export const saveDeviceToken = (token = null) => {
  const user = getCurrentUser()
  if (!user) {
    throw new Error('Save device token failed: Unauthorized')
  }
  if (!token || token === '') {
    throw new Error('Save device token failed: Token invalid')
  }
  return firebase
    .firestore()
    .doc(`/users/${user.uid}/deviceTokens/${token}`)
    .set({ lastUpdatedAt: new Date().toISOString() })
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
    }
  }
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
  await firebase
    .firestore()
    .doc(`/users/${user.id}`)
    .update({ photoURL: newPhotoURL })

  //3. Delete old profile photo if its a local url
  if (oldPhotoURL && !oldPhotoURL.startsWith('http')) {
    await firebase.storage().ref().child(oldPhotoURL).delete()
  }

  //@Todo sentry on err, slack on err
  //@Todo if any of these fail then we have a junk files in db
  //setup a function to clear those
  return newPhotoURL
}

export const updateCurrentUser = async data => {
  if (!data) return null

  const user = getCurrentUser()
  if (!user) return null

  let payload = {}
  if (data.interests && data.interests.length > 0) {
    payload.interests = data.interests
  }
  if (data.intro) {
    payload.intro = data.intro
  }
  if (data.name && data.name !== '') {
    payload.name = data.name
  }
  if (data.job) {
    payload.job = data.job
  }

  await firebase
    .firestore()
    .doc(`/users/${user.uid}`)
    .set(payload, { merge: true })

  //Reset cache
  delete cache.users[user.uid]
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

  getGiv,

  createGivRequest,
  createPost,
  updatePost,
  updatePostImages,
  deletePost,

  getFinishedGivs,
  getPostByGivId,
  getPostById,
  getGivById,
  getPostsForMe,
  getNewGivs,
  getGivRequests,
  getInviteCode,
  createUserProfile,
  listUserGivs,

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
}
export default api
