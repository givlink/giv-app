import api from "lib/api";

const actions = {
  login: (provider) => {
    return async (dispatch) => {
      dispatch({ type: "auth/init" });
      api.login(provider);
    };
  },
  logout: () => {
    return async (dispatch) => {
      dispatch({ type: "auth/loading" });
      await api.logout();
    };
  },
  loadInitialAreaCategories: (setLoading = true) => {
    return async (dispatch) => {
      if (setLoading) {
        dispatch({ type: "area_categories/loading" });
      }
      const areaCategories = await api.listPlaceCategories();
      dispatch({ type: "area_categories/data", areaCategories });
    };
  },
  loadInitialSkillCategories: (setLoading = true) => {
    return async (dispatch) => {
      if (setLoading) {
        dispatch({ type: "skill_categoris/loading" });
      }
      const skillCategories = await api.listSkillCategories();
      dispatch({ type: "skill_categories/data", skillCategories });
    };
  },
  loadInitialAreas: (setLoading = true) => {
    return async (dispatch) => {
      if (setLoading) {
        dispatch({ type: "areas/loading" });
      }
      const areas = await api.listAreas();
      dispatch({ type: "areas/data", areas });
    };
  },
  loadInitialSkills: (setLoading = true) => {
    return async (dispatch) => {
      if (setLoading) {
        dispatch({ type: "skills/loading" });
      }
      const skills = await api.listSkills();
      dispatch({ type: "skills/data", skills });
    };
  },
  loadInitialPosts: (setLoading = true) => {
    return async (dispatch) => {
      if (setLoading) {
        dispatch({ type: "posts/loading" });
      }
      const [posts, offset] = await api.listPosts();
      dispatch({ type: "posts/data", posts, offset });
    };
  },
  loadMorePosts: () => {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch({ type: "posts/loading_more" });
      const [posts, offset] = await api.listPosts({
        offset: state.postsOffset,
      });
      dispatch({ type: "posts/data_more", posts, offset });
    };
  },

  loadInitialUsers: (setLoading = true) => {
    return async (dispatch) => {
      if (setLoading) {
        dispatch({ type: "users/loading" });
      }
      const [users, offset] = await api.listUsers();
      dispatch({ type: "users/data", users, offset });
    };
  },
  loadMoreUsers: () => {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch({ type: "users/loading_more" });
      const [users, offset] = await api.listUsers({
        offset: state.usersOffset,
      });
      dispatch({ type: "users/data_more", users, offset });
    };
  },
};

export default actions;
