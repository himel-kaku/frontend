import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import FileList from './FileList';
import UploadModal from './UploadModal';
import UpdateExamScheduleModal from './UpdateExamScheduleModal'; // IMPORT NEW MODAL
import './ExamMaterialsModal.css';

const ExamMaterialsModal = ({ exam, onClose, canUpdate }) => {
  const { token } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false); // STATE FOR UPDATE MODAL

  useEffect(() => {
    fetchMaterials();
  }, [exam]);

  const fetchMaterials = async () => {
    try {
      const data = await api.getExamMaterials(token, exam.id);
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

  const handleUpdateSuccess = () => {
    setShowUpdate(false);
    window.location.reload(); // Refresh to show new schedule details
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{exam.courseCode} - {exam.courseTitle}</h2>
            <p className="modal-info">
              {exam.date} | {exam.startTime} - {exam.endTime} | {exam.venue}
            </p>
            {exam.description && (
              <p className="exam-modal-description">{exam.description}</p>
            )}
          </div>
          <div className="header-actions">
            {canUpdate && (
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
                <h3>Exam Materials</h3>
                {canUpdate && (
                  <button className="upload-btn" onClick={() => setShowUpload(true)}>
                    Upload File
                  </button>
                )}
              </div>
              <FileList files={materials.files} />
            </>
          )}
        </div>

        {showUpload && (
          <UploadModal
            plotId={materials.plot_id}
            onClose={() => setShowUpload(false)}
            onSuccess={handleUploadSuccess}
            uploadType="exam"
          />
        )}

        {showUpdate && (
          <UpdateExamScheduleModal
            exam={exam}
            onClose={() => setShowUpdate(false)}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ExamMaterialsModal;