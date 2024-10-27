import React, { useEffect, useState } from 'react';
import { startGame, makeChoice } from '../services/gameService';

function Game() {
    const [story, setStory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [choices, setChoices] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false); // State to track if the game has started

    // Function to start the game
    const handleStartGame = async () => {
        try {
            const data = await startGame();
            setStory(data.story);
            setImageUrl(data.imageUrl);
            setChoices(data.choices);
            setIsGameStarted(true); // Set the game as started
        } catch (error) {
            console.error('Error starting the game:', error);
        }
    };

    // Function to handle user choice
    const handleMakeChoice = async (choice) => {
        try {
            const data = await makeChoice(choice);
            setStory(data.story);
            setImageUrl(data.imageUrl);
            setChoices(data.choices);
        } catch (error) {
            console.error('Error making a choice:', error);
        }
    };

    useEffect(() => {
        // Start the game when component mounts if needed or controlled by a button click
    }, []);

    return (
        <div>
            <h1>Cyberville Adventure</h1>
            {isGameStarted ? ( // Check if the game has started
                <>
                    <p>{story}</p>
                    {imageUrl && <img src={imageUrl} alt="Story Illustration" />}
                    <div>
                        {choices.map((choice, index) => (
                            <button key={index} onClick={() => handleMakeChoice(choice)}>
                                {choice}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                // Button to start the game
                <button onClick={handleStartGame}>Start Game</button>
            )}
        </div>
    );
}

export default Game

// import React from 'react'
// import ActionButton from '../components/ActionButton.jsx'

// function Game() {
//   return (
//     <div>
//       Game
//       <div>
//           <ActionButton name="Option 1" text="Option 1 text" />
//           <ActionButton name="Option 2" text="Option 2 text" />
//         </div>
//     </div>
//   )
// }

// export default Game