const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  // Auth
  login: async (id, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, password })
    });
    return response.json();
  },

  // Courses
  getMyCourses: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/user/my-courses`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // Class Routine
  getClassRoutine: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/user/class-routine`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getClassMaterials: async (token, classScheduleId) => {
    const response = await fetch(`${API_BASE_URL}/api/user/class-materials/${classScheduleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  uploadClassFile: async (token, plotId, file) => {
    const formData = new FormData();
    formData.append('plot_id', plotId);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/class-files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      pid: plotId
    });
    return response.json();
  },

  // Exam Routine
  getExamRoutine: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/user/exam-routine`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getExamMaterials: async (token, examScheduleId) => {
    const response = await fetch(`${API_BASE_URL}/api/user/exam-materials/${examScheduleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  uploadExamFile: async (token, examPlotId, file) => {
    const formData = new FormData();
    formData.append('plot_id', examPlotId);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/exam-files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return response.json();
  },

  // Resources
  getCourseMaterials: async (token, courseId) => {
    const response = await fetch(`${API_BASE_URL}/api/user/course-materials/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getExamsCourseMaterials : async (token, courseId) => {
    const response = await fetch(`${API_BASE_URL}/api/user//exam-course-materials/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },
    
  // Download
 downloadFile: async (token, fileId) => {
    const response = await fetch(`${API_BASE_URL}/api/download/${fileId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return await response.blob();
  },



  createClassSchedule: async (token, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/create-class-schedule`, { // Adjust URL to your routeBASE_URL}/api/create-class-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scheduleData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create schedule');
    return data;
  },

  createExamSchedule: async (token, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/create-exam-schedule`, { // Adjust URL to your route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scheduleData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create schedule');
    return data;
  },

  
    // Add this inside your api object in utils/api.js
  updateClassSchedule: async (token, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/update-class-schedule`, { // Adjust URL to your route
      method: 'POST', // or 'PUT' based on your backend preference
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scheduleData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update failed');
    return data;
  },

  updateExamSchedule: async (token, scheduleData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/update-exam-schedule`, { // Adjust URL to your route
      method: 'POST', // or 'PUT' based on your backend preference
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(scheduleData)
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update failed');
    return data;
  },
};
