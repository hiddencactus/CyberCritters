import React from 'react'
import ActionButton from '../components/ActionButton.jsx'

function Game() {
  return (
    <div>
      Game
      <div>
          <ActionButton name="Option 1" text="Option 1 text" />
          <ActionButton name="Option 2" text="Option 2 text" />
        </div>
    </div>
  )
}

export default Game