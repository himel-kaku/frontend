import React from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './FileList.css';

const FileList = ({ files }) => {
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
      
      // Use the actual filename if you have it, 
      // otherwise the browser uses the 'Content-Disposition' header if set
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
          <button
            className="download-btn"
            onClick={() => handleDownload(file.file_id, file.file_name)}
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileList;
