const inquirer = require('inquirer');
const axios = require('axios');

// Replace with your OpenAI API key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

// Function to generate story and choices using OpenAI's API
async function generateStoryAndChoices(description, choice) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `The adventure story so far: ${description}\nUser chose: "${choice}".\nWrite the next part of the story based on this choice. Provide two realistic, story-relevant options for what the characters could do next.`,
        max_tokens: 200,
        temperature: 0.7,
        stop: null,
        n: 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const generatedText = response.data.choices[0].text.trim();
    console.log(`Generated story and choices: ${generatedText}`);
    return generatedText;
  } catch (error) {
    console.error('Error generating story and choices:', error);
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
    console.log(`Generated image: ${response.data.data[0].url}`);
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

// Main game function
async function startGame() {
  let description = "Max and Lily begin their journey in the digital land of Cyberville, with neon pathways and a world of online mysteries.";
  let stage = "start";

  while (stage !== "end") {
    console.log(`\nCurrent scene: ${description}`);
    await generateImage(description);

    // Generate the next part of the story and choices based on the previous description and user choice
    const storyText = await generateStoryAndChoices(description, 'Start the journey');
    
    // Split the generated text to extract the new story and the choices
    const lines = storyText.split('\n').filter(line => line);
    description = lines[0]; // Update description with the next part of the story
    const choices = lines.slice(1, 3); // Extract two choices for the next decision
    
    if (choices.length < 2 || storyText.includes("end of the adventure")) {
      console.log("You've reached the end of the adventure!");
      stage = "end";
      break;
    }

    // Display choices and ask user to select one
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What will Max and Lily do next?',
        choices: choices.map((text, index) => ({ name: text, value: text }))
      }
    ]);

    // Update description with the user's chosen option for the next turn
    description += `\nUser chose: "${choice}".`;
  }
}

// Start the game
startGame();