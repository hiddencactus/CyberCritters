import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Game from './pages/Game.jsx'

function App() {
  var a = 3 + 4

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />}/>
          <Route exact path="/game" element={<Game />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
