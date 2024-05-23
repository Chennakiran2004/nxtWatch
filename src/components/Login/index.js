import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

import {
  LoginContainer,
  LoginCardContainer,
  WebsiteLogo,
  Label,
  Form,
  LoginButton,
  ShowPasswordLabel,
  LoginInput,
  ErrorMsg,
} from './styledComponents'

// keep the constant values in constant file
const websiteLogo =
  'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

class Login extends Component {
  state = {
    username: '',
    password: '',
    passwordType: 'password',
    isError: false,
    errorMsg: '',
  }

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  onCheckBox = event => {
    this.setState({passwordType: event.target.checked ? 'text' : 'password'})
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, isError: true})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    // create storage utils to maintain storage related methods
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    this.setState({isError: false})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    // create a common util for fetch calls
    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, passwordType, isError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <LoginContainer>
        <LoginCardContainer>
          <WebsiteLogo src={websiteLogo} alt="website logo" />
          <Form onSubmit={this.onSubmit}>
            <Label htmlFor="username">USERNAME</Label>
            {/* add validation for input fields */}
            <LoginInput
              type="text"
              id="username"
              placeholder="Username"
              onChange={this.updateUsername}
              value={username}
            />
            <Label htmlFor="password">PASSWORD</Label>
            <LoginInput
              id="password"
              placeholder="Password"
              onChange={this.updatePassword}
              value={password}
              type={passwordType}
            />
            {/* instead of raw html tag use input styled component  */}
            <input
              type="checkbox"
              id="showPassword"
              onClick={this.onCheckBox}
              className="showPassword"
            />
            <ShowPasswordLabel htmlFor="showPassword">
              Show Password
            </ShowPasswordLabel>
            <div>
              <LoginButton type="submit">Login</LoginButton>
            </div>
            <ErrorMsg>{isError && `* ${errorMsg}`}</ErrorMsg>
          </Form>
        </LoginCardContainer>
      </LoginContainer>
    )
  }
}

export default Login
