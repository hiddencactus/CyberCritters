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
        setChoices([]); // Reset choices
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
        <div className="h-screen w-screen bg-purple-900">
            <h1 className="flex justify-center text-8xl text-lime-500 font-bold tracking-widest pt-12">CYBERCRITTERS</h1>
            {isGameEnded ? (
                <div>
                    <p className="text-3xl p-8 pt-8">{story}</p>
                    {imageUrl && <img className="w-[25%] p-8" src={imageUrl} alt="Story Illustration" />}
                    <button className="bg-lime-500 border border-white text-purple-900 text-2xl font-bold mt-5 ml-8" onClick={handlePlayAgain}>Play Again</button>
                    <button className="bg-lime-500 border border-white text-purple-900 text-2xl font-bold mt-5 ml-8" onClick={handleGoToMainMenu}>Main Menu</button>
                </div>
            ) : isGameStarted ? (
                <>
                    <p className="text-3xl p-8 pt-8">{story}</p>
                    <div className="flex display-center justify-center">
                        {imageUrl && <img className="w-[25%] p-8" src={imageUrl} alt="Story Illustration" />}
                    </div>
                    <div className="flex display-center justify-center">
                        {choices.map((choice, index) => (
                            <button className="bg-lime-500 border border-white text-purple-900 text-2xl font-bold mt-8 mx-8" key={index} onClick={() => handleMakeChoice(choice)}>
                                {choice}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex display-center justify-center">
                    <button className="bg-lime-500 border border-white text-purple-900 text-3xl font-bold tracking-widest mt-10" onClick={handleStartGame}>START GAME</button>
                </div>
            )}
        </div>
    );
}

export default Game;