import firebase from "../lib/firebase";
export const state = () => ({
  skills: [],
  places: [],
  interests: [],
  first_name: "",
  last_name: "",
  img: "",
  code: "",
  me: {},
  token: "",
  skillsMap: {},
  areasMap: {},
  authLoading: true,
  user: null
});

export const mutations = {
  setSkills(state, skills) {
    state.skills = skills;
  },
  setAuthLoading(state, loading) {
    state.authLoading = loading;
  },
  setUser(state, user) {
    state.user = user;
  },
  setMe(state, me) {
    state.me = me;
  },
  setPlaces(state, places) {
    state.places = places;
  },
  setInterests(state, interests) {
    state.interests = interests;
  },
  setTimes(state, times) {
    state.times = times;
  },
  setImg(state, img) {
    state.img = img;
  },
  setLastName(state, last_name) {
    state.last_name = last_name;
  },
  setFirstName(state, first_name) {
    state.first_name = first_name;
  },
  setCode(state, code) {
    state.code = code;
  },
  isAuthenticated(state, code) {
    state.authenticated = true;
  },
  setToken(state, token) {
    state.token = token;
  },
  setSkillsMap(state, s) {
    state.skillsMap = s;
  },
  setAreasMap(state, s) {
    state.areasMap = s;
  }
};

export const getters = {
  getSkillTag: state => id => {
    return state.skillsMap[id];
  },
  allSkillIds: state => () => {
    return Object.keys(state.skillsMap);
  }
};

export const actions = {
  nuxtClientInit({ commit }, context) {
    commit("setAuthLoading", true);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const u = {
          uid: user.uid,
          photoURL: user.photoURL,
          name: user.displayName
        };
        commit("setUser", u);
      } else {
        commit("setUser", null);
      }
      commit("setAuthLoading", false);
    });
  }
};
