export const state = () => ({
  skills: [],
  places: [],
  interests: [],
  name: '',
  img: '',
  code: '',
});

export const mutations = {
  setSkills(state, skills) {
    state.skills = skills;
  },
  setPlaces(state, places) {
    state.places = places;
  },
  setInterests(state, interests) {
    state.interests = interests;
  },
  setUser(state, img, name) {
    state.img = img;
    state.name = name;
  },
  setCode(state, code) {
    state.code = code;
  }
};
