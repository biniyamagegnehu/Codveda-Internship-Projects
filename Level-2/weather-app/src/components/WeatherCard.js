import React from 'react';

// WeatherCard displays weather information received via props
const WeatherCard = ({ weatherData, loading, error }) => {
  // Show loading state
  if (loading) {
    return (
      <div className="weather-card loading">
        <div className="loading-spinner"></div>
        <p>Fetching weather data...</p>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="weather-card error">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Don't render anything if no data
  if (!weatherData) {
    return null;
  }

  // Destructure weather data for easier access
  const { name, main, weather, wind } = weatherData;
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);
  const description = weather[0].description;
  const iconCode = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{name}</h2>
        <img 
          src={iconUrl} 
          alt={description} 
          className="weather-icon"
        />
      </div>
      
      <div className="weather-main">
        <div className="temperature">{temperature}°C</div>
        <div className="description">{description}</div>
        <div className="feels-like">Feels like: {feelsLike}°C</div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;