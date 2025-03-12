import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AuthModal = ({ closePopup, setUser }) => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ usernameOrEmail: '', username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const url = isSignup 
                ? "http://localhost:5000/api/signup"
                : "http://localhost:5000/api/login";
    
            const payload = isSignup
                ? { username: formData.username, email: formData.email, password: formData.password }
                : { usernameOrEmail: formData.usernameOrEmail, password: formData.password };
    
            const response = await axios.post(url, payload);
    
            if (response.data.success) {
                if (!isSignup) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    localStorage.setItem("token", response.data.token);
                    setUser(response.data.user);
                    navigate("/profile");
                } else {
                    alert("Signup successful! Please log in.");
                    setIsSignup(false);
                }
                closePopup();
            } else {
                setError(response.data.message || (isSignup ? "Signup failed" : "Login failed"));
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(isSignup ? "Sign up Error" : "Login error");
        }
    };    

    return (
        <div className="modal">
            <form>
                <div className="modal-content">
                    <close className="close" onClick={closePopup}>×</close>
                    <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>                    
                    {isSignup && (
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            required/>
                    )}
                    <input 
                        type="text" 
                        name={isSignup ? "email" : "usernameOrEmail"} 
                        placeholder={isSignup ? "Email" : "Username or Email"} 
                        value={isSignup ? formData.email : formData.usernameOrEmail} 
                        onChange={handleChange} 
                        required/>                   
                    <div className="password-input">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required/>
                        <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {error && <p className="error">{error}</p>}
                    
                    <button type="button" onClick={handleSubmit}>
                        {isSignup ? 'Sign Up' : 'Login'}
                    </button>
                    <p>
                        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <a onClick={() => setIsSignup(!isSignup)} className='underline-link'>
                            {isSignup ? 'Login' : 'Sign Up'}
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AuthModal;
