const fetchApi = async (url, options) => {
  try {
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      return {success: true, data}
    }
    return {success: false, data}
  } catch (error) {
    return {success: false, error}
  }
}

export default fetchApi
