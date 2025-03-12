import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Content = () => {
    const { id } = useParams();
    const [collection, setCollection] = useState(null);

    useEffect(() => {
        fetch(`/api/collections/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched Collection Data:", data);
                setCollection(data);
            })
            .catch((error) => console.error('Error fetching collection:', error));
        }, [id]);

    if (!collection) return <p>Loading...</p>;

    return (
        <div>
        <h2>{collection.name}</h2>
        <div className="container">
            <div className="row">
            {collection.cards && collection.cards.length > 0 ? (
                collection.cards.map((card) => (
                <CardBlock 
                    key={card._id} 
                    card={card} 
                    collectionId={id}
                    setCollection={setCollection} />))
            ) : (
                <p>No cards in this collection.</p>
            )}
            </div>
        </div>
        </div>
    );
};

const CardBlock = ({ card, collectionId, setCollection }) => {
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${card.name}?`)) {
            try {
                const token = localStorage.getItem("token");
    
                if (!token) {
                    console.error("No token found. User may not be logged in.");
                    alert("Authentication required. Please log in.");
                    return;
                }
    
                const response = await fetch(`http://localhost:5000/api/collections/${collectionId}/cards/${card.id}`, { // <-- Fixed URL
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
    
                if (response.ok) {
                    setCollection((prevCollection) => ({
                        ...prevCollection,
                        cards: prevCollection.cards.filter(c => c.id !== card.id)
                    }));
                } else {
                    const errorMessage = await response.json();
                    console.error("Failed to delete card:", errorMessage);
                    alert("Error: " + errorMessage.message);
                }
            } catch (error) {
                console.error("Error deleting card:", error);
            }
        }
    };    
    

    return (
        <div className="card-block">
            <div className="card">
                <h5 className="card-title">{card.name}</h5>
                <img src={card.images?.large || card.images?.small || "default-image.png"} 
                    className="card-img-top" alt={card.name} />
                <div className="card-body">
                    <p><strong>Set:</strong> {card.set?.name || "N/A"}</p>
                    <p><strong>Market Value:</strong> {card.cardmarket?.prices?.averageSellPrice || "N/A"}</p>
                    <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    );
};



export default Content;