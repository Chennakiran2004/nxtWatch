import ThemeContext from '../../Context/ThemeContext'

import Header from '../Header'

import Sidebar from '../Sidebar'

import {
  LayoutContainer,
  MainBody,
  SidebarContainer,
  ContentContainer,
} from './styledComponents'

const Layout = ({children}) => (
  <ThemeContext.Consumer>
    {value => {
      const {isDarkTheme} = value
      const {theme} = isDarkTheme ? 'dark' : 'light'

      return (
        <LayoutContainer data-testid="layout" theme={theme}>
          <Header />
          <MainBody>
            <SidebarContainer>
              <Sidebar />
            </SidebarContainer>
            <ContentContainer>{children}</ContentContainer>
          </MainBody>
        </LayoutContainer>
      )
    }}
  </ThemeContext.Consumer>
)

export default Layout
