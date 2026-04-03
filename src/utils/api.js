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
    // console.log('getMyCourses response:', response);
    return response.json();
  },

  // Admin: Create student/teacher/course and assign, filter and update
  createStudent: async (token, studentData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/create-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(studentData)
    });
    return response.json();
  },

  createTeacher: async (token, teacherData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/create-teacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(teacherData)
    });
    return response.json();
  },

  createCourse: async (token, courseData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/create-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    return response.json();
  },

  createDepartment: async (token, departmentData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/create-department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(departmentData)
    });
    return response.json();
  },

  assignCourseToStudent: async (token, assignmentData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/assign-course-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(assignmentData)
    });
    return response.json();
  },

  assignCourseToTeacher: async (token, assignmentData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/assign-course-teacher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(assignmentData)
    });
    return response.json();
  },

  getStudents: async (token, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/admin/students?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getTeachers: async (token, filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/admin/teachers?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getCourses: async (token, filters = {}) => {
    const params = new URLSearchParams(filters);
    // console.log('Fetching courses with filters:', params.toString());
    const response = await fetch(`${API_BASE_URL}/api/admin/courses?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getDepartments: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/departments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getStudentById: async (token, studentId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getTeacherById: async (token, teacherId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teachers/${teacherId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getCourseById: async (token, courseId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  updateStudent: async (token, studentId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    return response.json();
  },

  updateTeacher: async (token, teacherId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teachers/${teacherId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    return response.json();
  },

  updateCourse: async (token, courseId, updateData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    return response.json();
  },

  deleteStudent: async (token, studentId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  deleteTeacher: async (token, teacherId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/teachers/${teacherId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  deleteCourse: async (token, courseId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
      method: 'DELETE',
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
  getCourseMaterials: async (token, courseId, section = null) => {
    const url = section
      ? `${API_BASE_URL}/api/user/course-section-materials/${courseId}/${section}`
      : `${API_BASE_URL}/api/user/course-materials/${courseId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getExamsCourseMaterials : async (token, courseId, section = null) => {
    const url = section
      ? `${API_BASE_URL}/api/user/exam-course-section-materials/${courseId}/${section}`
      : `${API_BASE_URL}/api/user/exam-course-materials/${courseId}`;

    const response = await fetch(url, {
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

  // Delete
  deleteFile: async (token, fileId) => {
    const response = await fetch(`${API_BASE_URL}/api/delete/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    return await response.json();
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
