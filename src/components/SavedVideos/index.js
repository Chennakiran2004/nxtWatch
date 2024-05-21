import {Component} from 'react'

import {RiMenuAddLine} from 'react-icons/ri'

import ThemeContext from '../../Context/ThemeContext'

import SavedVideosContext from '../../Context/SavedVideosContext'

import Header from '../Header'

import Sidebar from '../Sidebar'

import TrendingVideoCard from '../TrendingVideoCard'

import {
  SavedVideosMainContainer,
  MainBody,
  SidebarContainer,
  SavedVideosContainer,
  SavedMenuContainer,
  IconContainer,
  MenuHeading,
  NoVideosContainer,
  NoVideosImg,
  FailureText,
  VideosList,
} from './styledComponents'

class SavedVideos extends Component {
  savedList = themeValue => {
    const {isDarkTheme} = themeValue
    const theme = isDarkTheme ? 'dark' : 'light'

    return (
      <SavedVideosContext.Consumer>
        {value => {
          const {savedVideosList} = value
          if (savedVideosList.length === 0) {
            return (
              <NoVideosContainer>
                <NoVideosImg
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                  alt="no saved videos"
                />
                <FailureText theme={theme} as="h1">
                  No saved videos found
                </FailureText>
                <FailureText theme={theme} as="p">
                  You can save your videos while watching them
                </FailureText>
              </NoVideosContainer>
            )
          }
          return (
            <VideosList>
              {savedVideosList.map(each => (
                <TrendingVideoCard videoDetails={each} key={each.id} />
              ))}
            </VideosList>
          )
        }}
      </SavedVideosContext.Consumer>
    )
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const theme = isDarkTheme ? 'dark' : 'light'

          return (
            <SavedVideosMainContainer theme={theme}>
              <Header />
              <MainBody>
                <SidebarContainer>
                  <Sidebar />
                </SidebarContainer>
                <SavedVideosContainer>
                  <SavedMenuContainer theme={theme}>
                    <IconContainer theme={theme}>
                      <RiMenuAddLine size={40} color="#ff0b37" />
                    </IconContainer>
                    <MenuHeading theme={theme}>Saved Videos</MenuHeading>
                  </SavedMenuContainer>
                  {this.savedList(value)}
                </SavedVideosContainer>
              </MainBody>
            </SavedVideosMainContainer>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default SavedVideos
