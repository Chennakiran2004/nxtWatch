const getAuthHeaders = jwtToken => ({
  Authorization: `Bearer ${jwtToken}`,
})
export default getAuthHeaders
