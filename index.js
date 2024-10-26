import 'dotenv/config'; // Import and configure dotenv
import inquirer from 'inquirer';
import axios from 'axios';

//start project using node index.js
// Replace with your OpenAI API key
const OPENAI_API_KEY = `${process.env.OPENAI_API_KEY}`;
console.log(process.env.OPENAI_API_KEY);

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
      console.log(`Generated image: ${response.data.data[0].url}`);
    } catch (error) {
      if (error.response) {
        console.error('Error details:', error.response.data); // Logs more specific error details
      } else {
        console.error('Error generating image:', error);
      }
    }
  }

// Main game function
async function startGame() {
  let description = "Max and Lily begin their journey in the digital land of Cyberville, a vibrant world with glowing neon pathways, where every click opens a new adventure. They soon learn that Cyberville isn’t just filled with wonders—it's also full of online mysteries and hidden safety lessons. As they travel, they encounter friendly guides who teach them to protect their personal information, recognize trustworthy websites, and avoid suspicious links. Along the way, Max and Lily discover that exploring Cyberville responsibly means staying safe and helping others in the digital world.";
  let stage = "start";

  let cnt = 0
  while (stage !== "end") {
    cnt += 1;
    //console.log(`\nCurrent scene: ${description}`);
    //await generateImage(description);    //UNCOMMENT WHEN YOU NEED IT

    // Generate the next part of the story and choices based on the previous description and user choice
    if(cnt != 10){
        const storyText = await generateStoryAndChoices(description, 'Start the journey', cnt);

        // Split the generated text to extract the new story and the choices
        const lines = await storyText.split('\n').filter(line => line);
        description = await lines[0]; // Update description with the next part of the story

        let choices = []
        for(let i = 0; i < lines.length; i++){
            if(lines[i].includes("1")){
                choices.push(lines[i])
            }else if(lines[i].includes("2")){
                choices.push(lines[i])
            }
        }

        //const choices = await correctLines.slice(lines.length-2, lines.length); // Extract two choices for the next decision
    
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
    }else{
        const storyText = await finalGenerateStoryAndChoices(description, 'end the journey', cnt);

        console.log("You've reached the end of the adventure!");
        stage = "end";
        break;
    }
  }
}

// Start the game

startGame();