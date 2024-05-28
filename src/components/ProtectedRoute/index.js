import {Redirect, Route} from 'react-router-dom'

import {getCookie} from '../../Constants/StorageUtilities'

const ProtectedRoute = props => {
  const jwtToken = getCookie()
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute
