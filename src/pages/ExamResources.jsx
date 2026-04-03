import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import FileList from '../components/FileList';
import './ClassResources.css'; // Reusing same CSS for consistency

const ExamResources = ({singleCourse}) => {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Only CR can upload
  const isEditor = user?.studentRole?.toLowerCase() === 'cr'
               || user?.role === 'teacher';
  const isTeacher = user?.role === 'teacher';

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

  useEffect(() => {
    if (singleCourse) {
      setCourses([singleCourse]);
      selectCourse(singleCourse);
      setLoading(false);
    } else {
      fetchCourses();
    }
  }, []);

  // Select first course when courses are loaded
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse && !singleCourse) {
      const grouped = groupCoursesById();
      if (grouped.length > 0) {
        const firstCourseGroup = grouped[0];
        const firstSection = firstCourseGroup.sections[0];
        selectCourse(firstCourseGroup, firstSection);
      }
    }
  }, [courses, selectedCourse, singleCourse]);

  const fetchCourses = async () => {
    try {
      const data = await api.getMyCourses(token);
      setCourses(data.courses || []);
      if (data.courses && data.courses.length > 0) {
        // Group courses and select first course with first section
        const grouped = groupCoursesById();
        if (grouped.length > 0) {
          const firstCourseGroup = grouped[0];
          const firstSection = firstCourseGroup.sections[0];
          selectCourse(firstCourseGroup, firstSection);
        }
      }
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const selectCourse = async (course, section = null) => {
    setSelectedCourse(course);
    setSelectedSection(section);
    setExamsLoading(true);
    try {
      // Send section as URL parameter for teachers, no section for students/CR
      const sectionParam = isTeacher && section ? section.section : null;
      const data = await api.getExamsCourseMaterials(token, course.id, sectionParam);
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
                {groupedCourses.map((courseGroup) => {
                  const hasMultipleSections = courseGroup.sections.length > 1;
                  const isGroupActive = selectedCourse?.id === courseGroup.id;
                  
                  if (!hasMultipleSections) {
                    // Single section - render as before
                    const course = courseGroup.sections[0];
                    return (
                      <div
                        key={isTeacher ? `${course.id}-${course.section || ''}` : course.id}
                        className={`course-item ${isGroupActive ? 'active' : ''}`}
                        onClick={() => selectCourse(course)}
                      >
                        <div className="course-code">{course.code}</div>
                        <div className="course-name">{course.title}</div>
                      </div>
                    );
                  } else {
                    // Multiple sections - render grouped with section buttons
                    return (
                      <div key={courseGroup.id} className={`course-group ${isGroupActive ? 'active' : ''}`}>
                        <div className="course-group-header">
                          <h4 className="course-group-title">{courseGroup.code} - {courseGroup.title}</h4>
                        </div>
                        <div className="section-buttons">
                          {courseGroup.sections.map((section, index) => (
                            <button
                              key={`${section.id}-${section.section}`}
                              className={`section-button ${isGroupActive && selectedSection?.section === section.section ? 'active' : ''}`}
                              onClick={() => selectCourse(courseGroup, section)}
                            >
                              Sec {section.section}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                })}
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