import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import Homepage from './Pages/Homepage/Homepage';
import Collections from './Pages/Collections/Collections';
import Search from './Pages/Search/Search';
import Login from './Pages/Login/Login';
import Profile from "./Pages/Profile/Profile";
import SignUp from "./Pages/Login/Signup";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <header>
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-title">TCTracker</h1>
            <nav className="navbar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/search">Card Search</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link className="login-button" onClick={() => setShowLogin(true)}>Login</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/api/login" element={<Login />} />
        <Route path="/api/signup" element={<SignUp />} />
      </Routes>
      {showLogin && <Login closePopup={() => setShowLogin(false)} />}
    </Router>
  );
}

export default App;