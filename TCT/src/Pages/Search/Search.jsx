import React, { useState, useEffect } from "react";
import axios from "axios";
import CardList from "./SAF";

const apiKey = "1e1d85f8-552f-4721-8f2a-66a521a52b20";

const Search = () => {
  const [cardName, setCardName] = useState("");
  const [cardData, setCardData] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      fetchCollections(token);
    }
  }, []);

  const fetchCollections = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/collection", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const handleSearch = () => {
    if (!cardName.trim()) {
      alert("Please enter a search term.");
      return;
    }

    const searchText = cardName.trim();
    const query = `name:${encodeURIComponent(searchText)} OR set.name:${encodeURIComponent(searchText)} OR set.releaseDate:${encodeURIComponent(searchText)}`;
    const url = `https://api.pokemontcg.io/v2/cards?q=${query}`;

    fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => setCardData(data.data || []))
      .catch((err) => console.error("Error fetching card:", err));
  };

  const handleAddToCollection = async (card, selectedCollection) => {
    if (!selectedCollection) {
        alert("Please select a collection first.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to add cards to a collection.");
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost:5000/api/add-to-collection",
            { collectionId: selectedCollection, card },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(response.data.message);
    } catch (error) {
        console.error("Error adding card:", error);
    }
};

  return (
    <div>
      <h1>Search for a Pokémon Card</h1>
      <input
        type="text"
        placeholder="Enter card name"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div
        style={{
          opacity: cardData.length > 0 ? 1 : 0.5,
          pointerEvents: cardData.length > 0 ? "auto" : "none",
        }}
      >
        <CardList />
      </div>

      <div className="container">
        <div className="row">
          {cardData.length > 0 ? (
            cardData.map((card) => (
              <CardBlock
                key={card.id}
                card={card}
                collections={collections}
                addToCollection={handleAddToCollection}
                isAuthenticated={isAuthenticated}
              />
            ))
          ) : (
            <p>No cards found. Try another name.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CardBlock = ({ card, collections, addToCollection, isAuthenticated }) => {
  const [selectedCollection, setSelectedCollection] = useState("");

  return (
    <div className="card-block">
      <div className="card">
        <h5 className="card-title">{card.name}</h5>
        <img
          src={card.images?.large || card.images?.small}
          className="card-img-top"
          alt={card.name}
        />
        <div className="card-body">
          <p><strong>Set:</strong> {card.set?.name || "N/A"}</p>
          <p><strong>Market Value:</strong> {card.cardmarket?.prices?.averageSellPrice || "N/A"}</p>

          {isAuthenticated ? (
            <>
              <select value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)}>
                <option value="">Select Collection</option>
                {collections.map((col) => (
                  <option key={col._id} value={col._id}>{col.name}</option>
                ))}
              </select>
              <button onClick={() => addToCollection(card, selectedCollection)}>Add to Collection</button>
            </>
          ) : (
            <p>Login to add to collection</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
