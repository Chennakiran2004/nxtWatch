import Cookies from 'js-cookie'

export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, options)
}

export const getCookie = () => Cookies.get('jwt_token')

export const removeCookie = () => {
  Cookies.remove('jwt_token')
}
