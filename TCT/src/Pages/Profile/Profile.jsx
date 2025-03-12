import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        description: "",
        profilePicture: "",
        collections: []
    });
    const [newDescription, setNewDescription] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success === false) return;
                setUser(data);
                setNewDescription(data.description || "");
            })
            .catch(err => console.error("Failed to load profile", err));
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("picture", file);
            const res = await fetch("/api/profile/picture", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
        });
        const result = await res.json();
        if (result.success) {
            setUser(prev => ({ ...prev, profilePicture: `http://localhost:5000${result.profilePicture}?t=${new Date().getTime()}` }));
        } else {
            console.error("Upload failed:", result.message);
        }
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    };

    const saveDescription = async () => {
        if (newDescription.length > 144) {
            alert("Description is too long (max 144 characters).");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ description: newDescription })
            });
            const result = await res.json();
            if (result.success) {
               setUser(prev => ({ ...prev, description: newDescription }));
        } else {
            console.error("Failed to save description:", result.message);
        }
        } catch (err) {
        console.error("Error saving description:", err);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-upload">
                    <label htmlFor="pictureUpload" className="profile-button">Choose PFP</label>
                        <input 
                            id="pictureUpload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={{ display: "none" }}/>
                </div>
            </div>
                {user.profilePicture ? (
                    <img 
                    src={user.profilePicture ? user.profilePicture : "/default-avatar.png"} 
                    alt="Profile" 
                    className="profile-image"/>
                ) : (
                    <div className="profile-image"/>
                )}
                <h1 className="profile-name">{user.username}</h1>
                {/*
                <textarea className="profile-description"
                    value={newDescription}
                    maxLength={144}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Quick description"/>
                <button onClick={saveDescription}>Save</button>*/}
            <div className="profile-links">
                <div className="left-links">
                    {user.collections.map(col => (
                        <button key={col._id} className="link-button" onClick={() => navigate(`/collections/${col._id}`)}>
                            {col.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
