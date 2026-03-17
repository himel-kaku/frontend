import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './Courses.css';

const Courses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await api.getMyCourses(token);
      setCourses(data.courses || []);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-page">
      <h1>My Courses</h1>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-header">
              <h3>{course.code}</h3>
              <span className="course-type">{course.type}</span>
            </div>
            <h4>{course.courseTitle}</h4>
            <div className="course-details">
              <p><strong>Section:</strong> {course.section}</p>
              <p><strong>Department:</strong> {course.department.name} ({course.department.code})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
