import firebase from "../lib/firebase";

export default ({ store }) => {
  return new Promise(resolve => {
    store.commit("setAuthLoading", true);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const u = {
          uid: user.uid,
          photoURL: user.photoURL,
          name: user.displayName
        };
        store.commit("setUser", u);
      } else {
        store.commit("setUser", null);
      }
      store.commit("setAuthLoading", false);
      resolve();
    });
  });
};
