import React from 'react';
import { Link } from 'react-router-dom';

function Shop({ addToCart }) {
  const items = [
    {
      id: "1", name: "Item One", price:'$1',
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Supplies and storage for collections. Description of Item One."
    },
    {
      id: "2", name: "Item Two", price: '$5',
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Description of item Two."
    },
    {
      id: "3", name: "Item Three", price: '$10.99',
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Description of item Three."
    },
    {
      id: "4", name: "Item Four", price: '$6.95',
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Description of item Four."
    },
    {
      id: "5", name: "Item Five",
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Description of item Five."
    },
    {
      id: "6", name: "Item Six",
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Description of item Six."
    },
    {
      id: "7", name: "Item Seven",
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Description of item Seven."
    },
    {
      id: "8", name: "Item Eight",
      image: "https://images.freeimages.com/image/thumbs/619/sunny-rainbow-png-delight-5690557.png",
      description: "Description of item Eight."
    }
  ];

  return (
    <div>
      <h1>Shop</h1>
      <div>Selling supplies for users collections</div>
      <div className="container">
        <div className="row">
          {items.map(item => (
            <div key={item.id} className="col-2 mb-2">
              <div className="card">
                <Link to={`/item/${item.id}`}>
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                  />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="price-text"><strong>{item.price}</strong></p>
                  <button 
                    className="button"
                    onClick={() => addToCart(item.name)}
                  >
                    <Link to="/cart"> Add to Cart</Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop