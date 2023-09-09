import React, { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { getSettings } from '../../services/SettingsService';
import { doLogout } from "../../services/AuthServices";



function Settings() {

    const history = useHistory();

    const [error, setError] = useState('');

    const [settings, setSettings] = useState({
        email: '',
        apiUrl: '',
        accessKey: '',
        keySecret: ''
    })

    useEffect(() => {

        const token = localStorage.getItem("token");

        getSettings(token)
            .then(response => {
                setSettings(response);
            })
            .catch(err => {
                if (err.response && err.response.status === 401)
                    return history.push('/');

                if (err.response)
                    setError(err.response.data);
                else
                    setError(err.message);
            })

    }, [])

    function onLogoutClick(event) {
        const token = localStorage.getItem('token');

        doLogout(token)
        .then(response => {
            localStorage.removeItem('token');
            history.push('/');
        })
        .catch(err => {
            setError(err.message);
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
                            {settings.email}
                        </Link>
                        <button type="button" className="btn btn-primary" onClick={onLogoutClick}>logout</button>
                        {
                            error
                                ? <div className="alert alert-danger">{error}</div>
                                : <React.Fragment></React.Fragment>
                        }
                    </p>
                </div>
            </section>

        </main>)
}

export default Settings;   