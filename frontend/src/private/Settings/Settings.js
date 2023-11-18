import React, { useEffect, useState, useRef } from "react";
import { getSettings, updateSettings } from '../../services/SettingsService';
import Menu from "../../components/menu/Menu";
import Symbols from "./Symbols";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/Toast/Toast";

function Settings() {

    const inputConfirmPassword = useRef('');

    const [settings, setSettings] = useState({});

    const [error, setError] = useState('');

    const [success, setSuccess] = useState('');

    const [notification, setNotification] = useState({ type: '', text: '' });

    useEffect(() => {

        const token = localStorage.getItem("token");

        getSettings(token)
            .then(settings =>{
                delete settings.password;
                delete settings.secretKey;
                 setSettings(settings)
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            })
    }, [])

    function onInputChange(event) {
        setSettings(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function onFormSubmit(event) {

        if ((settings.password || inputConfirmPassword.current.value)
            && settings.password !== inputConfirmPassword.current.value) {
            return setNotification({ type: 'error', text: `Os campos Nova Senha e Confirme sua Senha devem ser iguais.` });
        }

        const token = localStorage.getItem('token');
        updateSettings(settings, token)
            .then(result => {
                if (result) {
                    setNotification({ type: 'success', text: `Configurações atualizadas com sucesso!` });
                } else {
                    setNotification({ type: 'error', text: `Não foi possível atualizar as configurações` });
                }
            })
            .catch(error => {
                console.error(error.response ? error.response.data : error.message);
                setNotification({ type: 'error', text: `Não foi possível atualizar as configurações` });
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
                            <h2 className="h5 mb-4">Configurações Pessoais</h2>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input className="form-control" id="email" type="email" placeholder="example@company.com" defaultValue={settings.email} onChange={onInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="email">Telefone</label>
                                        <input className="form-control" id="phone" type="tel" placeholder="+5519000000000" defaultValue={settings.phone} onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div>
                                        <label htmlFor="newPassword">Nova senha</label>
                                        <input className="form-control" id="password" type="password" placeholder="Insira sua nova senha" onChange={onInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div>
                                        <label htmlFor="confirmPassword">Confirme sua senha</label>
                                        <input ref={inputConfirmPassword} className="form-control" id="confirmPassword" type="password" placeholder="Insira sua nova senha novamente" required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap">
                                    <div className="col-sm-3">
                                        <button class="btn btn-gray-800 mt-2 animate-up-2" type="submit" onClick={onFormSubmit}>Salvar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <h2 className="h5 my-4">Configurações de Alertas</h2>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="sendGridKey">Chave API SendGrid</label>
                                        <input className="form-control" id="sendGridKey" type="password" placeholder="Insira a chave Api SendGrid" defaultValue={settings.sendGridKey} onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="twilioPhone">Twilio Telefone</label>
                                        <input className="form-control" id="twilioPhone" type="tel" placeholder="+55519000000" defaultValue={settings.twilioPhone} onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="accessKey">Twilio SID</label>
                                        <input className="form-control" id="twilioSid" type="text" placeholder="Insira a SID Twilio" defaultValue={settings.twilioSid} onChange={onInputChange} required />
                                    </div>
                                </div>
                                <div className="col-sm-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="secretKey">Twilio Token</label>
                                        <input className="form-control" id="twilioToken" type="password" placeholder="Insira a senha Twilio" defaultValue={settings.twilioToken} onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap">
                                    <div className="col-sm-3">
                                        <button class="btn btn-gray-800 mt-2 animate-up-2" type="submit" onClick={onFormSubmit}>Salvar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card card-body border-0 shadow mb-4">
                            <h2 className="h5 my-4">Configuraões da Exchange</h2>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="apiUrl">API URL</label>
                                        <input className="form-control" id="apiUrl" type="text" placeholder="Insira a API URL" defaultValue={settings.apiUrl} onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="streamUrl">STREAM URL</label>
                                        <input className="form-control" id="streamUrl" type="text" placeholder="Insira a STREAM URL" defaultValue={settings.streamUrl} onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="accessKey">Chave de Acesso</label>
                                        <input className="form-control" id="accessKey" type="text" placeholder="Insira a chave de acesso" defaultValue={settings.accessKey} onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="secretKey">Nova Chave Secreta</label>
                                        <input className="form-control" id="secretKey" type="password" placeholder="Insira a chave secreta" onChange={onInputChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap">
                                    <div className="col-sm-3">
                                        <button class="btn btn-gray-800 mt-2 animate-up-2" type="submit" onClick={onFormSubmit}>Salvar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Symbols />
                <Footer />
            </main>
            <Toast type={notification.type} text={notification.text} />
        </React.Fragment>
    )
}

export default Settings;   