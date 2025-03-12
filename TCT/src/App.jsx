import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import Homepage from './Pages/Homepage/Homepage';
import Collections from './Pages/Collections/Collections';
import Search from './Pages/Search/Search';
import Login from './Pages/Login/Login';
import SignUp from "./Pages/Login/Signup";
import Profile from "./Pages/Profile/Profile";
import Content from "./Pages/Collections/Content";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
};

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
                {user ? (<>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link onClick={handleLogout}>Sign Out</Link></li></>
                ) : (
                  <li><Link onClick={() => setShowLogin(true)}>Login</Link></li>
                )}
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
        <Route path="/api/login" element={<Login setUser={setUser} />} />
        <Route path="/api/signup" element={<SignUp />} />
        <Route path="/collections/:id" element={<Content />} />
      </Routes>
        {showLogin && <Login closePopup={() => setShowLogin(false)} setUser={setUser} />}
    </Router>
  );
}

export default App;
