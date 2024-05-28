import {Component} from 'react'

import {formatDistanceToNow} from 'date-fns'

import {BiLike, BiDislike} from 'react-icons/bi'

import {RiMenuAddLine} from 'react-icons/ri'

import ReactPlayer from 'react-player'

import Loader from 'react-loader-spinner'

import {getCookie} from '../../Constants/StorageUtilities'

import ThemeContext from '../../Context/ThemeContext'

import Header from '../Header'

import Sidebar from '../Sidebar'

import SavedVideosContext from '../../Context/SavedVideosContext'

import apiStatusConstants from '../../Constants/apiStatusConstants'

import getAuthHeaders from '../../Constants/getAuthHeaders'

import {
  MainBody,
  SidebarContainer,
  FailureImg,
  FailureContainer,
  FailureText,
  RetryButton,
  LoaderContainer,
  VideoItemDetailsContainer,
  PlayerContainer,
  VideoDetailContainer,
  VideoTextContainer,
  VideoTitle,
  ViewsAndPostedContainer,
  LikesAndViewsContainer,
  ViewsText,
  Button,
  ChannelLogo,
  ChannelDetails,
  ChannelDetailsText,
  ChannelDetailsText2,
  VideoDescriptionText,
} from './styledComponents'

class VideoItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    videoDetails: {},
    like: false,
    dislike: false,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  updateLikeState = () => {
    this.setState(previousState => ({
      like: !previousState.like,
      dislike: false,
    }))
  }

  updateDislikeState = () => {
    this.setState(previousState => ({
      dislike: !previousState.dislike,
      like: false,
    }))
  }

  getVideoDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/videos/${id}`
    const jwtToken = getCookie()

    const options = {
      headers: getAuthHeaders(jwtToken),
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = {
        videoDetails: data.video_details,
      }
      const {videoDetails} = updatedData
      const updated = {
        id: videoDetails.id,
        description: videoDetails.description,
        publishedAt: videoDetails.published_at,
        thumbnailUrl: videoDetails.thumbnail_url,
        title: videoDetails.title,
        videoUrl: videoDetails.video_url,
        viewCount: videoDetails.view_count,
        channel: {
          name: videoDetails.channel.name,
          profileImageUrl: videoDetails.channel.profile_image_url,
          subscriberCount: videoDetails.channel.subscriber_count,
        },
      }
      this.setState({
        videoDetails: updated,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  successView = () => {
    const {videoDetails, like, dislike} = this.state
    const {
      publishedAt,
      title,
      videoUrl,
      viewCount,
      channel,
      description,
      id,
    } = videoDetails

    const {name, profileImageUrl, subscriberCount} = channel
    let postedAt = formatDistanceToNow(new Date(publishedAt))
    const postedAtList = postedAt.split(' ')

    if (postedAtList.length === 3) {
      postedAtList.shift()
      postedAt = postedAtList.join(' ')
    }

    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const theme = isDarkTheme ? 'dark' : 'light'

          const likeIsActive = like ? 'active' : 'not-active'
          const dislikeIsActive = dislike ? 'active' : 'not-active'
          return (
            <VideoDetailContainer>
              <PlayerContainer>
                <ReactPlayer
                  url={videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </PlayerContainer>
              <VideoTextContainer>
                <VideoTitle theme={theme}>{title}</VideoTitle>
                <LikesAndViewsContainer>
                  <ViewsAndPostedContainer>
                    <ViewsText>{viewCount} views</ViewsText>
                    <ViewsText>{postedAt} ago</ViewsText>
                  </ViewsAndPostedContainer>
                  <div>
                    <Button
                      type="button"
                      theme={likeIsActive}
                      onClick={this.updateLikeState}
                    >
                      <BiLike size={20} style={{paddingTop: '6px'}} />
                      Like
                    </Button>
                    <Button
                      type="button"
                      theme={dislikeIsActive}
                      onClick={this.updateDislikeState}
                    >
                      <BiDislike size={20} style={{paddingTop: '6px'}} />
                      Dislike
                    </Button>
                    <SavedVideosContext.Consumer>
                      {val => {
                        const {updateSave, savedVideosList} = val
                        const present = savedVideosList.find(
                          each => each.id === id,
                        )
                        const saveIsActive = present ? 'active' : 'not-active'
                        const saveText = present ? 'Saved' : 'Save'
                        return (
                          <Button
                            type="button"
                            theme={saveIsActive}
                            onClick={() => updateSave(videoDetails)}
                          >
                            <RiMenuAddLine
                              size={20}
                              style={{paddingTop: '6px'}}
                            />
                            {saveText}
                          </Button>
                        )
                      }}
                    </SavedVideosContext.Consumer>
                  </div>
                </LikesAndViewsContainer>
                <hr />
                <ChannelDetails>
                  <ChannelLogo src={profileImageUrl} alt="channel logo" />
                  <div>
                    <ChannelDetailsText theme={theme}>
                      {name}
                    </ChannelDetailsText>
                    <ChannelDetailsText2>{subscriberCount}</ChannelDetailsText2>
                  </div>
                </ChannelDetails>
                <VideoDescriptionText theme={theme}>
                  {description}
                </VideoDescriptionText>
              </VideoTextContainer>
            </VideoDetailContainer>
          )
        }}
      </ThemeContext.Consumer>
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
            <FailureText as="p" theme={theme}>
              We are having some trouble to complete your request. Please try
              again.
            </FailureText>
            <RetryButton type="button" onClick={this.getVideoDetails}>
              Retry
            </RetryButton>
          </FailureContainer>
        )
      }}
    </ThemeContext.Consumer>
  )

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

  renderUIBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.successView()
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
              <Header />
              <MainBody>
                <SidebarContainer>
                  <Sidebar />
                </SidebarContainer>
                <VideoItemDetailsContainer
                  data-testid="videoItemDetails"
                  theme={theme}
                >
                  {this.renderUIBasedOnAPIStatus()}
                </VideoItemDetailsContainer>
              </MainBody>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default VideoItemDetails
