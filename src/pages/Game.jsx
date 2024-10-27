import React, { useEffect, useState } from 'react';
import { startGame, makeChoice } from '../services/gameService';
import '../styles/Game.css'; // Adjust the path as needed

function Game() {
    const [story, setStory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [choices, setChoices] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameEnded, setIsGameEnded] = useState(false); // Track if the game has ended
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Function to start the game
    const handleStartGame = async () => {
        setIsLoading(true); // Set loading state
        try {
            const data = await startGame();
            setStory(data.story);
            setImageUrl(data.imageUrl);
            setChoices(data.choices);
            setIsGameStarted(true);
            setIsGameEnded(false); // Reset game ended state
        } catch (error) {
            console.error('Error starting the game:', error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Function to handle user choice
    const handleMakeChoice = async (choice) => {
        setIsLoading(true); // Set loading state
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
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Function to reset the game
    const handlePlayAgain = () => {
        setIsGameStarted(false); // Reset game started state
        setStory(''); // Reset story
        setImageUrl(''); // Reset image URL
        setChoices([]); // Reset choices
        setIsGameEnded(false); // Reset game ended state
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
            {/* <h1 className="flex justify-center text-8xl text-lime-500 font-bold tracking-widest pt-12">CYBERCRITTERS</h1> */}
            {isLoading ? ( // Conditional rendering for loading state
                <div className="flex justify-center">
                    <p className="text-3xl font-bold text-lime-500 mt-10">Loading... Please wait.</p>
                </div>
            ) : isGameEnded ? (
                <div>
                    <p className="text-2xl p-8 pt-8">{story.split(/Option/i)[0].trim()} {/* Remove "Option" and everything that follows */}
                    </p>
                    {imageUrl && <img className="w-[25%] p-8" src={imageUrl} alt="Story Illustration" />}
                    <div className="flex display-center justify-center">
                        <button className="button bg-lime-500 text-purple-900 text-xl font-bold tracking-wider mt-3 ml-8" onClick={handlePlayAgain}>PLAY AGAIN</button>
                        <button className="button bg-lime-500 text-purple-900 text-xl font-bold tracking-wider mt-3 ml-8" onClick={handleGoToMainMenu}>MAIN MENU</button>
                    </div>
                </div>
            ) : isGameStarted ? (
                <>
                    <p className="text-white text-2xl p-8 pt-4">{story.split(/Option/i)[0].trim()}{/* Remove "Option" and everything that follows */}
                    </p>
                    <div className="flex display-center justify-center">
                        {imageUrl && <img className="w-[25%]" src={imageUrl} alt="Story Illustration" />}
                    </div>
                    <div className="flex display-center justify-center">
                        {choices.map((choice, index) => (
                            <button
                                className="button bg-lime-500 text-purple-900 text-xl font-bold mt-8 mx-8"
                                key={index}
                                onClick={() => handleMakeChoice(choice)}
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex display-center justify-center">
                    <div>
                        <h1 className="flex justify-center text-8xl text-lime-500 font-bold tracking-widest pt-12">CYBERCRITTERS</h1>
                        <div className="flex justify-center">
                            <button className="button bg-lime-500 text-purple-900 text-3xl font-bold tracking-widest mt-10" onClick={handleStartGame}>START GAME</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;