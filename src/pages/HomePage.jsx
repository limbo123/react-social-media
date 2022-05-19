import React from 'react'
import OverviewPage from '../components/OverviewPage/OverviewPage'

function HomePage({ currentUser, currentTheme }) {
  return (
    <OverviewPage currentUser={currentUser} currentTheme={currentTheme} />
  )
}

export default HomePage