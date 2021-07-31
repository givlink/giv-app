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
        dispatch({ type: "skill_categories/loading" });
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
  setLiked: (postId, liked) => {
    return async (dispatch, getState) => {
      const { user } = getState();
      // setting optimistic result before actual api call
      dispatch({ type: "postLike/data", postId, liked });
      //@Todo err handling
      if (liked) {
        api.likePost(postId, user.id);
      } else {
        api.unlikePost(postId, user.id);
      }
    };
  },
  loadUserProfile: () => {
    return async (dispatch, getState) => {
      const { authUser } = getState();
      if (!authUser) {
        console.warn("trying to load user profile but not authUser found");
        return;
      }
      dispatch({ type: "auth/user_profile_loading" });
      const user = await api.getUserProfile(authUser.uid, false);
      dispatch({ type: "auth/user_profile_data", user });
      dispatch({
        type: "posts/switch_area_filter",
        postAreaFilter: user.area === "senboku" ? "senboku" : null,
      });
    };
  },
  switchAreaFilter: (newAreaFilter) => {
    return async (dispatch, getState) => {
      dispatch({
        type: "posts/switch_area_filter",
        postAreaFilter: newAreaFilter,
      });
      //Reset all posts and offsets
      dispatch({ type: "posts/reset" });
      const [posts, offset] = await api.listPosts({ area: newAreaFilter });
      dispatch({ type: "posts/data", posts, offset });

      //Reset scroll pos
      window.scrollTo(0, 0); //reset scroll
      dispatch({
        type: "nav/scroll",
        page: "postList",
        pos: 0,
      });

      //@Todo dispatch toast to notify filter changed
    };
  },
  watchRequests: () => {
    return async (dispatch, getState) => {
      const { authUser } = getState();
      dispatch({ type: "requests/loading" });
      api.watchGivRequests(
        authUser.uid,
        (requests) => 
          dispatch({ type: "requests/data", requests })
        ,
        (requests) => 
          dispatch({ type: "requests/data", requests })
      );
    };
  },
  loadUserProfileAndInitialPost: () => {
    return async (dispatch, getState) => {
      const { authUser } = getState();
      dispatch({ type: "auth/user_profile_loading" });
      const user = await api.getUserProfile(authUser.uid, false);
      dispatch({ type: "auth/user_profile_data", user });

      const postAreaFilter = user.area === "senboku" ? "senboku" : null;
      dispatch({
        type: "posts/switch_area_filter",
        postAreaFilter,
      });

      dispatch({ type: "posts/loading" });
      const [posts, offset] = await api.listPosts({ area: postAreaFilter });
      dispatch({ type: "posts/data", posts, offset });
    };
  },
  watchNotifications: () => {
    return async (dispatch, getState) => {
      const { authUser } = getState();
      dispatch({ type: "notifications/loading" });
      api.watchNotifications(authUser.uid, (notifications) => {
        dispatch({ type: "notifications/data", notifications });
      });
    };
  },
  loadInitialPosts: (setLoading = true) => {
    return async (dispatch, getState) => {
      const { postAreaFilter } = getState();

      if (setLoading) {
        dispatch({ type: "posts/loading" });
      }
      const [posts, offset] = await api.listPosts({ area: postAreaFilter });
      dispatch({ type: "posts/data", posts, offset });
    };
  },
  loadMorePosts: () => {
    return async (dispatch, getState) => {
      const state = getState();
      dispatch({ type: "posts/loading_more" });
      const [posts, offset] = await api.listPosts({
        offset: state.postsOffset,
        area: state.postAreaFilter,
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