import logo from './logo.svg';
import './App.css';

function App(){
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Bot consumidor de exchanges
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    Learn react
                    </a>
            </header>
        </div>
    );
}

export default App;