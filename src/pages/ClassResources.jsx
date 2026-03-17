import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import FileList from '../components/FileList';
import './ClassResources.css';

const ClassResources = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await api.getMyCourses(token);
      setCourses(data.courses || []);
      if (data.courses && data.courses.length > 0) {
        selectCourse(data.courses[0]);
      }
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const selectCourse = async (course) => {
    setSelectedCourse(course);
    setMaterialsLoading(true);
    try {
      const data = await api.getCourseMaterials(token, course.id);
      setMaterials(data.plots || []);
    } catch (err) {
      console.error('Failed to load materials');
    } finally {
      setMaterialsLoading(false);
    }
  };

  const groupMaterialsByDate = () => {
    const grouped = {};
    materials.forEach(material => {
      const date = material.date.split('T')[0] || 'Unknown Date';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(...material.files);
    });
    return grouped;
  };

  const groupedMaterials = groupMaterialsByDate();
  const dates = Object.keys(groupedMaterials).sort().reverse();

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="class-resources-page">
      <h1>Class Resources</h1>
      
      <div className="resources-container">
        <aside className="courses-sidebar">
          <div className="my-courses-title">
             <h3>My Courses</h3>
          </div>
          <div className="course-list">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`course-item ${selectedCourse?.id === course.id ? 'active' : ''}`}
                onClick={() => selectCourse(course)}
              >
                <div className="course-code">{course.code}</div>
                <div className="course-name">{course.title}</div>
              </div>
            ))}
          </div>
        </aside>

        <div className="materials-panel">
          {selectedCourse && (
            <>
              <div className="panel-header">
                <h2>{selectedCourse.code} - {selectedCourse.title}</h2>
              </div>

              {materialsLoading ? (
                <div className="loading">Loading materials...</div>
              ) : dates.length > 0 ? (
                <div className="materials-by-date">
                  {dates.map((date) => (
                    <div key={date} className="date-group">
                      <h3 className="date-label">{date}</h3>
                      <FileList files={groupedMaterials[date]} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-materials">No materials available for this course</div>
              )}
           </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassResources;
