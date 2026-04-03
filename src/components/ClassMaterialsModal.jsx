import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import FileList from './FileList';
import UploadModal from './UploadModal';
import './ClassMaterialsModal.css';
import UpdateScheduleModal from './UpdateScheduleModal';

const ClassMaterialsModal = ({ routine, onClose, canUpload }) => {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const isToday = routine.date.split('T')[0] === new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchMaterials();
  }, [routine]);

  const fetchMaterials = async () => {
    try {
      if(isToday){
        const data = await api.getClassMaterials(token, routine.id);
        setMaterials(data.plot || []);
      }
    } catch (err) {
      console.error('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchMaterials();
  };

  const handleDeleteFile = (fileId) => {
    setMaterials(prevMaterials => ({
      ...prevMaterials,
      files: prevMaterials.files.filter(file => file.file_id !== fileId)
    }));
  };
  
  const handleUpdateSuccess = () => {
    setShowUpdate(false);
    window.location.reload(); 
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{routine.courseCode} - {routine.courseTitle}  [sec: {routine.section}]</h2>
            <p className="modal-info">
              {routine.date.split('T')[0]} | {routine.startTime} - {routine.endTime} |  Building: {routine.building_name} | Room: {routine.room}
            </p>
          </div>
          <div className="header-actions">
            {canUpload && (
              <button className="edit-schedule-btn" onClick={() => setShowUpdate(true)}>
                Update Schedule
              </button>
            )}
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading materials...</div>
          ) : (
            <>
              <div className="materials-header">
                <h3>Class Materials</h3>
                {canUpload && isToday && (
                  <button className="upload-btn" onClick={() => setShowUpload(true)}>
                    Upload File
                  </button>
                )}
                {!isToday && !canUpload && (
                   <>No files available</>
                )}
                {!isToday && canUpload && (
                   <>You can upload only today's class files;</>
                )}
             </div>
                {isToday && (
                    <FileList files={materials.files} onDelete={handleDeleteFile} />
                )}
            </>
          )}
        </div>

        {showUpload && (
          <UploadModal
            plotId={materials.plot_id}
            onClose={() => setShowUpload(false)}
            onSuccess={handleUploadSuccess}
            uploadType="class"
          />
        )}

        {showUpdate && (
          <UpdateScheduleModal
            routine={routine}
            onClose={() => setShowUpdate(false)}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ClassMaterialsModal;