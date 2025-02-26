import React from 'react';
import { Link } from 'react-router-dom';

function addToCart({ cart }) {
  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <ul className="list-group">
          {cart.map((item, index) => (
            <li key={index} className="list-group-item">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

      <div className="mt-3">
        <Link to="/" className="button">
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default addToCart;
