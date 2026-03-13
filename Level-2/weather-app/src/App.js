import React, { useState } from 'react';
import './App.css';
import WeatherSearch from './components/WeatherSearch';
import WeatherCard from './components/WeatherCard';

function App() {
  // State management
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API configuration - we'll use environment variables
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Function to fetch weather data
  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construct API URL with parameters
      const url = `${API_BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`;
      
      const response = await fetch(url);
      
      // Handle API errors
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the city name.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again.');
        }
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search from WeatherSearch component
  const handleSearch = (city) => {
    fetchWeatherData(city);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather App</h1>
        <p>Search for any city to check current weather</p>
      </header>
      
      <main className="app-main">
        <WeatherSearch onSearch={handleSearch} />
        <WeatherCard 
          weatherData={weatherData}
          loading={loading}
          error={error}
        />
      </main>
      
      <footer className="app-footer">
        <p>Data provided by OpenWeatherMap</p>
      </footer>
    </div>
  );
}

export default App;