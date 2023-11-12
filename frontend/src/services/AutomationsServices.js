import axios from './BaseServices';

const API_URL = process.env.REACT_APP_API_URL;
const AUTOMATIONS_URL = `${API_URL}/automations/`;

//valida o login efetuado
export async function getAutomations(page, token) {
    const automationsUrl = `${AUTOMATIONS_URL}?page=${page}`;
    const headers = {'authorization': token}
    const response = await axios.get(automationsUrl, { headers });
    return response.data; //{count, rows}
}

export async function saveAutomation(id, newAutomation, token){
    const headers = {'authorization': token}
    let response;
    if(id)
        response = await axios.patch(`${AUTOMATIONS_URL}${id}`, newAutomation, {headers}); 
    else
        response = await axios.post(AUTOMATIONS_URL, newAutomation, {headers});
    return response.data; 
}

export async function startAutomation(id, token){
    const headers = {'authorization': token}
    const response = await axios.post(`${AUTOMATIONS_URL}${id}/start`, {}, {headers});
    return response.data;
}

export async function stopAutomation(id, token){
    const headers = {'authorization': token}
    const response = await axios.post(`${AUTOMATIONS_URL}${id}/stop`, {}, {headers});
    return response.data;
}

export async function deleteAutomation(id, token){
    const headers = {'authorization': token}
    const response = await axios.delete(`${AUTOMATIONS_URL}${id}`, {headers});
    return response.data;
}