import React from 'react'
// theme
import ThemeConfig from './theme'
import GlobalStyles from './theme/globalStyles'

import { GroupsList } from './pages/GroupsList'
import { GroupSettings } from './pages/GroupSettings'
import { Navbar } from './components/Navbar'

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

function App () {
  return (
    <ThemeConfig>
      <GlobalStyles />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* <Route path="/" element={ <User /> } /> */}
            <Route path="/" element={ <GroupsList /> } />
            <Route path="/groups/:groupId" element={ <GroupSettings /> } />
            {/* <Navigate to="/" />  not supported in this version or something? */}
          </Routes>
        </div>
      </Router>
    </ThemeConfig>
  )
}

export default App
