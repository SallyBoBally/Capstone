import React from "react";

function Collections() {
    return (
        <div>
            <h1>Collection</h1>
            <div>Compiling of lists for collection</div>
            <div className="collection-grid">
                <div className="card">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Image_PlaceHolder.png" className="card-img-top" alt="Card Image" />
                    <div className= "card-body">
                        <h5 className="card-title">Name of Collection</h5>
                        <p className="card-text">Description if necessary.</p>
                        <a className="button">View</a>
                    </div>
                </div>
                <div className="card">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Image_PlaceHolder.png" className="card-img-top" alt="Card Image" />
                    <div className= "card-body">
                        <h5 className="card-title">Name of Collection</h5>
                        <p className="card-text">Description if necessary.</p>
                        <a className="button">View</a>
                    </div>
                </div>
                <div className="card">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Image_PlaceHolder.png" className="card-img-top" alt="Card Image" />
                    <div className= "card-body">
                        <h5 className="card-title">Name of Collection</h5>
                        <p className="card-text">Description if necessary.</p>
                        <a className="button">View</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Collections