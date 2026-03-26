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

  useEffect(() => {
    fetchMaterials();
  }, [routine]);

  const fetchMaterials = async () => {
    try {
      const data = await api.getClassMaterials(token, routine.id);
      setMaterials(data.plot || []);
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
    setMaterials(prevMaterials => 
      prevMaterials.map(material => ({
        ...material,
        files: material.files.filter(file => file.file_id !== fileId)
      }))
    );
  };

  const handleUpdateSuccess = () => {
    setShowUpdate(false);
    // You might want to refresh the routine data here 
    // or trigger fetchClassRoutine in the parent
    window.location.reload(); 
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{routine.courseCode} - {routine.courseTitle}</h2>
            <p className="modal-info">
              {routine.date.split('T')[0]} | {routine.startTime} - {routine.endTime} | {routine.location}
            </p>
          </div>
          <div className="header-actions">
            {/* ADDED UPDATE BUTTON HERE */}
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
                {canUpload && (
                  <button className="upload-btn" onClick={() => setShowUpload(true)}>
                    Upload File
                  </button>
                )}
              </div>
              <FileList files={materials.files} onDelete={handleDeleteFile} />
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
