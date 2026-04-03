import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './Courses.css';

const Courses = () => {
  const { token , user} = useAuth();
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const isTeacher = user?.role === 'teacher';

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

  // Group courses by their unique identifier
  const groupCoursesById = () => {
    const grouped = {};
    courses.forEach(course => {
      const courseKey = course.id; // Use course.id as the unique identifier
      if (!grouped[courseKey]) {
        grouped[courseKey] = {
          ...course,
          sections: []
        };
      }
      grouped[courseKey].sections.push(course);
    });
    return Object.values(grouped);
  };

  const groupedCourses = groupCoursesById();

  const handleSectionClick = (course, section) => {
    navigate(`/course/${course.id}`, { state: { course: section } });
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-page">
      <h1>My Courses</h1>
      <div className="courses-grid">
        {groupedCourses.map((courseGroup) => (
          <div key={courseGroup.id} className="course-card">
            <div className="course-header">
              <h3>{courseGroup.code}</h3>
              <span className="course-type">{courseGroup.type}</span>
            </div>
            <h4>{courseGroup.title}</h4>
            <div className="course-details">
              <p>
                <strong>Department:</strong> {courseGroup.department.name} ({courseGroup.department.code})
              </p>
              {isTeacher &&
               <p><strong>Enrolled Students:</strong> {courseGroup.enrolledStudents}</p>
              }
              
            </div>
            {courseGroup.sections.length > 1 && (
              <div className="course-sections">
                <h5>Sections:</h5>
                <div className="sections-list">
                  {courseGroup.sections.map((section) => (
                    <button
                      key={`${section.id}-${section.section}`}
                      className="section-button"
                      onClick={() => handleSectionClick(courseGroup, section)}
                    >
                      Section {section.section}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {courseGroup.sections.length === 1 && (
              <button
                className="section-button single-section"
                onClick={() => handleSectionClick(courseGroup, courseGroup.sections[0])}
              >
                Go to Course
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;