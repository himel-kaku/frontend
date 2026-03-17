import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}!</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Info</h3>
          <p>Level: {user?.level}</p>
          <p>Term: {user?.term}</p>
          <p>Department: {user?.departmentCode}</p>
        </div>
        <div className="dashboard-card">
          <h3>Getting Started</h3>
          <p>Use the navigation menu on the right to access:</p>
          <ul>
            <li>Your enrolled courses</li>
            <li>Class and exam routines</li>
            <li>Course materials</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
