import { Routes, Route } from 'react-router-dom'
import DataPanel, { PokemonList } from './components/DataPanel'
import PokemonDetail from './components/PokemonDetail'
import PlaceholderPanel from './components/PlaceholderPanel'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div className="whole-page">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="data-panel">
        <Routes>
          <Route path="/" element={<DataPanel />} />
          <Route path="/pokemon" element={<DataPanel />}>
            <Route index element={<PokemonList />} />
            <Route path=":pokemonName" element={<PokemonDetail />} />
          </Route>
          <Route path="/about" element={<PlaceholderPanel title="About" message="This is a placeholder view for the about route." />} />
          <Route path="/settings" element={<PlaceholderPanel title="Settings" message="This is a placeholder view for the settings route." />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
