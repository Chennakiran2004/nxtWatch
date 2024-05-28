import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {IoMdClose} from 'react-icons/io'

import {BsSearch} from 'react-icons/bs'

import ThemeContext from '../../Context/ThemeContext'

import HomeBody from '../HomeBody'

import apiStatusConstants from '../../Constants/apiStatusConstants'

import Layout from '../Layout'

import {
  darkThemeFailureImgUrl,
  lightThemeFailureImgUrl,
} from '../../Constants/logoUrl'

import {getCookie} from '../../Constants/StorageUtilities'

import fetchApi from '../../Constants/fetchUtilities'

import getAuthHeaders from '../../Constants/getAuthHeaders'

import {VIDEO_SEARCH_API} from '../../Constants/videoSearchAPI'

import {
  HomeMainContainer,
  HomeContainer,
  SearchContainer,
  SearchInput,
  SearchButton,
  GetPremium,
  CloseButton,
  BannerLogo,
  BannerText,
  GetItButton,
  LoaderContainer,
  VideosList,
  NoVideosContainer,
  NoVideosImg,
  FailureText,
  RetryButton,
  FailureContainer,
  FailureImg,
} from './styledComponents'

class Home extends Component {
  state = {
    isPopup: true,
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    videosList: [],
  }

  componentDidMount = () => {
    this.getVideos()
  }

  onClickCloseBanner = () => {
    this.setState({isPopup: false})
  }

  renderAddPopup = () => (
    <GetPremium data-testid="banner">
      <CloseButton
        type="button"
        data-testid="close"
        onClick={this.onClickCloseBanner}
      >
        <IoMdClose size={16} />
      </CloseButton>
      <BannerLogo
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
        alt="nxt watch logo"
      />
      <BannerText>Buy Nxt Watch Premium prepaid plans with UPI</BannerText>
      <GetItButton>GET IT NOW</GetItButton>
    </GetPremium>
  )

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  loader = () => (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        return (
          <LoaderContainer className="loader-container" data-testid="loader">
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
    const {searchInput} = this.state

    const jwtToken = getCookie()

    const url = `${VIDEO_SEARCH_API}${searchInput}`

    const options = {
      headers: getAuthHeaders(jwtToken),
      method: 'GET',
    }

    const response = await fetchApi(url, options)

    if (response.success) {
      const updatedData = response.data.videos.map(eachItem => ({
        id: eachItem.id,
        channel: {
          name: eachItem.channel.name,
          profileImageUrl: eachItem.channel.profile_image_url,
        },
        publishedAt: eachItem.published_at,
        viewCount: eachItem.view_count,
        title: eachItem.title,
        thumbnailUrl: eachItem.thumbnail_url,
      }))
      this.setState({
        videosList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  noVideosView = () => (
    <ThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const theme = isDarkTheme ? 'dark' : 'light'

        return (
          <NoVideosContainer>
            <NoVideosImg
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
              alt="no videos"
            />
            <FailureText theme={theme}>No search results found</FailureText>
            <FailureText theme={theme}>
              Try different key words or remove search filter
            </FailureText>
            <RetryButton type="button" onClick={this.getVideos}>
              Retry
            </RetryButton>
          </NoVideosContainer>
        )
      }}
    </ThemeContext.Consumer>
  )

  getSuccessView = () => {
    const {videosList} = this.state
    console.log(videosList)

    if (videosList.length === 0) {
      return this.noVideosView()
    }

    return (
      <VideosList>
        {videosList.map(each => (
          <HomeBody key={each.id} videoDetails={each} />
        ))}
      </VideosList>
    )
  }

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
        return null
    }
  }

  failureView = () => (
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

  render() {
    const {isPopup, searchInput} = this.state
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const theme = isDarkTheme ? 'dark' : 'light'
          const color = isDarkTheme ? '#f9f9f9' : '#181818'
          console.log(theme)
          return (
            <>
              <Layout>
                <HomeMainContainer theme={theme}>
                  <HomeContainer theme={theme}>
                    {isPopup && this.renderAddPopup()}
                    <SearchContainer>
                      <SearchInput
                        theme={theme}
                        type="search"
                        placeholder="Search"
                        onChange={this.updateSearchInput}
                        value={searchInput}
                      />
                      <SearchButton
                        theme={theme}
                        type="button"
                        data-testid="searchButton"
                        onClick={this.getVideos}
                      >
                        <BsSearch color={color} />
                      </SearchButton>
                    </SearchContainer>
                    {this.renderUIBasedOnAPIStatus()}
                  </HomeContainer>
                </HomeMainContainer>
              </Layout>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default Home
