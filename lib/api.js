import firebase from "./firebase";

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

export default {
  listSkills,
  listUsers,
  listNotifications,
  getUserProfile,
  getUserPosts,
  getCurrentUser
};
