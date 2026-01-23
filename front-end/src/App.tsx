import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/GlobalStyles'
import { theme } from './styles/theme'
import { GameProvider } from './contexts/GameProvider'
import { useGameSession } from './hooks/useGameSession'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Ranking } from './pages/Ranking'
import { useState } from 'react'

type Page = 'home' | 'game' | 'ranking'

function AppContent() {
  const { gameId } = useGameSession()
  const [currentPage, setCurrentPage] = useState<Page>('home')

  if (gameId) {
    return <Game />
  }

  if (currentPage === 'ranking') {
    return <Ranking onBack={() => setCurrentPage('home')} />
  }

  return <Home onNavigateToRanking={() => setCurrentPage('ranking')} />
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeProvider>
  )
}

export default App
