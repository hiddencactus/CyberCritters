import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5173', // Replace with your server URL if necessary
    headers: {
        'Content-Type': 'application/json',
    },
});

export const startGame = async () => {
    const response = await axiosInstance.post('/start-game');
    return response.data;
};

export const makeChoice = async (choice) => {
    const response = await axiosInstance.post('/make-choice', { choice });
    return response.data;
};

export const getChoices = async () => {
    const response = await axiosInstance.get('/choices');
    return response.data;
};