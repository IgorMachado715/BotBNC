//valida o login efetuado
export function doLogin(email, password) {
    return new Promise((response, reject) => {
        if (email === 'igor@gmail.com'
            && password === 'botigor123') {
            response(true);
        }
        reject('Email e/ou senha inválido(s)!');
    })
}

export function doLogout() {

}