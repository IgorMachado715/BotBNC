import axios from 'axios';

axios.interceptors.response.use(
    response => response,
    error => {
        if(error.response.status === 401){
            console.error(`Redirecionado para o Login por 401!`);
            window.location = '/';
        }
        else
            return Promise.reject(error);
    }
)

export default axios;