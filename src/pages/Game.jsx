import React, { useEffect, useState } from 'react';
import { startGame, makeChoice } from '../services/gameService';
import '../styles/Game.css'; // Adjust the path as needed
import narratorImage1 from '../images/narrator1.jpg'; // First image
import narratorImage2 from '../images/narrator2.jpg'; // Second image
import narratorImage3 from '../images/narrator3.jpg'; // Third image

function Game() {
    const narratorImages = [narratorImage1, narratorImage2, narratorImage3]; // Array of images
    const [story, setStory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [choices, setChoices] = useState([]);
    const [selectedImage, setSelectedImage] = useState([narratorImage1]); // Default image
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameEnded, setIsGameEnded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Function to start the game
    const handleStartGame = async () => {
        setIsLoading(true);
        try {
            const data = await startGame();
            setStory(data.story);
            setImageUrl(data.imageUrl);
            setChoices(data.choices);
            setIsGameStarted(true);
            setIsGameEnded(false);

            // Randomly select a narrator image when starting the game
            const randomIndex = Math.floor(Math.random() * narratorImages.length);
            setSelectedImage(narratorImages[randomIndex]);
        } catch (error) {
            console.error('Error starting the game:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle user choice
    const handleMakeChoice = async (choice) => {
        setIsLoading(true);
        try {
            const data = await makeChoice(choice);
            setStory(data.story);
            setImageUrl(data.imageUrl);
            setChoices(data.choices);

            // Check if the game has ended
            if (data.message === "You've reached the end of the adventure!") {
                setIsGameEnded(true);
            }
        } catch (error) {
            console.error('Error making a choice:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to reset the game
    const handlePlayAgain = () => {
        setChoices([]);
        handleStartGame();
    };

    // Function to go to the main menu
    const handleGoToMainMenu = () => {
        setIsGameStarted(false);
        setStory('');
        setImageUrl('');
        setChoices([]);
        setIsGameEnded(false);
        // Optionally, reset the selected image here if you want to change it when going back to the main menu
    };

    return (
        <div className="h-screen w-screen bg-purple-900">
            {/* Narrator Profile Box with Story Text */}
            <div className="flex justify-center">
                <div className="bg-amber-600 border-8 border-purple-900 p-4 flex items-start">
                    <img src={selectedImage} alt="Narrator" className="w-16 h-16 rounded-full mx-4" />
                    <p className="text-white text-lg">{story.split(/Option/i)[0].trim()}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center mt-10">
                    <p className="text-3xl font-bold text-lime-500 mt-10">Writing story... Please wait.</p>
                </div>
            ) : isGameEnded ? (
                <div className="flex display-center justify-center items-end">
                    {imageUrl && <img className="w-[25%] p-8" src={imageUrl} alt="Story Illustration" />}
                    <button className="button bg-lime-500 text-purple-900 text-xl font-bold tracking-wider mt-5 ml-9 items-end" onClick={handlePlayAgain}>PLAY AGAIN</button>
                    <button className="button bg-lime-500 text-purple-900 text-xl font-bold tracking-wider mt-5 ml-9 items-end" onClick={handleGoToMainMenu}>MAIN MENU</button>
                </div>
            ) : isGameStarted ? (
                <>
                    <div className="flex display-center justify-center">
                        {imageUrl && <img className="w-[25%] p-18 mt-12" src={imageUrl} alt="Story Illustration" />}
                    </div>
                    <div className="flex display-center justify-center absolute bottom-8">
                        {choices.map((choice, index) => (
                            <button
                                className="button bg-lime-500 text-purple-900 text-xl font-bold mt-10 mx-8"
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
                        <h1 className="flex justify-center text-8xl text-lime-500 font-bold tracking-widest pt-40">CYBERCRITTERS</h1>
                        <div className="flex justify-center mt-10">
                            <button className="button bg-lime-500 text-purple-900 text-3xl font-bold tracking-widest" onClick={handleStartGame}>START GAME</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;