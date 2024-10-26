import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  
  const navigate = useNavigate()

  return (
    <div className="h-screen w-screen flex bg-purple-900 justify-center pt-[20%] relative">
      <div>
          <h1 className="flex justify-center text-8xl text-lime-500 font-bold tracking-widest p-6">CYBERCRITTERS</h1>
          <div className="flex justify-center">
            <button className="bg-lime-500 border border-white text-purple-900 text-3xl font-bold tracking-widest p-4 m-4" onClick={() => navigate("/game")}> START GAME </button>
          </div>
        </div>
    </div>
  )
}

export default Home