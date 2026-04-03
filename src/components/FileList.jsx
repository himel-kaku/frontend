import React from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './FileList.css';

const FileList = ({ files, onDelete }) => {
  const { token } = useAuth();

  const handleDownload = async (fileId, fileName) => {
    try {
      console.log(`Starting download for: ${fileId}`);
      
      // 1. Fetch the blob from our API service
      const blob = await api.downloadFile(token, fileId);

      // 2. Create a temporary object URL for the blob
      const url = window.URL.createObjectURL(blob);

      // 3. Create a hidden anchor element
      const link = document.createElement('a');
      link.href = url;
      
      // Using the actual filename if you have it, 
      link.setAttribute('download', fileName || `file-${fileId}`); 
      
      // 4. Append, click, and cleanup
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // Free up memory
      
      console.log("Download complete.");
    } catch (error) {
      console.error("Download Error:", error.message);
      alert("Failed to download file. Please check your connection or permissions.");
    }
  };

  const handleDelete = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await api.deleteFile(token, fileId);
      if (onDelete) {
        onDelete(fileId); // This already filters the file out in parent state
      }
    } catch (error) {
      console.error("Delete Error:", error.message);
      alert("Failed to delete file.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!files || files.length === 0) {
    return <div className="no-files">No files uploaded yet</div>;
  }

  return (
    <div className="file-list">
      {files.map((file) => (
        <div key={file.file_id} className="file-item">
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div>
              <div className="file-name">{file.file_name}</div>
              <div className="file-date">Uploaded: {formatDate(file.uploaded_at)}</div>
            </div>
          </div>
          <div className="file-actions">
            <button
              className="download-btn"
              onClick={() => handleDownload(file.file_id, file.file_name)}
            >
              Download
            </button>
            <button
              className="delete-btn"
              onClick={() => handleDelete(file.file_id, file.file_name)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
