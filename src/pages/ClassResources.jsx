// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { api } from '../utils/api';
// import FileList from '../components/FileList';
// import './ClassResources.css';

// const ClassResources = ({ singleCourse }) => {
//   const { token } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [materials, setMaterials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [materialsLoading, setMaterialsLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (singleCourse) {
//       setCourses([singleCourse]);
//       selectCourse(singleCourse);
//       setLoading(false);
//     } else {
//       fetchCourses();
//     }
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const data = await api.getMyCourses(token);
//       setCourses(data.courses || []);
//       if (data.courses && data.courses.length > 0) {
//         selectCourse(data.courses[0]);
//       }
//     } catch (err) {
//       setError('Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectCourse = async (course) => {
//     setSelectedCourse(course);
//     setMaterialsLoading(true);
//     try {
//       const data = await api.getCourseMaterials(token, course.id);
//       setMaterials(data.plots || []);
//     } catch (err) {
//       console.error('Failed to load materials');
//     } finally {
//       setMaterialsLoading(false);
//     }
//   };

//   const groupMaterialsByDate = () => {
//     const grouped = {}
//     materials.forEach(material => {
//       const date = material.date || 'Unknown Date';
//       if (!grouped[date]) {
//         grouped[date] = [];
//       }
//       grouped[date].push(...material.files);
//     });
//     return grouped;
//   };

//   const groupedMaterials = groupMaterialsByDate();
//   const dates = Object.keys(groupedMaterials).sort().reverse();

//   if (loading) return <div className="loading">Loading courses...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="class-resources-page">
//       <h1>Class Resources</h1>
      
//       <div className={singleCourse? 'one-container':"resources-container"}>
//         {!singleCourse && (
//               <aside className="courses-sidebar">
//                 <div className="my-courses-title">
//                   <h3>My Courses</h3>
//                 </div>
//                 <div className="course-list">
//                   {courses.map((course) => (
//                     <div
//                       key={course.id}
//                       className={`course-item ${selectedCourse?.id === course.id ? 'active' : ''}`}
//                       onClick={() => selectCourse(course)}
//                     >
//                       <div className="course-code">{course.code}</div>
//                       <div className="course-name">{course.title}</div>
//                     </div>
//                   ))}
//                 </div>
//               </aside>
//         )}
        

//         <div className="materials-panel">
//           {selectedCourse && (
//             <>
//               <div className="panel-header">
//                 <h2>{selectedCourse.code} - {selectedCourse.title}</h2>
//               </div>

//               {materialsLoading ? (
//                 <div className="loading">Loading materials...</div>
//               ) : dates.length > 0 ? (
//                 <div className="materials-by-date">
//                   {dates.map((date) => (
//                     <div key={date} className="date-group">
//                       <h3 className="date-label">{date}</h3>
//                       <FileList files={groupedMaterials[date]} />
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="no-materials">No materials available for this course</div>
//               )}
//            </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClassResources;



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
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadPlotId, setUploadPlotId] = useState(null);

  // ── Only CR can upload
  const isCR = user?.studentRole?.toLowerCase() === 'cr'
               || user?.role === 'teacher';

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
                        {isCR && (
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

      {/* ── Reuses the same UploadModal component from ClassMaterialsModal */}
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