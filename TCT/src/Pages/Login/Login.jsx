import { useState } from "react";

const Login = ({ closePopup }) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closePopup}>&times;</span>
                <h2>{isLogin ? "Login" : "Create Account"}</h2>
                <form>
                    {!isLogin && 
                    <input type="text" placeholder="Username" required />}
                    <input type="text" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">{isLogin ? "Login" : "Create Account"}</button>
                </form>
                <p>OR{" "}
                    <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "create account" : "login"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
