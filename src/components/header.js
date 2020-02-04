import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-head">Elite Jinzai Marketing Services Inc.,</h1>
        <p className="App-address">Unit 4th flr., Cypress gardens, 112 V.A. Rufino st, Legazpi Vill., Makati</p>
        <form className="App-form">
          <div className="App-label"> 
            <input className="App-input" type="text" name="username" placeholder="Username" /><br/>
            <hr className="App-hr" />
            <input className="App-input" type="text" name="password" placeholder="Password" />
          </div>
          <p className="App-forgot">Forgot your password?</p>
          <input className="App-submit" type="submit" value="Log In" /><br/>
          <a href="#" className="App-non">Forgot your password?</a>
        </form>
      </header>
    </div>
  );
}

export default App;

import React  from 'react';
import logo from './logo.svg';
import "./App.css";
import Home from './Home';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
function Home() {
  return (
      <div>
        <h1>Welcome to my Website</h1>
      </div>
  );
}

export default Home;