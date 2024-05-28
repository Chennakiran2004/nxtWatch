import {Component} from 'react'

import {IoLogoGameControllerB} from 'react-icons/io'

import Loader from 'react-loader-spinner'

import ThemeContext from '../../Context/ThemeContext'

import GamingBody from '../GamingBody'

import apiStatusConstants from '../../Constants/apiStatusConstants'

import Layout from '../Layout'

import {
  darkThemeFailureImgUrl,
  lightThemeFailureImgUrl,
} from '../../Constants/logoUrl'

import getAuthHeaders from '../../Constants/getAuthHeaders'

import {
  GamingMainContainer,
  MainBody,
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

import {getCookie} from '../../Constants/StorageUtilities'

import fetchApi from '../../Constants/fetchUtilities'

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

    const jwtToken = getCookie()

    const url = 'https://apis.ccbp.in/videos/gaming'
    const options = {
      headers: getAuthHeaders(jwtToken),
      method: 'GET',
    }

    const response = await fetchApi(url, options)

    if (response.success) {
      const updatedData = response.data.videos.map(eachItem => ({
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
          ? darkThemeFailureImgUrl
          : lightThemeFailureImgUrl

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

  renderUIBasedOnAPIStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSuccessView()
      case apiStatusConstants.failure:
        return this.getFailureView()
      case apiStatusConstants.inProgress:
        return this.loader()
      default:
        return <></>
    }
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const theme = isDarkTheme ? 'dark' : 'light'
          return (
            <>
              <Layout>
                <GamingMainContainer data-testid="gaming" theme={theme}>
                  <MainBody>
                    <GamingContainer>
                      <GamingMenuContainer theme={theme}>
                        <IconContainer theme={theme}>
                          <IoLogoGameControllerB size={40} color="#ff0b37" />
                        </IconContainer>
                        <MenuHeading theme={theme}>Gaming</MenuHeading>
                      </GamingMenuContainer>
                      {this.renderUIBasedOnAPIStatus()}
                    </GamingContainer>
                  </MainBody>
                </GamingMainContainer>
              </Layout>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default Gaming
