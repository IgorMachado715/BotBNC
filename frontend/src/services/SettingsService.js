import axios from './BaseServices';

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

export async function updateSettings(settings, token){
    const settingsUrl = `${API_URL}/settings`;
    const headers = {
        'authorization': token 
    }
    const response = await axios.patch(settingsUrl, settings, { headers });
    return response.data;
}