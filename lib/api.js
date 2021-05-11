import firebase from "./firebase";
import shortId from "short-uuid";

export const listUsers = async (offset = null, limit = 20, filter = null) => {
  let snap = firebase.firestore().collection("users");

  if (filter && filter.value) {
    if (filter.type == "skills") {
      snap = snap.where("skills", "array-contains", filter.value);
    }
    if (filter.type == "area") {
      snap = snap.where("area", "==", filter.value);
    }
    if (filter.type == "name") {
      snap = snap.where("name", ">", filter.value);
    }
  } else {
    snap = snap.orderBy("createdAt", "desc");
  }

  if (offset) snap = snap.startAfter(offset);
  snap = await snap.limit(limit).get(); //@Todo sec rules

  let users = [];
  snap.forEach(doc => users.push({ ...doc.data(), id: doc.id }));

  //@Hack : User search hack to show exact matches only
  if (filter && filter.type === "name") {
    users = users.filter(u => u.name && u.name.startsWith(filter.value));
  }

  return [users, snap.docs[snap.docs.length - 1]];
};

export const listSkills = async () => {
  const skills = {};
  const snap = await firebase
    .firestore()
    .collection("skills")
    .get();
  snap.forEach(doc => (skills[doc.id] = { id: doc.id, ...doc.data() }));
  return skills;
};

export const getGiv = async givId => {
  const doc = await firebase
    .firestore()
    .doc(`/givs/${givId}`)
    .get();
  const giv = { ...doc.data(), id: givId };
  giv.giver = await getUserProfile(giv.giverId);
  giv.receiver = await getUserProfile(giv.receiverId);
  giv.post = await getPostByGivId(giv.id);
  return giv;
};
//@Todo add caching
export const getUserProfile = async uid => {
  const doc = await firebase
    .firestore()
    .doc(`/users/${uid}`)
    .get();
  if (!doc.exists) {
    return null;
  }
  return { ...doc.data(), id: uid };
};
export const getUserReceivedPosts = async (uid, limit = 20, offset = null) => {
  let postSnap = await firebase
    .firestore()
    .collection("posts")
    .where("giver.id", "==", uid);

  if (offset) postSnap = postSnap.startAfter(offset);
  postSnap = await postSnap.limit(limit).get();
  const posts = [];
  postSnap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }));
  return posts;
};

export const getUserPosts = async (uid, limit = 20, offset = null) => {
  let postSnap = await firebase
    .firestore()
    .collection("posts")
    .where("authorId", "==", uid);

  if (offset) postSnap = postSnap.startAfter(offset);
  postSnap = await postSnap.limit(limit).get();
  const posts = [];
  postSnap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }));
  return posts;
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const updateNotification = ({ userId, id, status = null }) => {
  if (!userId || !id || !status) {
    //@Todo log err
    console.log("Invalid payload:", userId, id, status);
    return null;
  }

  const VALID_STATUSES = ["read", "unread"];
  if (!VALID_STATUSES.includes(status)) {
    //@Todo log err invalid status
    console.log("Invalid status:", status);
    return null;
  }

  const payload = {
    status
  };

  console.log("updating:", payload, userId, id);
  return firebase
    .firestore()
    .doc(`/users/${userId}/notifications/${id}`)
    .update(payload);
};

export const watchNotifications = async (userId, cb) => {
  if (!userId) {
    console.log("No user id in listNotifications");
    return 0;
  }

  return firebase
    .firestore()
    .collection(`/users/${userId}/notifications`)
    .where("status", "==", "unread")
    .onSnapshot(async qs => {
      const nots = [];
      for (let doc of qs.docs) {
        const not = { ...doc.data(), id: doc.id };
        try {
          if (not.type === "givFinished" && not.giverId) {
            not.giver = await getUserProfile(not.giverId);
          }
          if (not.type === "givRequest" && not.requestType === "send") {
            not.sender = await getUserProfile(not.senderId);
          }
          if (not.type === "givRequest" && not.requestType === "receive") {
            not.receiver = await getUserProfile(not.receiverId);
          }
        } catch (err) {
          //@Todo notify err
          console.log(err);
        }
        nots.push(not);
      }

      cb(nots);
    });
};

export const getUnreadNotificationCount = async userId => {
  if (!userId) {
    console.log("No user id in listNotifications");
    return 0;
  }

  const snap = await firebase
    .firestore()
    .collection(`/users/${userId}/notifications`)
    .where("status", "==", "unread")
    .get();

  return snap.docs.length;
};

