import axios from "axios";
import {getCookie, setCookie, removeCookie} from "@/utils/cookie";
import router from "../router";
axios.defaults.baseURL = import.meta.env.VITE_BASE
axios.interceptors.request.use(response => {
  if (getCookie('access_token')){
    response.headers.common['Authorization'] = `Bearer ${getCookie('access_token')}`
  }
  return response
})
axios.interceptors.response.use(response => response, async error => {
  if (error.response.status === 401 && error.config && !error.config.isRetry && getCookie('refresh_token')) {
    error.config.isRetry = true
    console.log('error first', error, error.url, error.url === '/api/v1/user/profile')
    try {
      const resp = await axios.post('/api/v1/oauth/token?grant_type=refresh_token&token='+getCookie('refresh_token'), null, {
        headers: {
          Authorization: null
        }
      })
      console.log('response', resp)
      setCookie('access_token', resp.data.access_token, resp.data.expires_in_seconds)
      setCookie('refresh_token', resp.data.refresh_token, resp.data.refresh_token_expires_in_seconds)
      axios.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access_token}`
      error.config.headers.Authorization = `Bearer ${resp.data.access_token}`
      console.log('out', error.response.status)
      return await axios(error.config);
    } catch (e) {
      console.log('error', e)
      if (e.response.status === 404) {
        console.log('in', e.response.status)
        removeCookie('access_token')
        removeCookie('refresh_token')
      }
      await router.push({name: 'login'})
    }
  }
  console.log('last', error)
  return Promise.reject(error);
})
