import firebase from "../lib/firebase";
import api from "../lib/api";
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
  pushToken: null,
  postLimit: 20,
  posts: [],
  lastError: null,
  skillsMap: {},
  notifications: [],
  areasMap: {},
  authLoading: true,
  user: null,
  filterArea: localStorage.getItem("filterArea") || "all"
});

export const mutations = {
  setFilterArea(state, area) {
    if (state.filterArea === area) return;

    const VALID_AREAS = ["all", "sakai"];
    if (!VALID_AREAS.includes(area)) return; //@Todo log err

    //@Change post list here
    localStorage.setItem("filterArea", area);
    state.filterArea = area;

    state.posts = []; //reset posts
  },
  setNotifications(state, nots) {
    state.notifications = nots;
  },
  setLastError(state, err) {
    state.lastError = err;
  },
  setPushToken(state, pushToken) {
    state.pushToken = pushToken;
  },
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
  },
  setPosts(state, posts) {
    state.posts = posts;
  }
};

export const getters = {
  getFilterArea: state => () => {
    return state.filterArea;
  },
  getNotifications: state => () => {
    return state.notifications;
  },
  getAreaTag: state => id => {
    return state.areasMap[id];
  },
  getSkillTag: state => id => {
    return state.skillsMap[id];
  },
  getLastError: state => () => {
    return state.lastError;
  },
  getPushToken: state => () => {
    return state.pushToken;
  },
  allSkillIds: state => () => {
    return Object.keys(state.skillsMap);
  }
};

export const actions = {
  nuxtClientInit(store, context) {
    store.commit("setAuthLoading", true);
    let listener;
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        //Setup user
        const u = {
          uid: user.uid,
          photoURL: user.photoURL,
          name: user.displayName
        };
        store.commit("setUser", u);

        listener = api.watchNotifications(u.uid, nots =>
          store.commit("setNotifications", nots)
        );

        //Fetch areas and skills
        store.commit("setSkillsMap", await api.listSkills());
        store.commit("setAreasMap", await api.listAreas());

        //Fetch initial posts
        const [posts, offset] = await api.listPosts({
          area: store.state.filterArea,
          offset: context.app.$utils.getGlobalOffset(),
          limit: store.state.postLimit
        });
        store.commit("setPosts", posts);
        context.app.$utils.setGlobalOffset(offset);
      } else {
        store.commit("setUser", null);
        this.listener && this.listener();
      }
      store.commit("setAuthLoading", false);
    });
  }
};