export const listNotifications = async (userId, limit = 50, offset = 0) => {
  if (!userId) {
    console.log("No user id in listNotifications");
    return null;
  }

  const snap = await firebase
    .firestore()
    .collection(`/users/${userId}/notifications`)
    .where("status", "==", "unread")
    .limit(limit)
    .get();
  const notifications = [];
  for (let doc of snap.docs) {
    const not = { ...doc.data(), id: doc.id };
    try {
      if (not.type === "givFinished" && not.giverId) {
        not.giver = await getUserProfile(not.giverId);
      }
      if (not.type === "givRequest" && not.requestType === "send") {
        not.sender = await getUserProfile(not.senderId);
      }
      if (not.type === "givRequest" && not.requestType === "receive") {
        not.receiver = await getUserProfile(not.receiverId);
      }
    } catch (err) {
      //@Todo notify err
      console.log(err);
    }
    notifications.push(not);
  }

  return notifications;
};

export const logout = () => {
  return firebase.auth().signOut();
};

export const createGivRequest = async (senderId, receiverId, type) => {
  const payload = {
    senderId,
    receiverId,
    type,
    createdAt: new Date().toISOString()
  };

  //@Todo sec rule to prevent duplicate requests
  //@Todo sec rule to prevent read access for other than these two users

  return firebase
    .firestore()
    .collection(`/givRequests`)
    .add(payload);
};

export const deleteImage = path => {
  console.log("deleting image:", path);
  return firebase
    .storage()
    .ref()
    .child(path)
    .delete();
};
export const uploadImage = (img, path) => {
  console.log("uploading", img, path);
  return firebase
    .storage()
    .ref()
    .child(path)
    .put(img);
};
export const deletePost = id => {
  //@Todo error handling

  if (!id) return;

  return firebase
    .firestore()
    .doc(`/posts/${id}`)
    .delete();
};

export const updatePost = ({
  id,
  title = null,
  message = null,
  images = null
}) => {
  //@Todo error handling

  const payload = {
    updatedAt: new Date().toISOString()
  };
  if (title && title !== "") payload.title = title;
  if (message && message !== "") payload.message = message;
  if (images && images !== "") payload.images = images;

  return firebase
    .firestore()
    .doc(`/posts/${id}`)
    .update(payload);
};

export const createPost = async ({
  authorId,
  images = [],
  title = "",
  message = "",
  giv
}) => {
  //@Todo error handling
  const author = await getUserProfile(authorId);

  const payload = {
    author: {
      id: author.id,
      name: author.name,
      photoURL: author.photoURL
    },
    authorId,
    givId: giv.id,
    giver: {
      id: giv.giver.id,
      name: giv.giver.name,
      photoURL: giv.giver.photoURL
    },
    title,
    message,
    images: [],
    createdAt: new Date().toISOString()
  };

  const doc = await firebase
    .firestore()
    .collection("posts")
    .add(payload);
  const post = { ...payload, id: doc.id };

  const imagePaths = images.map(img => {
    const path = `images/${authorId}/posts/${
      post.id
    }/images/${shortId.generate()}`;
    return path;
  });

  //@Todo sec rule to prevent duplicate posts for same giv
  //@Todo sec rule to validate input data

  const promises = imagePaths.map((path, index) => {
    const img = images[index];
    return uploadImage(img, path);
  });
  //@Todo if upload fails write to sentry
  //and also try uploading via functions
  await Promise.all(promises);
  await firebase
    .firestore()
    .doc(`/posts/${post.id}`)
    .set({ images: imagePaths }, { merge: true });

  return post;
};

const DEFAULT_QUERY_LIST_POSTS = {
  area: null,
  offset: null,
  limit: 20
};
const listPosts = async (query = {}) => {
  const q = { ...DEFAULT_QUERY_LIST_POSTS, ...query };

  let snap = firebase.firestore().collection("posts");

  if (q.area && q.area != "all") snap = snap.where("area", "==", q.area);

  snap = snap.orderBy("createdAt", "desc");

  if (q.offset) {
    snap = snap.startAfter(q.offset);
  }

  snap = await snap.limit(q.limit).get();

  const posts = [];
  snap.forEach(doc => posts.push({ ...doc.data(), id: doc.id }));
  const offset = snap.docs[snap.docs.length - 1];
  return [posts, offset];
};

