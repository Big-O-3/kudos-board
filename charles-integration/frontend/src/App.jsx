import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import BoardPage from './components/BoardPage'
import StatsPage from './components/StatsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/boards/:id" element={<BoardPage />} />
      <Route path="/stats" element={<StatsPage />} />
    </Routes>
  )
}

export default App
