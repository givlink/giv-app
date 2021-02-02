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
  return { ...doc.data(), id: givId };
};

export const getUserProfile = async uid => {
  const doc = await firebase
    .firestore()
    .doc(`/users/${uid}`)
    .get();
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
    .startAfter(offset)
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

export default {
  listSkills,
  listUsers,
  listNotifications,
  getUserProfile,
  getUserPosts,
  getCurrentUser,

  uploadImage,

  getGiv,
  logout,

  createGivRequest,
  createPost
};
