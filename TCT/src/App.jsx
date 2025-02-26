import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import Homepage from './Pages/Homepage/Homepage';
import News from './Pages/News/News';
import Collections from './Pages/Collections/Collections';
import Shop from './Pages/Shop/Shop';
import Cart from './Pages/Cart/Cart';
import Search from './Pages/Search/Search';
import Login from './Pages/Login/Login';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <header>
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-title">TC Tracker</h1>
            <nav className="navbar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/news">News</Link></li>
                <li><Link to="/search">Card Search</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link to="/shop">Shop</Link></li>
                <li><Link className="login-button" onClick={() => setShowLogin(true)}>Login</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/news" element={<News />} />
        <Route path="/search" element={<Search />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      {showLogin && <Login closePopup={() => setShowLogin(false)} />}
    </Router>
  );
}

export default App;