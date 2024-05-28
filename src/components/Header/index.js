import {Component} from 'react'
import {FiSun, FiLogOut} from 'react-icons/fi'
import {FaMoon} from 'react-icons/fa'
import {GiHamburgerMenu} from 'react-icons/gi'
import {IoMdClose} from 'react-icons/io'

import {withRouter, Link} from 'react-router-dom'

import Popup from 'reactjs-popup'

import MenuItemsList from '../MenuItemsList'

import ActiveMenuContext from '../../Context/ActiveMenuContext'

import ThemeContext from '../../Context/ThemeContext'

import {removeCookie} from '../../Constants/StorageUtilities'

import {
  NavMobileContainer,
  HeaderLogoImg,
  NavMobileIcons,
  IconButton,
  CloseButton,
  NavLargeContainer,
  LogoutPopupContent,
  Button,
  ProfileIcon,
  NavLargeIcons,
  LargeLogoutButton,
  MenuPopupMobile,
  MenuListMobile,
} from './styledComponents'

class Header extends Component {
  onClickLogout = () => {
    const {history} = this.props
    removeCookie()
    history.replace('/login')
  }

  renderLogoutPopup = theme => (
    <Popup
      modal
      trigger={
        <LargeLogoutButton theme={theme} outline>
          Logout
        </LargeLogoutButton>
      }
      className="logout-popup"
    >
      {close => (
        <LogoutPopupContent theme={theme}>
          <p>Are you sure, you want to logout</p>
          <div>
            <Button outline type="button" onClick={() => close()}>
              Cancel
            </Button>
            <Button
              bgColor="blue"
              color="white"
              type="button"
              onClick={this.onClickLogout}
            >
              Confirm
            </Button>
          </div>
        </LogoutPopupContent>
      )}
    </Popup>
  )

  renderLogo = theme => (
    <ActiveMenuContext.Consumer>
      {activeValue => {
        const {changeActiveMenu} = activeValue
        return (
          <Link to="/">
            <HeaderLogoImg
              src={
                theme === 'dark'
                  ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
                  : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'
              }
              alt="website logo"
              onClick={() => changeActiveMenu('HOME')}
            />
          </Link>
        )
      }}
    </ActiveMenuContext.Consumer>
  )

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme, toggleTheme} = value

          const websiteLogo = isDarkTheme
            ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
            : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

          const theme = isDarkTheme ? 'dark' : 'light'
          const color = isDarkTheme ? 'white' : 'black'

          return (
            <>
              <NavMobileContainer theme={theme}>
                {this.renderLogo(theme)}
                <NavMobileIcons>
                  <IconButton
                    type="button"
                    data-testid="theme"
                    onClick={() => toggleTheme()}
                  >
                    {isDarkTheme ? (
                      <FiSun color="white" size={22} />
                    ) : (
                      <FaMoon size={22} />
                    )}
                  </IconButton>
                  <Popup
                    modal
                    className="popup-content"
                    trigger={
                      <IconButton type="button">
                        <GiHamburgerMenu color={color} size={22} />
                      </IconButton>
                    }
                  >
                    {close => (
                      <MenuPopupMobile theme={theme}>
                        <CloseButton>
                          <IconButton type="button" onClick={() => close()}>
                            <IoMdClose size={20} color={color} />
                          </IconButton>
                        </CloseButton>
                        <MenuListMobile>
                          <MenuItemsList />
                        </MenuListMobile>
                      </MenuPopupMobile>
                    )}
                  </Popup>
                  <Popup
                    modal
                    trigger={
                      <IconButton type="button">
                        <FiLogOut color={color} size={22} />
                      </IconButton>
                    }
                    className="logout-popup"
                  >
                    {close => (
                      <LogoutPopupContent theme={theme}>
                        <p>Are you sure, you want to logout</p>
                        <div>
                          <Button outline type="button" onClick={() => close()}>
                            Cancel
                          </Button>
                          <Button
                            bgColor="blue"
                            color="white"
                            type="button"
                            onClick={this.onClickLogout}
                          >
                            Confirm
                          </Button>
                        </div>
                      </LogoutPopupContent>
                    )}
                  </Popup>
                </NavMobileIcons>
              </NavMobileContainer>
              <NavLargeContainer theme={theme}>
                <ActiveMenuContext.Consumer>
                  {activeValue => {
                    const {changeActiveMenu} = activeValue
                    return (
                      <Link to="/">
                        <HeaderLogoImg
                          src={websiteLogo}
                          alt="website logo"
                          onClick={() => changeActiveMenu('HOME')}
                        />
                      </Link>
                    )
                  }}
                </ActiveMenuContext.Consumer>

                <NavLargeIcons>
                  <IconButton type="button" onClick={() => toggleTheme()}>
                    {isDarkTheme ? (
                      <FiSun color="white" size={23} />
                    ) : (
                      <FaMoon size={23} />
                    )}
                  </IconButton>
                  <ProfileIcon
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
                    alt="profile"
                  />
                  {this.renderLogoutPopup(theme)}
                </NavLargeIcons>
              </NavLargeContainer>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default withRouter(Header)
