import React, { useEffect, useState, useRef } from "react";
import { getSettings, updateSettings } from '../../services/SettingsService';
import Menu from "../../components/menu/Menu";
import Symbols from "./Symbols";
import Footer from "../../components/Footer/Footer";


function Settings() {

    const inputEmail = useRef('');
    const inputNewPassword = useRef('');
    const inputConfirmPassword = useRef('');
    const inputApiUrl = useRef('');
    const inputStreamUrl = useRef('');
    const inputAccessKey = useRef('');
    const inputSecretKey = useRef('');

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');

    useEffect(() => {

        const token = localStorage.getItem("token");

        getSettings(token)
            .then(settings => {
                inputEmail.current.value = settings.email;
                inputApiUrl.current.value = settings.apiUrl;
                inputStreamUrl.current.value = settings.streamUrl;
                inputAccessKey.current.value = settings.accessKey;
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })

    }, [])

    function onFormSubmit(event) {
        event.preventDefault();

        if ((inputNewPassword.current.value || inputConfirmPassword.current.value)
            && inputNewPassword.current.value !== inputConfirmPassword.current.value) {
            return setError(`Os campos Nova Senha e Confirme sua Senha devem ser iguais.`);
        }

        const token = localStorage.getItem('token');
        updateSettings({
            email: inputEmail.current.value,
            password: inputNewPassword.current.value ? inputNewPassword.current.value : null,
            apiUrl: inputApiUrl.current.value,
            streamUrl: inputStreamUrl.current.value,
            accessKey: inputAccessKey.current.value,
            secretKey: inputSecretKey.current.value ? inputSecretKey.current.value : null,
        }, token)
            .then(result => {
                if (result) {
                    setError('');
                    setSuccess(`Configurações atualizadas com sucesso!`);
                    inputSecretKey.current.value = '';
                    inputNewPassword.current.value = '';
                    inputConfirmPassword.current.value = '';
                } else {
                    setSuccess('');
                    setError(`Não foi possível atualizar as configurações`);
                }
            })
            .catch(error => {
                setSuccess('');
                console.error(error.response ? error.response.data : error.message);
                setError(`Não foi possível atualizar as configurações`);
            })
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h1 className="h4">Configurações</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <h2 className="h5 mb-4">Informações gerais</h2>
                            <form onSubmit={onFormSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input ref={inputEmail} className="form-control" id="email" type="email" placeholder="example@company.com" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div>
                                            <label htmlFor="newPassword">Nova senha</label>
                                            <input ref={inputNewPassword} className="form-control" id="password" type="password" placeholder="Insira sua nova senha" required />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div>
                                            <label htmlFor="confirmPassword">Confirme sua senha</label>
                                            <input ref={inputConfirmPassword} className="form-control" id="confirmPassword" type="password" placeholder="Insira sua nova senha novamente" required />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="h5 my-4">Informações da Exchange</h2>
                                <div className="row">
                                    <div className="col-sm-12 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="apiUrl">API URL</label>
                                            <input ref={inputApiUrl} className="form-control" id="apiUrl" type="text" placeholder="Insira a API URL" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="streamUrl">STREAM URL</label>
                                            <input ref={inputStreamUrl} className="form-control" id="streamUrl" type="text" placeholder="Insira a STREAM URL" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="accessKey">Chave de Acesso</label>
                                            <input ref={inputAccessKey} className="form-control" id="accessKey" type="text" placeholder="Insira a chave de acesso" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="secretKey">Nova Chave Secreta</label>
                                            <input ref={inputSecretKey} className="form-control" id="secretKey" type="password" placeholder="Insira a chave secreta" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap">
                                        <div className="col-sm-3">
                                            <button class="btn btn-gray-800 mt-2 animate-up-2" type="submit">Salvar</button>
                                        </div>
                                        {
                                            error ?
                                                <div className="alert alert-danger mt-2 col-9 py-2">{error}</div>
                                                : <React.Fragment></React.Fragment>
                                        }
                                        {
                                            success ?
                                                <div className="alert alert-success mt-2 col-9 py-2">{success}</div>
                                                : <React.Fragment></React.Fragment>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Symbols />
                <Footer/>
            </main>
        </React.Fragment>
    )
}

export default Settings;   