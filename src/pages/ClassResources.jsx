import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import FileList from '../components/FileList';
import UploadModal from '../components/UploadModal';
import './ClassResources.css';

const formatDateLabel = (dateStr) => {
  if (!dateStr) return 'Unknown Date';
  const date = new Date(dateStr + 'T00:00');
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ClassResources = ({ singleCourse }) => {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadPlotId, setUploadPlotId] = useState(null);

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

  const isDateTodayOrPast = (dateStr) => {
    if (!dateStr) return false;
    const normalized = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
    const plotDate = new Date(normalized);
    if (Number.isNaN(plotDate.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    plotDate.setHours(0, 0, 0, 0);
    return plotDate <= today;
  };

  const selectCourse = async (course, section = null) => {
    setSelectedCourse(course);
    setSelectedSection(section);
    setMaterialsLoading(true);
    try {
      // Send section as URL parameter for teachers, no section for students/CR
      const sectionParam = isTeacher && section ? section.section : null;
      const data = await api.getCourseMaterials(token, course.id, sectionParam);
      const plots = data.plots || [];
      const filteredPlots = plots.filter((plot) => isDateTodayOrPast(plot.date));
      setMaterials(filteredPlots);
    } catch (err) {
      console.error('Failed to load materials');
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleUploadClick = (plotId) => {
    setUploadPlotId(plotId);
    setShowUpload(true);
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    setUploadPlotId(null);
    // Refresh materials for the current course
    if (selectedCourse) selectCourse(selectedCourse);
  };

  const handleDeleteFile = (fileId) => {
    setMaterials(prevMaterials => 
      prevMaterials.map(material => ({
        ...material,
        files: material.files.filter(file => file.file_id !== fileId)
      }))
    );
  };

  const groupMaterialsByDate = () => {
    const grouped = {};
    materials.forEach(material => {
      const date = material.date || 'Unknown Date';
      if (!grouped[date]) {
        // ── Store plotId alongside files so the upload button knows which plot to attach to
        grouped[date] = { plotId: material.plot_id, files: [] };
      }
      grouped[date].files.push(...material.files);
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

      <div className={singleCourse ? 'one-container' : 'resources-container'}>
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
                <h2>{selectedCourse.code} - {selectedCourse.title}</h2>
              </div>

              {materialsLoading ? (
                <div className="loading">Loading materials...</div>
              ) : dates.length > 0 ? (
                <div className="materials-by-date">
                  {dates.map((date) => (
                    <div key={date} className="date-group">
                      <div className="date-group-header">
                        <h3 className="date-label">{formatDateLabel(date)}</h3>
                        {/* ── Upload button shown per date group, only for CR.
                               Uses the plotId for that specific class date. */}
                        {isEditor && (
                          <button
                            className="upload-btn"
                            onClick={() => handleUploadClick(groupedMaterials[date].plotId)}
                          >
                            Upload File
                          </button>
                        )}
                      </div>
                      <FileList files={groupedMaterials[date].files} onDelete={handleDeleteFile} />
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

      {showUpload && (
        <UploadModal
          plotId={uploadPlotId}
          onClose={() => { setShowUpload(false); setUploadPlotId(null); }}
          onSuccess={handleUploadSuccess}
          uploadType="class"
        />
      )}
    </div>
  );
};

export default ClassResources;