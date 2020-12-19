
import axios from 'axios'
const cookieparser = process.server ? require('cookieparser') : undefined


const Cookie = process.client ? require('js-cookie') : undefined;
export const state = () => ({
  skills: [],
  places: [],
  interests: [],
  first_name: '',
  last_name: '',
  img: '',
  code: '',
  me: {},
  token: ''
});

export const mutations = {
  setSkills(state, skills) {
    state.skills = skills;
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
  }
};

export const actions = {
  nuxtClientInit ({ commit }, context) {
    let code = '';
    let last_name = '';
    let first_name = '';
    let img = '';
    code = Cookie.get('code');
    last_name = Cookie.get('last_name');
    first_name = Cookie.get('first_name');
    img = Cookie.get('img');
    let token = Cookie.get('auth._token.auth0');

    commit('setImg', img);
    commit('setFirstName',first_name);
    commit('setLastName', last_name);
    commit('setCode', code);
    commit('setToken', token);

    const baseUrl = process.env.baseUrl + '/me';
    const getUrl = encodeURI(baseUrl);
    axios.get(getUrl,{
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }
    ).then((res) => {
      commit("setMe", res.data);
    });
  }
}
