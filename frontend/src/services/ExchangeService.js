import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

//valida o login efetuado
export async function getBalance(token) {
    const balanceUrl = `${API_URL}/exchange/balance`;
    const headers = {
        'authorization': token 
    }
    const response = await axios.get(balanceUrl, { headers });
    return response.data;
}