const listAreas = async () => {
  const areas = {};
  const snap = await firebase
    .firestore()
    .collection("areas")
    .get();
  snap.forEach(doc => (areas[doc.id] = { id: doc.id, ...doc.data() }));
  return areas;
};
const getNewGivs = async receiverId => {
  const snap = await firebase
    .firestore()
    .collection("givs")
    .where("receiverId", "==", receiverId)
    .where("status", "==", "Pending")
    .get();
  const givs = [];
  snap.forEach(doc => {
    givs.push({ ...doc.data(), id: doc.id });
  });
  return givs;
};

const getFinishedGivs = async receiverId => {
  const snap = await firebase
    .firestore()
    .collection("givs")
    .where("receiverId", "==", receiverId)
    .where("status", "==", "Finished")
    .get();
  const givs = [];
  snap.forEach(async doc => {
    const giv = { ...doc.data(), id: doc.id };
    giv.giver = await getUserProfile(giv.giverId);
    givs.push(giv);
  });
  return givs;
};
//@Todo add caching

const getPostById = async id => {
  const doc = await firebase
    .firestore()
    .doc(`posts/${id}`)
    .get();
  if (doc.exists) {
    return { ...doc.data(), id: doc.id };
  } else {
    return null;
  }
};

const getPostByGivId = async givId => {
  const snap = await firebase
    .firestore()
    .collection("posts")
    .where("givId", "==", givId)
    .get();
  if (!snap.empty) {
    const doc = snap.docs[0]; //@Todo assert only one
    return { ...doc.data(), id: doc.id };
  } else {
    return null;
  }
};

const getPostsForMe = async userId => {
  const snap = await firebase
    .firestore()
    .collection("posts")
    .where("giver.id", "==", userId)
    .get();

  const posts = [];
  snap.forEach(doc => {
    posts.push({ ...doc.data(), id: doc.id });
  });
  return posts;
};

const getGivRequests = async userId => {
  const snap1 = await firebase
    .firestore()
    .collection("givRequests")
    .where("giverId", "==", userId)
    .where("type", "==", "receive")
    .get();
  const snap2 = await firebase
    .firestore()
    .collection("givRequests")
    .where("receiverId", "==", userId)
    .where("type", "==", "send")
    .get();

  const requests = [];
  snap1.forEach(async doc => {
    const payload = { ...doc.data(), id: doc.id };
    const receiver = await getUserProfile(payload.receiverId);
    payload.receiver = receiver;
    requests.push(payload);
  });
  //@Todo need to tighten the rules for givRequest, current open for all
  snap2.forEach(async doc => {
    const payload = { ...doc.data(), id: doc.id };
    const sender = await getUserProfile(payload.senderId);
    payload.sender = sender;
    requests.push(payload);
  });
  return requests;
};
export const getInviteCode = async code => {
  const resp = await firebase
    .firestore()
    .doc(`/invites/${code}`)
    .get();
  return { ...resp.data() };
};

//@Todo add cache to getUserProfile etc
export const createUserProfile = async ({
  uid,
  code,
  area,
  skills,
  interests
}) => {
  const payload = {
    uid,
    code,
    skills,
    area,
    interests
  };
  //@Todo validate payload
  const resp = await firebase.functions().httpsCallable("createUserProfile")(
    payload
  );
  console.log(resp);
  //@Todo handle errors like
  //	profile already exists,
  //	code already used,
  //	code not found,
  //	skills or interests are empty etc
  return "OK";
};
export const saveDeviceToken = (token = null) => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Save device token failed: Unauthorized");
  }
  if (!token || token === "") {
    throw new Error("Save device token failed: Token invalid");
  }
  return firebase
    .firestore()
    .doc(`/users/${user.uid}/deviceTokens/${token}`)
    .set({ lastUpdatedAt: new Date().toISOString() });
};

export const setupNotifications = async (token = null) => {
  if (token) {
    //ios and android
    await saveDeviceToken(token);
  } else {
    //web
    const messaging = firebase.messaging();
    try {
      await messaging.requestPermission();
      const token = await messaging.getToken();
      await saveDeviceToken(token);
    } catch (err) {
      console.log("Err setting notifications");
      console.log(err);
    }
  }
};

export default {
  listSkills,
  listUsers,
  listAreas,
  listPosts,
  listNotifications,
  getUnreadNotificationCount,
  watchNotifications,
  updateNotification,
  getUserProfile,
  getUserPosts,
  getUserReceivedPosts,
  getCurrentUser,

  uploadImage,
  deleteImage,

  getGiv,
  logout,

  createGivRequest,
  createPost,
  updatePost,
  deletePost,

  getFinishedGivs,
  getPostByGivId,
  getPostById,
  getPostsForMe,
  getNewGivs,
  getGivRequests,
  getInviteCode,
  createUserProfile,

  setupNotifications
};
