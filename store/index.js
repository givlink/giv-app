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
  setTimes(state, times) {
    state.times = times;
  },
  setUser(state, img, first_name, last_name) {
    state.img = img;
    state.last_name = last_name;
    state.first_name = first_name;
  },
  setCode(state, code) {
    state.code = code;
  }
};
