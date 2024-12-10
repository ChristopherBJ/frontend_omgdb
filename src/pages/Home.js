import React, { useState } from 'react';
import '../styles/Home.css';

function Home() {
  const [index, setIndex] = useState(0);

  // Number of visible boxes at once (2 boxes)
  const boxesPerSlide = 2;

  // List of all boxes (8 boxes)
  const boxes = [
    'Box 1', 'Box 2', 'Box 3', 'Box 4', 'Box 5', 'Box 6', 'Box 7', 'Box 8'
  ];

  // Move to the next set of boxes
  const nextSlide = () => {
    if (index < boxes.length - 1) {
      setIndex(index + 1); // Move forward by 1 box
    }
  };

  // Move to the previous set of boxes
  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1); // Move backward by 1 box
    }
  };

  return (
    <div className="home">
<div>
      {/* "Featured Today" text */}
      <div className="featured">
        <h2>Featured Today</h2>
      </div>
    <div className="carousel-container">
      <div
        className="carousel-items"
        style={{
          transform: `translateX(-${(index * 100) / boxes.length}%)`, // Adjusted translation for 1 box
          transition: 'transform 0.5s ease', // Smooth transition
        }}
      >
        {boxes.map((box, idx) => (
          <div key={idx} className="box">{box}</div>
        ))}
      </div>

      {/* Custom Previous and Next Buttons */}
      <div className="carousel-controls">
        <button 
          className="carousel-control-prev" 
          onClick={prevSlide}
          disabled={index === 0} // Disable the "Previous" button at the start
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </button>
        <button 
          className="carousel-control-next" 
          onClick={nextSlide}
          disabled={index >= boxes.length - boxesPerSlide} // Disable the "Next" button at the end
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  </div>
  </div>
  );
}

export default Home;