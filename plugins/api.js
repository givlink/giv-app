
import axios from 'axios'

let id;

export default function setup({ store }) {

  if (!!id || id === 0) {
    return
  }

  axios.interceptors.request.use((config) => {
    config.headers = {
      "Content-Type": "application/json",
      Authorization: store.state.token,
    };
    return config
  })

  id = axios.interceptors.response.use(null, (error) => {
    console.log(error);
    if (error.config && error.response && error.response.status === 401) {
      store.$auth.logout();
    }
    return Promise.reject(error);
  });
}
