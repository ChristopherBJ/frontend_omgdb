import React, { useState } from 'react';
import '../styles/StarRating.css';

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0); 

  return (
    <div className="star-rating">
      {[...Array(10)].map((_, index) => (
        <span
          key={index}
          className={`star ${index < (hovered || value) ? 'filled' : ''}`} 
          onClick={() => onChange(index + 1)} 
          onMouseEnter={() => setHovered(index + 1)} 
          onMouseLeave={() => setHovered(0)} 
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;