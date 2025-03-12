import React from 'react';

function Homepage() {
    return (
      <div class="home-container">
          <div class="home-section">
              <div class="home-image">
                  <img src="https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/10838023/592218216.jpg.jpg?quality=90&strip=all&crop=16.833333333333,0,66.333333333333,100" alt="hand"></img>
              </div>
              <div class="home-text">
                  <h3>Search</h3>
                  <p>Look up any English Pokemon card and we provide the basic information
                      of which set that card is from, year, and current market price.
                      Add it to your preferred collection.
                  </p>
              </div>
          </div>
          
          <div class="home-section">
              <div class="home-image">
                  <img src="https://m.media-amazon.com/images/I/81zyoKExXAL.jpg" alt="cards"></img>
              </div>
              <div class="home-text">
                  <h3>Collection</h3>
                  <p>Build your own custom collections of the cards you have, the cards you need,
                      and the cards you're missing from a certain set. </p>
              </div>
          </div>
          
          <div class="home-section">
              <div class="home-image">
                  <img src="https://i.etsystatic.com/22452562/r/il/aa811e/3208364193/il_570xN.3208364193_mwsk.jpg" alt="card box"></img>
              </div>
              <div class="home-text">
                  <h3>Cards</h3>
                  <p>Now you know exactly what to look for the next time you head to your
                      local card shop or the next card show. </p>
              </div>
          </div>
      </div>
    );
};

export default Homepage;