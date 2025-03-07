import { useState } from "react";

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });
    
            if (response.ok) {
                alert("Signup successful!");
            } else {
                alert("Signup failed. Try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <div className="modal-content">
                    <h2>Sign Up</h2>                    
                    <label htmlFor="name">Username:</label>
                    <input
                        type="text"
                        id="name"
                        name="username"
                        placeholder="Enter your username"
                        required
                        value={formData.username}
                        onChange={handleChange}/>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        autoComplete="off"
                        value={formData.email}
                        onChange={handleChange}/>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}/>
                    <button type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
