import express from 'express';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import axios from 'axios';

dotenv.config(); 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware to parse JSON requests
app.use(express.json());

// Initialize game state
let gameState = {
  description: "Max and Lily begin their journey in the digital land of Cyberville, a vibrant world with glowing neon pathways, where every click opens a new adventure. They soon learn that Cyberville isn’t just filled with wonders—it's also full of online mysteries and hidden safety lessons. As they travel, they encounter friendly guides who teach them to protect their personal information, recognize trustworthy websites, and avoid suspicious links. Along the way, Max and Lily discover that exploring Cyberville responsibly means staying safe and helping others in the digital world.",
  cnt: 0,
  choices: [],
};

async function finalGenerateStoryAndChoices(description, choice, priorGenerationAmount) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: "You are a creative storyteller. " },
                    { role: 'user', content: `The adventure story so far: ${description}\nUser chose: "${choice}".\nWrite the final prompt of the story, bringing it to an end in a satisfying manner."` }
                ],
                max_tokens: 400,
                temperature: 0.7,
                n: 1,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
    
        if (response.data.choices && response.data.choices.length > 0) {
          const generatedTextResponse = await response.data.choices[0].message; //need the await for the console.log
          console.log(`Generated story and choices: ${generatedTextResponse.content}`);
          return generatedTextResponse.content;
        } else {
          throw new Error('No choices were returned from the OpenAI API.');
        }
      } catch (error) {
        console.error('Error generating story and choices:', error.response ? error.response.data : error.message);
      }
    
}


// Function to generate story and choices using OpenAI's API
async function generateStoryAndChoices(description, choice, priorGenerationAmount) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: "You are a creative storyteller, teaching children a lesson about cyber safety (viruses, hackers, passwords). You must conclude the story after 7 prompts. There have already been ${priorGenerationAmount} ai-generated prompts." },
                    { role: 'user', content: `The adventure story so far: ${description}\nUser chose: "${choice}".\nWrite the next part of the story based on this choice. Provide two realistic, story-relevant options for what the characters could do next. Note that this is intended for children. The story should conclude after 10 prompts. There have already been ${priorGenerationAmount} ai-generated prompts. The resolution should include the phrase "end of the adventure". Ensure that the options start with "Option 1" and "Option 2."` }
                ],
                max_tokens: 200,
                temperature: 0.7,
                n: 1,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
    
        if (response.data.choices && response.data.choices.length > 0) {
          const generatedTextResponse = await response.data.choices[0].message; //need the await for the console.log
          console.log(`Generated story and choices: ${generatedTextResponse.content}`);
          return generatedTextResponse.content;
        } else {
          throw new Error('No choices were returned from the OpenAI API.');
        }
      } catch (error) {
        console.error('Error generating story and choices:', error.response ? error.response.data : error.message);
      }
    
}

// Generate an image based on the generated prompt
async function generateImage(prompt) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            { prompt, n: 1, size: '1024x1024' },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
        );
        const imageUrl = response.data.data[0].url;
        console.log(`Generated image: ${imageUrl}`);
        return imageUrl; // Return the generated image URL
    } catch (error) {
        if (error.response) {
            console.error('Error details:', error.response.data); // Logs more specific error details
        } else {
            console.error('Error generating image:', error);
        }
    }
}

