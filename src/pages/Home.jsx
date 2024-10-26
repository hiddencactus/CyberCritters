import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  
  const navigate = useNavigate()

  return (
    <div>
        <div className="border border-black" onClick={() => navigate("/game")}>
            Cyber Critters
        </div>
    </div>
  )
}

export default Home