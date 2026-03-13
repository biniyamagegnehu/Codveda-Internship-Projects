import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/protected/profile');
      setProfile(response.data.user);
      setError('');
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Authentication Successful! 🎉</h2>
          <p>You have successfully accessed a protected route.</p>
        </div>

        <div className="profile-card">
          <h3>Your Profile Information</h3>
          {error && <p className="error-message">{error}</p>}
          
          <div className="profile-info">
            <div className="info-row">
              <strong>Name:</strong>
              <span>{profile?.name || user?.name}</span>
            </div>
            <div className="info-row">
              <strong>Email:</strong>
              <span>{profile?.email || user?.email}</span>
            </div>
            <div className="info-row">
              <strong>User ID:</strong>
              <span className="user-id">{profile?.id || user?._id}</span>
            </div>
          </div>
        </div>

        <div className="token-info">
          <h3>Token Status</h3>
          <p className="token-status active">
            ✅ Active JWT Token - You are authenticated
          </p>
          <p className="token-note">
            Your token is stored securely in localStorage and automatically 
            included in all API requests.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;