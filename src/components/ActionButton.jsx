import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ActionButton({ name, text }) {
  
  const [temp, setTemp] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {

  }, [temp])

  const handleClick = async () => {
    navigate("/")
  }

  return (
    <div className="border border-black" onClick={handleClick}>
        {name}
        {text}
    </div>
  )
}

export default ActionButton