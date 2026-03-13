import React, { useState } from 'react';

// WeatherSearch component handles user input for city search
const WeatherSearch = ({ onSearch }) => {
  // Local state to manage input field value
  const [city, setCity] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (city.trim()) {
      onSearch(city); // Pass city name to parent component
      setCity(''); // Clear input after search
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default WeatherSearch;