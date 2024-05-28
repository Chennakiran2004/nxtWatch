import ThemeContext from '../../Context/ThemeContext'

import Layout from '../Layout'

import {
  darkThemeFailureImgUrl,
  lightThemeFailureImgUrl,
} from '../../Constants/logoUrl'

import {
  NotFoundImage,
  NotFoundContainer,
  NotFoundText,
} from './styledComponents'

const NotFound = () => (
  <ThemeContext.Consumer>
    {value => {
      const {isDarkTheme} = value
      const theme = isDarkTheme ? 'dark' : 'light'

      const imgUrl = isDarkTheme
        ? darkThemeFailureImgUrl
        : lightThemeFailureImgUrl

      return (
        <Layout>
          <NotFoundContainer theme={theme}>
            <NotFoundImage src={imgUrl} alt="not found" />
            <NotFoundText theme={theme}>Page Not Found</NotFoundText>
            <NotFoundText theme={theme}>
              We are sorry, the page you requested could not be found.
            </NotFoundText>
          </NotFoundContainer>
        </Layout>
      )
    }}
  </ThemeContext.Consumer>
)

export default NotFound
