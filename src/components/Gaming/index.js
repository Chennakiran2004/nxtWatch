import {Component} from 'react'
import {IoLogoGameControllerB} from 'react-icons/io'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import ThemeContext from '../../Context/ThemeContext'
import Header from '../Header'
import Sidebar from '../Sidebar'

import GamingBody from '../GamingBody'

import {
  GamingMainContainer,
  MainBody,
  SidebarContainer,
  GamingContainer,
  GamingMenuContainer,
  IconContainer,
  MenuHeading,
  LoaderContainer,
  VideosList,
  FailureContainer,
  FailureText,
  FailureImg,
  RetryButton,
} from './styledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Gaming extends Component {
  state = {apiStatus: apiStatusConstants.initial, videosList: []}

  componentDidMount() {
    this.getVideos()
  }

  loader = () => (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const theme = isDarkTheme ? 'dark' : 'light'
        return (
          <LoaderContainer theme={theme} data-testid="loader">
            <Loader
              type="ThreeDots"
              color={isDarkTheme ? '#ffffff' : '#000000'}
              height="50"
              width="50"
            />
          </LoaderContainer>
        )
      }}
    </ThemeContext.Consumer>
  )

  getVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/gaming'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = data.videos.map(eachItem => ({
        id: eachItem.id,
        thumbnailUrl: eachItem.thumbnail_url,
        title: eachItem.title,
        viewCount: eachItem.view_count,
      }))
      this.setState({
        videosList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getSuccessView = () => {
    const {videosList} = this.state

    return (
      <VideosList>
        {videosList.map(eachVideo => (
          <GamingBody key={eachVideo.id} gameDetails={eachVideo} />
        ))}
      </VideosList>
    )
  }

  getFailureView = () => (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const theme = isDarkTheme ? 'dark' : 'light'
        const imgUrl = isDarkTheme
          ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
          : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'

        return (
          <FailureContainer>
            <FailureImg src={imgUrl} alt="failure view" />

            <FailureText theme={theme}>Oops! Something Went Wrong</FailureText>
            <FailureText theme={theme} as="p">
              We are having some trouble to complete your request. Please try
              again
            </FailureText>
            <RetryButton type="button" onClick={this.getVideos}>
              Retry
            </RetryButton>
          </FailureContainer>
        )
      }}
    </ThemeContext.Consumer>
  )

  // naming can be imporved : renderUIBasedOnAPIStatus
  checkApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSuccessView()
      case apiStatusConstants.failure:
        return this.getFailureView()
      case apiStatusConstants.inProgress:
        return this.loader()
      default:
        return null //return fragment (<></>) instead of null
    }
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const theme = isDarkTheme ? 'dark' : 'light'
          return (
            <GamingMainContainer data-testid="gaming" theme={theme}>
              <Header />
              <MainBody>
                <SidebarContainer>
                  <Sidebar />
                </SidebarContainer>
                <GamingContainer>
                  <GamingMenuContainer theme={theme}>
                    <IconContainer theme={theme}>
                      <IoLogoGameControllerB size={40} color="#ff0b37" />
                    </IconContainer>
                    <MenuHeading theme={theme}>Gaming</MenuHeading>
                  </GamingMenuContainer>
                  {this.checkApiStatus()}
                </GamingContainer>
              </MainBody>
            </GamingMainContainer>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default Gaming
