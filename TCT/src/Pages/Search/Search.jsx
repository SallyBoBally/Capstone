import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = "TCG_API_KEY";

const Search = () => {
  const [cardName, setCardName] = useState("");
  const [cardData, setCardData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortOption, setSortOption] = useState("name-asc");
  const [collections, setCollections] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      fetchCollections(token);
    }
  }, []);

  useEffect(() => {
    handleSort(sortOption);
  }, [cardData, sortOption]);

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
      .then((data) => {
        setCardData(data.data || []);
      })
      .catch((err) => console.error("Error fetching card:", err));
  };

  const handleSort = (option) => {
    let sorted = [...cardData];
    switch (option) {
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sorted.sort(
          (a, b) =>
            (a.cardmarket?.prices?.averageSellPrice || 0) -
            (b.cardmarket?.prices?.averageSellPrice || 0)
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) =>
            (b.cardmarket?.prices?.averageSellPrice || 0) -
            (a.cardmarket?.prices?.averageSellPrice || 0)
        );
        break;
      default:
        break;
    }
    setSortedData(sorted);
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

      <div>
        <label>Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      <div className="container">
        <div className="row">
          {sortedData.length > 0 ? (
            sortedData.map((card) => (
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
