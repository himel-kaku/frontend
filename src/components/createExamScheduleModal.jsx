import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './UpdateScheduleModal.css'; 

const CreateExamScheduleModal = ({ slotData, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    section: '',
    date: slotData.date,
    start_time: '08:00',
    end_time: '08:30',
    building_name: '',
    room: '',
    exam_description: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getMyCourses(token);
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Failed to load courses');
      }
    };
    fetchCourses();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "courseId") {
        const selectedCourse = courses.find(c => c.id === parseInt(value));
        setFormData(prev => ({ 
            ...prev, 
            course_id: value, 
            section: selectedCourse ? selectedCourse.section : '' 
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createExamSchedule(token, formData);
      alert('Exam scheduled successfully!');
      onSuccess();
    } catch (err) {
      alert('Failed to create: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-modal-overlay" onClick={onClose}>
      <div className="update-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Schedule New Exam</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Course</label>
            <select name="courseId" value={formData.course_id} onChange={handleChange} required>
              <option value="">-- Choose Course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}> {c.code} - {c.title} </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Exam Description (e.g. Midterm, Final)</label>
            <input type="text" name="exam_description" value={formData.exam_description} onChange={handleChange} placeholder="e.g. Final Term Exam" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Building</label>
              <input type="text" name="building_name" value={formData.building_name} onChange={handleChange} placeholder="Academic" required />
            </div>
            <div className="form-group">
              <label>Room</label>
              <input type="text" name="room" value={formData.room} onChange={handleChange} placeholder="301" required />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="update-change-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamScheduleModal;