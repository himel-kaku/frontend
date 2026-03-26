import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import FileList from '../components/FileList';
import './ClassResources.css'; // Reusing same CSS for consistency

const ExamResources = ({singleCourse}) => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (singleCourse) {
      setCourses([singleCourse]);
      selectCourse(singleCourse);
      setLoading(false);
    } else {
      fetchCourses();
    }
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
    setExamsLoading(true);
    try {
      // Assuming api.getExamMaterials exists; change to your specific endpoint name
      const data = await api.getExamsCourseMaterials(token, course.id); 
      setExams(data.exams || data.plots || []); 
    } catch (err) {
      console.error('Failed to load exam resources');
    } finally {
      setExamsLoading(false);
    }
  };

  const handleDeleteFile = (fileId) => {
    setExams(prevExams => 
      prevExams.map(exam => ({
        ...exam,
        files: exam.files.filter(file => file.file_id !== fileId)
      }))
    );
  };

  const groupExamsByDate = () => {
    const grouped = {};
    exams.forEach(exam => {
      const date = exam.date || 'Unknown Date';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(...exam.files);
    });
    return grouped;
  };

  const groupedExams = groupExamsByDate();
  const dates = Object.keys(groupedExams).sort().reverse();

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="class-resources-page">
      <h1>Exam Resources</h1>
      
      <div className={singleCourse ? "one-container" : "resources-container"}>
        {!singleCourse && (
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
        )}
      

        <div className="materials-panel">
          {selectedCourse && (
            <>
              <div className="panel-header">
                <h2>Exams: {selectedCourse.code} - {selectedCourse.title}</h2>
              </div>

              {examsLoading ? (
                <div className="loading">Loading exam files...</div>
              ) : dates.length > 0 ? (
                <div className="materials-by-date">
                  {dates.map((date) => (
                    <div key={date} className="date-group">
                      <h3 className="date-label">Exam Date: {date}</h3>
                      <FileList files={groupedExams[date]} onDelete={handleDeleteFile} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-materials">No exam resources available for this course</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResources;