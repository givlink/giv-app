import firebase from "../lib/firebase";
import api from "../lib/api";

const DEBUG_MODE = false; //@Todo we could set this to process.env.NODE_ENV === 'development'
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
  userSearchLoading: true,
  userSearchItems: [],
  givRequests: {
    receive: [],
    send: [],
    combined: [],
    pendingCount: 0
  },
  recommendationsLoading: true,
  recommendations: {
    matchingYourInterests: [],
    matchingYourSkills: [],
    similarInterests: []
  },
  userSearchFilter: {
    type: null,
    value: null
  },
  lastError: null,
  skillsMap: {},
  skillCategories: [],
  areaCategories: [],
  notifications: [],
  areasMap: {},
  authLoading: true,
  user: null,
  userProfile: null,
  userProfileLoading: true,
  filterArea: localStorage.getItem("filterArea") || "all"
});

const dedupeAppend = (array, newArray) => {
  const map = {};
  array.forEach(u => (map[u.id] = u));
  newArray.forEach(u => (map[u.id] = u));
  return Object.values(map);
};

const fetchAreasAndSkillsEtc = async store => {
  store.commit("setSkillsMap", await api.listSkills());
  store.commit("setAreasMap", await api.listAreas());
  store.commit("setSkillCategories", await api.listSkillCategories());
  store.commit("setAreaCategories", await api.listPlaceCategories());
};

const fetchRecommendations = async (store, userProfile) => {
  store.commit("setRecommendations", {
    matchingYourInterests: await api.listRecommendations(userProfile),
    matchingYourSkills: await api.listUsersWhoLikeYourSkills(userProfile),
    similarInterests: await api.listSimilarUsers(userProfile)
  });
  store.commit("setRecommendationsLoading", false);
};
const fetchInitialPosts = async (store, context) => {
  const [posts, offset] = await api.listPosts({
    area: store.state.filterArea,
    offset: context.app.$utils.getGlobalOffset(),
    limit: store.state.postLimit
  });
  store.commit("setPosts", posts);
  context.app.$utils.setGlobalOffset(offset);
};
const fetchInitialUsersForSearch = async (store, context) => {
  const [users, userOffset] = await api.listUsers();
  store.commit("setUserSearchItems", { users });
  store.commit("setUserSearchLoading", false);
  context.app.$utils.setGlobalUserSearchOffset(userOffset);
};

export const mutations = {
  setFilterArea(state, area) {
    if (state.filterArea === area) return;

    const VALID_AREAS = ["all", "senboku"];
    if (!VALID_AREAS.includes(area)) return; //@Todo log err

    //@Change post list here
    localStorage.setItem("filterArea", area);
    state.filterArea = area;

    state.posts = []; //reset posts
  },
  setRecommendations(state, r) {
    state.recommendations = r;
  },
  setRecommendationsLoading(state, b) {
    state.recommendationsLoading = b;
  },
  setUserProfile(state, user) {
    state.userProfile = user;
  },
  setUserProfileLoading(state, val) {
    state.userProfileLoading = val;
  },
  setUserSearchLoading(state, val) {
    state.userSearchLoading = val;
  },
  setUserSearchItems(state, { users, append }) {
    if (append) {
      state.userSearchItems = dedupeAppend(state.userSearchItems, users);
    } else {
      state.userSearchItems = users;
    }
  },
  setUserSearchFilter(state, filter) {
    state.userSearchFilter = filter;
  },
  setNotifications(state, nots) {
    state.notifications = nots;
  },
  setGivRequestsReceive(state, reqs) {
    state.givRequests.receive = reqs;
    state.givRequests.combined = [
      ...state.givRequests.receive,
      ...state.givRequests.send
    ];
    state.givRequests.combined.sort((a, b) => {
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    state.givRequests.pendingCount = state.givRequests.combined.filter(
      c => c.status !== "match"
    ).length;
  },
  setGivRequestsSend(state, reqs) {
    state.givRequests.send = reqs;
    state.givRequests.combined = [
      ...state.givRequests.receive,
      ...state.givRequests.send
    ];
    state.givRequests.combined.sort((a, b) => {
      return a.createdAt < b.createdAt ? 1 : -1;
    });

    state.givRequests.pendingCount = state.givRequests.combined.filter(
      c => c.status !== "match"
    ).length;
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
  setAreaCategories(state, s) {
    state.areaCategories = s;
  },
  setSkillCategories(state, s) {
    state.skillCategories = s;
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
  getAreaTag: state => id => {
    return state.areasMap[id];
  },
  getSkillCategoryTag: state => id => {
    let result;
    state.skillCategories.forEach(i => {
      if (i.id === id) result = i;
    });
    return result;
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
  async loadMoreUserSearch({ commit, state }) {
    commit("setUserSearchLoading", true);
    const off = this.$utils.getGlobalUserSearchOffset();
    let limit = 20;
    if (state.userSearchFilter.type === "name") {
      limit = 10; //smaller limit on names for tighter match
    }
    const [users, offset] = await api.listUsers(
      off,
      limit,
      state.userSearchFilter
    );
    commit("setUserSearchItems", { users, append: true });
    commit("setUserSearchLoading", false);
    this.$utils.setGlobalUserSearchOffset(offset);
  },
  async updateUserSearchFilter({ commit }, { filter, resetOffset }) {
    let off = this.$utils.getGlobalUserSearchOffset();
    if (resetOffset) {
      off = null;
    }
    commit("setUserSearchFilter", filter);
    commit("setUserSearchLoading", true);
    let limit = 20;
    if (filter.type === "name") {
      limit = 10; //smaller limit on names for tighter match
    }
    const [users, offset] = await api.listUsers(off, limit, filter);
    commit("setUserSearchItems", { users });
    commit("setUserSearchLoading", false);
    this.$utils.setGlobalUserSearchOffset(offset);
  },
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

        listener = api.watchNotifications(
          u.uid,
          nots => store.commit("setNotifications", nots),
          DEBUG_MODE
        );

        fetchAreasAndSkillsEtc(store);

        //Watch givRequests
        //@Todo cleanup listener
        api.watchGivRequests(
          u.uid,
          requests => store.commit("setGivRequestsReceive", requests),
          requests => store.commit("setGivRequestsSend", requests)
        );

        //Fetch user profile
        const userProfile = await api.getUserProfile(u.uid);
        store.commit("setUserProfile", userProfile);
        store.commit("setUserProfileLoading", false);

        if (userProfile.area === "senboku") {
          store.commit("setFilterArea", "senboku");
        } else {
          //Always reset if not senboku user
          store.commit("setFilterArea", "all");
        }
        fetchInitialPosts(store, context);
        fetchInitialUsersForSearch(store, context);
        fetchRecommendations(store, userProfile);
      } else {
        store.commit("setUser", null);
        this.listener && this.listener();
      }
      store.commit("setAuthLoading", false);
    });
  }
};
