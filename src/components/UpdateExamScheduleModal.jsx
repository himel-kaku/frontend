import React, { useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const UpdateExamScheduleModal = ({ exam, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize with existing exam data
  const [formData, setFormData] = useState({
    id: exam.id,
    course_id: exam.courseId,
    section: exam.section,
    date: exam.date ? exam.date.split('T')[0] : '', // Format for date input
    start_time: exam.startTime,
    end_time: exam.endTime,
    building_name: exam.building_name || exam.venue?.split(' ')[0] || '', // Adaptive based on your object structure
    room: exam.room || exam.venue?.split(' ').slice(1).join(' ') || '',
    exam_description: exam.description || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure this method exists in your api.js
      await api.updateExamSchedule(token, formData);
      alert('Exam schedule updated successfully!');
      onSuccess();
    } catch (err) {
      alert('Failed to update exam: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-modal-overlay" onClick={onClose}>
      <div className="update-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Update Exam Schedule</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Exam Date</label>
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
                placeholder="e.g. Science Complex"
                value={formData.building_name} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label>Room</label>
              <input 
                type="text" 
                name="room" 
                placeholder="e.g. 402-C"
                value={formData.room} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Exam Description (e.g. Midterm, Quiz 3)</label>
            <textarea 
              name="exam_description" 
              value={formData.exam_description} 
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="update-change-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Update Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExamScheduleModal;