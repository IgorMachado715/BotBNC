import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

//valida o login efetuado
export async function getSettings(token) {
    const settingsUrl = `${API_URL}/settings`;
    const headers = {
        'authorization': token 
    }
    const response = await axios.get(settingsUrl, { headers });
    return response.data;
}

