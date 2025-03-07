import React from "react";

function Collections() {
    return (
        <div>
            <h1>Collection</h1>
            <div>Compiling of lists for collection</div>
            <div className="collection-grid">
                <div className="collection-card">
                    <h5 className="collection-title">My Collection 1</h5>
                    <p className="collection-text">Description if necessary.</p>
                    <a className="button">View</a>
                </div>
                <div className="collection-card">
                    <div className= "card-body">
                        <h5 className="collection-title">My Collection 2</h5>
                        <p className="collection-text">Description if necessary.</p>
                        <a className="button">View</a>
                    </div>
                </div>
                <div className="collection-card">
                    <div className= "card-body">
                        <h5 className="collection-title">My Collection 3</h5>
                        <p className="collection-text">Description if necessary.</p>
                        <a className="button">View</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Collections