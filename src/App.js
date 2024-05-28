import {Component, Redirect} from 'react'

import './App.css'

import {Route, Switch} from 'react-router-dom'

import Login from './components/Login'

import Home from './components/Home'

import Trending from './components/Trending'

import Gaming from './components/Gaming'

import ProtectedRoute from './components/ProtectedRoute'

import VideoItemDetails from './components/VideoItemDetails'

import ActiveMenuContext from './Context/ActiveMenuContext'

import ThemeContext from './Context/ThemeContext'

import SavedVideosContext from './Context/SavedVideosContext'

import SavedVideos from './components/SavedVideos'

import NotFound from './components/NotFound'

const activeMenuConstants = {
  initial: 'INITIAL',
  home: 'HOME',
  trending: 'TRENDING',
  gaming: 'GAMING',
  savedVideos: 'SAVED_VIDEOS',
}

class App extends Component {
  state = {
    isDarkTheme: false,
    activeMenu: activeMenuConstants.home,
    savedVideosList: [],
    save: false,
  }

  addVideosToSavedVideos = videoDetails => {
    this.setState(previousState => ({
      savedVideosList: [...previousState.savedVideosList, videoDetails],
    }))
  }

  deleteVideosFromSavedVideos = videoDetails => {
    const {savedVideosList} = this.state

    const updatedList = savedVideosList.filter(
      eachVideo => eachVideo.id !== videoDetails.id,
    )

    this.setState({savedVideosList: updatedList})
  }

  updateSaveVideosList = videoDetails => {
    const {save} = this.state

    if (save) {
      this.deleteVideosFromSavedVideos(videoDetails)
    } else {
      this.addVideosToSavedVideos(videoDetails)
    }
  }

  updateSave = videoDetails => {
    this.setState(
      previousState => ({save: !previousState.save}),
      this.updateSaveVideosList(videoDetails),
    )
  }

  toggleTheme = () => {
    this.setState(prev => ({isDarkTheme: !prev.isDarkTheme}))
  }

  changeActiveMenu = value => {
    this.setState({activeMenu: value})
  }

  render() {
    const {activeMenu, isDarkTheme, save, savedVideosList} = this.state
    return (
      <ThemeContext.Provider
        value={{isDarkTheme, toggleTheme: this.toggleTheme}}
      >
        <SavedVideosContext.Provider
          value={{
            save,
            savedVideosList,
            addVideosToSavedVideos: this.addVideosToSavedVideos,
            deleteVideosFromSavedVideos: this.deleteVideosFromSavedVideos,
            updateSave: this.updateSave,
          }}
        >
          <ActiveMenuContext.Provider
            value={{activeMenu, changeActiveMenu: this.changeActiveMenu}}
          >
            <Switch>
              <Route exact path="/login" component={Login} />
              <ProtectedRoute exact path="/" component={Home} />
              <ProtectedRoute exact path="/trending" component={Trending} />
              <ProtectedRoute exact path="/gaming" component={Gaming} />
              <ProtectedRoute
                exact
                path="/videos/:id"
                component={VideoItemDetails}
              />
              <ProtectedRoute
                exact
                path="/saved-videos"
                component={SavedVideos}
              />
              <ProtectedRoute exact path="/not-found" component={NotFound} />
              <Redirect to="/not-found" />
            </Switch>
          </ActiveMenuContext.Provider>
        </SavedVideosContext.Provider>
      </ThemeContext.Provider>
    )
  }
}

export default App
