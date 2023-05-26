import firebase from '../lib/firebase'
import useSWR from 'swr'
import axios from 'axios'
import qs from 'query-string'

let API_URL = `https://api.giv.link/api`
if (process.env.NODE_ENV === 'development' && true) {
  API_URL = 'http://localhost:3000/api'
}
const axiosInstance = axios.create({ baseURL: API_URL })

axiosInstance.interceptors.request.use(async function (config) {
  let currentUser = firebase.auth().currentUser
  const token = await currentUser?.getIdToken()
  config.headers.authorization = `Bearer ${token}`
  return config
})

const parseAxiosError = err => {
  if (err.response?.data?.error) {
    return err.response.data.error
  }
  if (err.response?.data) {
    return err.response.data
  }
  return err.message
}

const fetcher = async path => {
  try {
    const resp = await axiosInstance.get(path)
    return resp.data
  } catch (err) {
    err.message = parseAxiosError(err)
    err.status = err?.response?.status
    err.errorData = err?.response?.data?.errorData
    throw err
  }
}

export default function useApi(
  path,
  query = {},
  opts = { refreshinterval: 0, disable: false, shouldRetryOnError: false },
) {
  let url = `${path}`
  if (Object.keys(query).length) {
    url += `?${qs.stringify(query, { arrayFormat: 'comma' })}`
  }
  const { data, error, isValidating, mutate } = useSWR(url, fetcher, opts)
  const loading = !data && data !== null && !error

  return {
    data,
    loading,
    error: error?.message,
    isValidating,
    mutate,
    errorData: error?.errorData,
  }
}
