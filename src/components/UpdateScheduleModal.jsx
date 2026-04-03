import React, { useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './UpdateScheduleModal.css'; // Create this for styling

const UpdateScheduleModal = ({ routine, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize form with existing routine data
  const [formData, setFormData] = useState({
    id: routine.id,
    course_id: routine.courseId, // Ensure your fetch routine includes courseId
    section: routine.section,
    date: routine.date,
    start_time: routine.startTime,
    end_time: routine.endTime,
    building_name: routine.building_name,
    room: routine.room,
    is_regular: routine.isRegular
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming api.updateClassSchedule is defined in your utils/api.js
      await api.updateClassSchedule(token, formData);
      alert('Schedule updated successfully!');
      onSuccess();
    } catch (err) {
      alert('Failed to update schedule: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-modal-overlay" onClick={onClose}>
      <div className="update-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Update Class Schedule</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input 
                type="time" 
                name="start_time" 
                value={formData.start_time} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input 
                type="time" 
                name="end_time" 
                value={formData.end_time} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Building</label>
              <input 
                type="text" 
                name="building_name" 
                value={formData.building_name} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Room</label>
              <input 
                type="text" 
                name="room" 
                value={formData.room} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="isRegular" 
              name="is_regular" 
              checked={formData.is_regular} 
              onChange={handleChange} 
            />
            <label htmlFor="isRegular">Is Class Open?</label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="update-change-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateScheduleModal;