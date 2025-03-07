import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardList = () => {
    const [cards, setCards] = useState([]);
    const [filters, setFilters] = useState({
        type: '',
        sortBy: '',
    });

    useEffect(() => {
        fetchCards();
    }, [filters]);

    const fetchCards = async () => {
        try {
            const { type, sortBy } = filters;
            const response = await axios.get("http://localhost:5000/cards", {
                params: { type, sortBy },
                withCredentials: true
            });
            setCards(response.data);
        } catch (error) {
            console.error("❌ Error fetching cards:", error);
        }
    };
    

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div>
                <select name="type" onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    <option value="pokemon">Pokémon</option>
                    <option value="supporter">Supporter</option>
                    <option value="trainer">Trainer</option>
                    <option value="item">Item</option>
                    <option value="tool">Tool</option>
                </select>

                <select name="sortBy" onChange={handleFilterChange}>
                    <option value="">Sort By</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            <ul>
                {cards.map((card) => (
                    <li key={card.id}>
                        <strong>{card.name}</strong> - {card.supertype} - 
                        ${card.cardmarket?.prices?.averageSellPrice || "N/A"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CardList;
