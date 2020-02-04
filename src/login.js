import React from 'react';
import logo from './logo.svg';
import './login.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <body>
        <h1>CODES</h1>
        <p>Store Code: { Math.random() }</p>
        <form>
          <label>
            PS Code: 
            <input type="text" name="ps_code" />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <hr/>
        <h1>TRANSACTION</h1>
        <hr/>

      </body>
    </div>
  );
}

export default App;