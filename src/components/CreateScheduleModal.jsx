import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './UpdateScheduleModal.css'; 

const CreateScheduleModal = ({ slotData, onClose, onSuccess , isTeacher}) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    section: '',
    date: slotData.date,
    start_time: slotData.startTime,
    end_time: slotData.endTime,
    building_name: '',
    room: '',
    is_regular: true
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
    const { name, value, type, checked } = e.target;

    // If course is selected, auto-fill the section from the course data
    if (name === 'courseId') {
      if (isTeacher) {
        // value is encoded as id-section for teachers
        const [courseId, courseSection] = value.split('-');
        setFormData(prev => ({
          ...prev,
          course_id: courseId,
          section: courseSection || ''
        }));
      } else {
        const selectedCourse = courses.find(c => c.id === parseInt(value));
        setFormData(prev => ({
          ...prev,
          course_id: value,
          section: selectedCourse ? selectedCourse.section : ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST request to your creation endpoint
      await api.createClassSchedule(token, formData);
      alert('New schedule created successfully!');
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
        <h3>Create Class Schedule</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Course</label>
            <select name="courseId" value={isTeacher ? `${formData.course_id}-${formData.section}` : formData.course_id} onChange={handleChange} required>
              <option value="">-- Choose Course --</option>
              {!isTeacher && courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))}
              {isTeacher && courses.map(c => (
                <option key={`${c.id}-${c.section}`} value={`${c.id}-${c.section}`}>
                  {c.code} - {c.title} [sec: {c.section}]
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
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
              <input type="text" name="room" value={formData.room} onChange={handleChange} placeholder="206" required />
            </div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="isRegularCreate" name="is_regular" checked={formData.is_regular} onChange={handleChange} />
            <label htmlFor="isRegularCreate">Is Open Class?</label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="update-change-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;