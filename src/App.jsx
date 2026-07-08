import { useState } from 'react'
import DataPanel from './components/DataPanel'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {

  return (
    <div className="whole-page">
      <div className="sidebar">
        <Sidebar/>
      </div>
      <div className="data-panel">
        <DataPanel/>
      </div>
    </div>
  )
}

export default App
