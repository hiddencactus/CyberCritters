import React, { useEffect, useState } from 'react';
import { startGame, makeChoice } from '../services/gameService';

function Game() {
    const [story, setStory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [choices, setChoices] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameEnded, setIsGameEnded] = useState(false); // Track if the game has ended

    // Function to start the game
    const handleStartGame = async () => {
        try {
            const data = await startGame();
            setStory(data.story);
            setImageUrl(data.imageUrl);
            setChoices(data.choices);
            setIsGameStarted(true);
            setIsGameEnded(false); // Reset game ended state
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

            // Check if the game has ended
            if (data.message === "You've reached the end of the adventure!") {
                setIsGameEnded(true); // Set game ended state
            }
        } catch (error) {
            console.error('Error making a choice:', error);
        }
    };

    // Function to reset the game
    const handlePlayAgain = () => {
        handleStartGame();
    };

    // Function to go to the main menu
    const handleGoToMainMenu = () => {
        setIsGameStarted(false); // Reset game started state
        setStory(''); // Reset story
        setImageUrl(''); // Reset image URL
        setChoices([]); // Reset choices
        setIsGameEnded(false); // Reset game ended state
    };

    return (
        <div>
            <h1>Cyberville Adventure</h1>
            {isGameEnded ? (
                <div>
                    <p>{story}</p>
                    {imageUrl && <img src={imageUrl} alt="Story Illustration" />}
                    <button onClick={handlePlayAgain}>Play Again</button>
                    <button onClick={handleGoToMainMenu}>Main Menu</button>
                </div>
            ) : isGameStarted ? (
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
                <button onClick={handleStartGame}>Start Game</button>
            )}
        </div>
    );
}

export default Game;

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