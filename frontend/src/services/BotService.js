import axios from './BaseServices';

const API_URL = process.env.REACT_APP_API_URL;
const BOT_URL = `${API_URL}/bot/`;

//valida o login efetuado
export async function getIndexes(token) {
    const indexesUrl = `${BOT_URL}memory/indexes`;
    const headers = {
        'authorization': token 
    }
    const response = await axios.get(indexesUrl, { headers });
    return response.data;
}

export async function getMemoryIndex(symbol, index, interval, token) {
    const indexesUrl = `${BOT_URL}memory/${symbol}/${index}/${interval}`;
    const headers = {
        'authorization': token 
    }
    const response = await axios.get(indexesUrl, { headers });
    return response.data;
}

export async function getAnalysisIndexes(token) {
    const analysisUrl = `${BOT_URL}analysis/`;
    const headers = {
        'authorization': token 
    }
    const response = await axios.get(analysisUrl, { headers });
    return response.data;
}

