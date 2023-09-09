import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { doLogin } from "../../services/AuthServices";

//tela login
function Login() {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function onChangeInput(event) {
        if (event.target.id === 'email')
            setEmail(event.target.value);
        else
            setPassword(event.target.value);
    }

    function onSubmit(event) {
        event.preventDefault();
        doLogin(email, password)
            .then(response => {
                if (response)
                    localStorage.setItem('token', response.token);
                    history.push('/settings');
            })
            .catch(err => {
                console.error(err);
                setError(`Usuário e/ou senha inválidos!`);
            })

    }

    return (
        <main>
            <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
                <div className="container">
                    <p className="text-center">
                        <Link to="/" className="d-flex align-items-center justify-content-center">
                            <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                            </svg>
                            Voltar para a página inicial
                        </Link>
                    </p>
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center">
                                <img src="/img/favicon/mstile-150x150.gif" alt="Bot Trader" width={100} />
                            </div>
                            <div className="text-center text-md-center mb-4 mt-md-0">
                                <h1 className="mb-0 h3">Faça login para entrar na plataforma</h1>
                            </div>
                            <form action="#" className="mt-4" onSubmit={onSubmit}>
                                <div className="form-group mb-4">
                                    <label for="email">Insira seu Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="basic-addon1">
                                            <svg className="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                                        </span>
                                        <input type="email" className="form-control" placeholder="example@company.com" id="email" autofocus required onChange={onChangeInput} />
                                    </div>
                                    <div className="form-group">
                                        <div className="form-group mb-4">
                                            <label htmlFor="password">Insira sua Senha</label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="basic-addon2">
                                                    <svg className="icon icon-xs text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                                                </span>
                                                <input type="password" placeholder="Password" className="form-control" id="password" required onChange={onChangeInput} />
                                            </div>

                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-between align-items-top mb-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="remember" />
                                            <label className="form-check-label mb-0" for="remember">
                                                Lembrar-me
                                            </label>
                                        </div>
                                        <div><a href="./forgot-password.html" className="small text-right">Esqueceu sua senha?</a></div>
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" class="btn btn-gray-800">Fazer Login</button>
                                    </div>
                                    {
                                        error ?
                                            <div className="alert alert-danger mt-2">{error}</div>
                                            : <React.Fragment></React.Fragment>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </main>)
}

export default Login;