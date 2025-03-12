import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Collections() {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = !!localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollections();
    }, []);    

    const fetchCollections = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login.");
                return;
            }
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get("/api/collection", { headers });
            setCollections(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                console.error("Unauthorized. Redirecting to login.");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                console.error("Error fetching collections:", error.response?.data || error);
            }
        } finally {
            setIsLoading(false);
        }
    };    

    const handleCreateCollection = async () => {
        const name = prompt("Enter collection name:");
        if (!name) return;
    
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to create a collection.");
            return;
        }
    
        try {
            await axios.post(
                "/api/collection",
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCollections();
        } catch (error) {
            console.error("Error creating collection:", error.response?.data || error);
            alert(error.response?.data?.message || "Failed to create collection.");
        }
    };    
    

    const handleEditCollection = (id) => {
        const newName = prompt("Enter new collection name:");
        if (newName) {
            axios
                .put(`/api/collection/${id}`, { name: newName }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                })
                .then((response) => {
                    setCollections(collections.map((collection) =>
                        collection._id === id ? response.data : collection
                    ));
                })
                .catch((error) => console.error("Error editing collection:", error));
        }
    };

    const handleDeleteCollection = (id) => {
        if (window.confirm("Are you sure you want to delete this collection?")) {
            axios
                .delete(`/api/collection/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                })
                .then(() => {
                    setCollections(collections.filter((collection) => collection._id !== id));
                })
                .catch((error) => console.error("Error deleting collection:", error));
        }
    };

    return (
        <div>
            <h1>Collections</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="collection-grid">
                    {collections.map((collection) => (
                        <div key={collection._id} className="collection-card">
                            <h5 className="collection-title">{collection.name}</h5>
                            <p className="collection-text">{collection.description}</p>
                            <a className="button" onClick={() => navigate(`/collections/${collection._id}`)}>View</a>
                            {isAuthenticated && (
                                <>
                                    <a className="button" onClick={() => handleEditCollection(collection._id)}>Edit</a>
                                    <a className="button" onClick={() => handleDeleteCollection(collection._id)}>Delete</a>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {isAuthenticated && <button onClick={handleCreateCollection}>Create Collection</button>}
        </div>
    );
}

export default Collections;