// Endpoint to start the game
app.post('/start-game', async (req, res) => {
    gameState.description = "Max and Lily begin their journey in the digital land of Cyberville, a vibrant world with glowing neon pathways, where every click opens a new adventure...";
    gameState.choices = []; // Clear previous choices
  
    try {
      const storyText = await generateStoryAndChoices(gameState.description, 'Start the journey', 0);
      gameState.description = storyText;
  
      const imageUrl = await generateImage(gameState.description); // Generate an image based on the story
      const choices = gameState.choices; // Get current choices (if any)
      
      res.json({ story: gameState.description, choices, imageUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start game' });
    }
});
  
// Endpoint to get the choices after generating text
app.get('/choices', (req, res) => {
    res.json({ story: gameState.description, choices: gameState.choices });
});
  
// Endpoint to handle user choice
app.post('/make-choice', async (req, res) => {
    const { choice } = req.body;
  
    try {
      gameState.choices.push(choice); // Save the user choice
  
      const storyText = await generateStoryAndChoices(gameState.description, choice, gameState.choices.length);
      gameState.description = storyText;
  
      const imageUrl = await generateImage(gameState.description); // Generate an image for the updated story
      const choices = gameState.choices; // Get updated choices
  
      res.json({ story: gameState.description, choices, imageUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process choice' });
    }
});
  
// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});  

// Function to extract choices from the generated story text
function extractChoicesFromStoryText(storyText) {
    const choices = [];
    const lines = storyText.split('\n');
  
    // Loop through lines to find options
    for (const line of lines) {
      if (line.startsWith('Option')) {
        // Trim the line and add it to choices
        choices.push(line.trim());
      }
    }
  
    return choices;
}

//-----------------------------------DELETE AFTER TESTING
async function testGameFlow() {
    try {
        // Start the game
        console.log('Starting game...');
        let firstPrompt = true;
        const startResponse = await axios.post(`http://localhost:${PORT}/start-game`);

        console.log('Initial Story:', startResponse.data.story);
        console.log('Image URL:', startResponse.data.imageUrl);

        // Assuming the generated story contains options in a specific format
        let generatedOptions = extractChoicesFromStoryText(startResponse.data.story); // Capture generated choices
        
      
        // Check if we have any choices to make
        if (generatedOptions.length > 0) {
            // Simulate a user choice from the generated options
            const userChoice = generatedOptions[0]; // Choose the first option for testing
            console.log('User choice:', userChoice);
    
            const choiceResponse = await axios.post(`http://localhost:${PORT}/make-choice`, { choice: userChoice });
            console.log('Updated Story:', choiceResponse.data.story);
            console.log('Updated Image URL:', choiceResponse.data.imageUrl);
        } else {
            console.log('No choices available to test.');
    }  

    // Function to handle user choice and update the game state
    async function makeChoice(choice) {
        console.log('User choice:', choice);  // Output user choice
        const choiceResponse = await axios.post(`http://localhost:${PORT}/make-choice`, { choice });
        console.log('Updated Story:', choiceResponse.data.story);
        console.log('Updated Image URL:', choiceResponse.data.imageUrl);
        return choiceResponse.data; // Return updated data for further processing
    }

    // While loop to continue the game until the end
    while (generatedOptions.length > 0) {
        // Simulate a user choice from the generated options
        const userChoice = generatedOptions[0]; // Choose the first option for testing
        
        // Make the choice and get the updated game state
        const updatedGameState = await makeChoice(userChoice);

        // Extract new options from the updated story
        generatedOptions = extractChoicesFromStoryText(updatedGameState.story);
    }
  
    } catch (error) {
      console.error('Error in test game flow:', error.response ? error.response.data : error.message);
    }
  }

testGameFlow();
//-----------------------------------------------------------------------------







// // Main game function
// async function startGame() {
//   let description = "Max and Lily begin their journey in the digital land of Cyberville, a vibrant world with glowing neon pathways, where every click opens a new adventure. They soon learn that Cyberville isn’t just filled with wonders—it's also full of online mysteries and hidden safety lessons. As they travel, they encounter friendly guides who teach them to protect their personal information, recognize trustworthy websites, and avoid suspicious links. Along the way, Max and Lily discover that exploring Cyberville responsibly means staying safe and helping others in the digital world.";
//   let stage = "start";

//   let cnt = 0
//   while (stage !== "end") {
//     cnt += 1;
//     //console.log(`\nCurrent scene: ${description}`);
//     //await generateImage(description);    //UNCOMMENT WHEN YOU NEED IT

//     // Generate the next part of the story and choices based on the previous description and user choice
//     if(cnt != 10){
//         const storyText = await generateStoryAndChoices(description, 'Start the journey', cnt);

//         // Split the generated text to extract the new story and the choices
//         const lines = await storyText.split('\n').filter(line => line);
//         description = await lines[0]; // Update description with the next part of the story

//         let choices = []
//         for(let i = 0; i < lines.length; i++){
//             if(lines[i].includes("1")){
//                 choices.push(lines[i])
//             }else if(lines[i].includes("2")){
//                 choices.push(lines[i])
//             }
//         }

//         //const choices = await correctLines.slice(lines.length-2, lines.length); // Extract two choices for the next decision
    
//         if (choices.length < 2 || storyText.includes("end of the adventure")) {
//             console.log("You've reached the end of the adventure!");
//             stage = "end";
//             break;
//         }

        
//         // Display choices and ask user to select one
//         const { choice } = await inquirer.prompt([
//             {
//             type: 'list',
//             name: 'choice',
//             message: 'What will Max and Lily do next?',
//             choices: choices.map((text, index) => ({ name: text, value: text }))
//             }
//         ]);
    
//         // Update description with the user's chosen option for the next turn
//         description += `\nUser chose: "${choice}".`;
//     }else{
//         const storyText = await finalGenerateStoryAndChoices(description, 'end the journey', cnt);

//         console.log("You've reached the end of the adventure!");
//         stage = "end";
//         break;
//     }
//   }
// }

// // Start the game

// startGame();