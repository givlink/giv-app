import firebase from "./firebase";
import shortId from "short-uuid";

export const listUsers = async (offset = null, limit = 20, filter = null) => {
  let snap = firebase.firestore().collection("users");
  if (offset) snap = snap.startAfter(offset);

  if (filter) snap = snap.where(filter[0], filter[1], filter[2]);
  //eg
  /* snap = snap.where("skills", "array-contains",[ "accomodation"]); */

  snap = await snap.limit(limit).get(); //@Todo sec rules

  const users = [];
  snap.forEach(doc => users.push({ ...doc.data(), id: doc.id }));
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

export const listNotifications = async (userId, limit = 50, offset = 0) => {
  if (!userId) {
    console.log("No user id in listNotifications");
    return null;
  }

  const snap = await firebase
    .firestore()
    .collection("notifications")
    .where("userId", "==", userId)
    // .startAfter(offset) //@Todo causes too many arguments provided to Query.startAfter()
    .limit(limit)
    .get();
  const notifications = [];
  snap.forEach(doc => notifications.push({ ...doc.data(), id: doc.id }));
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

export const uploadImage = (img, path) => {
  return firebase
    .storage()
    .ref()
    .child(path)
    .put(img);
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
  await Promise.all(promises);
  await firebase
    .firestore()
    .doc(`/posts/${post.id}`)
    .set({ images: imagePaths }, { merge: true });

  return post;
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
  snap.forEach(doc => {
    givs.push({ ...doc.data(), id: doc.id });
  });
  return givs;
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

export default {
  listSkills,
  listUsers,
  listAreas,
  listNotifications,
  getUserProfile,
  getUserPosts,
  getCurrentUser,

  uploadImage,

  getGiv,
  logout,

  createGivRequest,
  createPost,

  getFinishedGivs,
  getPostByGivId,
  getPostsForMe,
  getNewGivs,
  getGivRequests,
  getInviteCode,
  createUserProfile
};
