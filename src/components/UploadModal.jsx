import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './UploadModal.css';

const UploadModal = ({ plotId, onClose, onSuccess, uploadType }) => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let result;
      if (uploadType === 'class') {
        result = await api.uploadClassFile(token, plotId, file);
      } else {
        result = await api.uploadExamFile(token, plotId, file);
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Upload File </h3>
        
        {error && <div className="upload-error">{error}</div>}
        
        <div className="file-input-container">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            id="file-input"
            name="file"
          />
          <label htmlFor="file-input" className="file-input-label">
            {file ? file.name : 'Choose a file'}
          </label>
        </div>

        <div className="upload-actions">
          <button onClick={onClose} disabled={uploading} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleUpload} disabled={uploading || !file} className="submit-btn">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
