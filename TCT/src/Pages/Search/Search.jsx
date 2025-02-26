import React, { useState } from "react";

const apiKey = "1e1d85f8-552f-4721-8f2a-66a521a52b20";

const search = () => {

    const [cardName, setCardName] = useState("");
    const [cardData, setCardData] = useState([]);
    const [collections] = useState([
        "My Collection 1",
        "My Collection 2",
        "My Collection 3",
    ]);

  // Fetch cards based on the entered card name.
  const handleSearch = () => {
    if (!cardName.trim()) {
      alert("Please enter a search term.");
      return;
    }

    const searchText = cardName.trim();
    // Build a query that checks in card name, set name, or set release date.
    const query = `name:${encodeURIComponent(
      searchText
    )} OR set.name:${encodeURIComponent(
      searchText
    )} OR set.releaseDate:${encodeURIComponent(searchText)}`;
    const url = `https://api.pokemontcg.io/v2/cards?q=${query}`;


    fetch(url, {
      headers: {
        "X-Api-Key": apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length) {
          setCardData(data.data);
        } else {
          setCardData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching card:", err);
      });
  };

  // Handle adding a card to the chosen collection.
  const handleAddToCollection = (card, selectedCollection) => {
    if (!selectedCollection) {
      alert("Please select a collection first.");
      return;
    }
    console.log(`Adding ${card.name} to ${selectedCollection}`);
    // Insert logic to add the card to a collection (e.g., update state or make an API call)
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Search for a Pokémon Card</h1>
      <input
        type="text"
        placeholder="Enter card name"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div className="container" style={{ marginTop: "20px" }}>
        <div className="row">
          {cardData.length > 0 ? (
            cardData.map((card) => (
              <CardBlock
                key={card.id}
                card={card}
                collections={collections}
                addToCollection={handleAddToCollection}
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



    const CardBlock = ({ card, collections, addToCollection }) => {
    const [selectedCollection, setSelectedCollection] = useState("");

    const releaseYear =
        card.set && card.set.releaseDate
        ? new Date(card.set.releaseDate).getFullYear(): "N/A";

    const marketValue =
        card.cardmarket &&
        card.cardmarket.prices &&
        card.cardmarket.prices.averageSellPrice
        ? `$${card.cardmarket.prices.averageSellPrice}`: "N/A";

    return (
        <div className="col-2 mb-2">
            <div className="card" style={{ padding: "10px", margin: "10px" }}>
                <h5 className="card-title">{card.name}</h5>
                    <img
                    src={card.images?.large || card.images?.small}
                    className="card-img-top"
                    alt={card.name}
                    style={{ maxWidth: "70%", height: "auto" }}
            />
            <div className="card-body">
                <p className="card-text">
                    <strong>Set:</strong> {card.set?.name || "N/A"}
                </p>
                <p className="card-text">
                    <strong>Year:</strong> {releaseYear}
                </p>
                <p className="card-text">
                    <strong>Market Value:</strong> {marketValue}
                </p>
                <div className="dropdown-container" style={{ display: "absolute", alignItems: "center" }}>
                    <select value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)} style={{ marginRight: "10px" }}>
                        <option value="">Select a collection</option>
                        {collections.map((collection, idx) => (
                            <option key={idx} value={collection}>
                                {collection}
                            </option>
                        ))}
                    </select>
                </div>
                <p>
                    <button onClick={() => addToCollection(card, selectedCollection)}>Add to Collection</button>
                </p>
            </div>
        </div>
    </div>
  );
};

export default search;