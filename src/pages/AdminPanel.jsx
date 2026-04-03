import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Create student
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    stu_name: '',
    level: '',
    term: '',
    role: 'student',
    department_id: '',
    password: ''
  });

  // Create teacher
  const [newTeacher, setNewTeacher] = useState({
    teacher_id: '',
    teacher_name: '',
    department_id: '',
    password: ''
  });

  // Create course
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    course_title: '',
    course_type: 'theory',
    department_id: ''
  });

  // Create department
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    dept_code: ''
  });

  // Departments list
  const [departments, setDepartments] = useState([]);

  // Assign
  const [courseStudentAssign, setCourseStudentAssign] = useState({
    course_id: '',
    student_id: '',
    section: 'A'
  });
  const [courseTeacherAssign, setCourseTeacherAssign] = useState({
    course_id: '',
    teacher_id: '',
    section: 'A'
  });

  // Lists and filtering
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);

  // Update forms
  const [updateStudentData, setUpdateStudentData] = useState({ student_id: '', stu_name: '', level: '', term: '', role: '', department_id: '', password: '' });
  const [updateTeacherData, setUpdateTeacherData] = useState({ teacher_id: '', teacher_name: '', department_id: '', password: '' });
  const [updateCourseData, setUpdateCourseData] = useState({ course_id: '', course_code: '', course_title: '', course_type: '', department_id: '' });

  // Update form IDs for fetching
  const [updateStudentId, setUpdateStudentId] = useState('');
  const [updateTeacherId, setUpdateTeacherId] = useState('');
  const [updateCourseId, setUpdateCourseId] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchStudents(), fetchTeachers(), fetchCourses(), fetchDepartments()]);
  };

  const handleResult = (data, successMsg) => {
    if (data.success) {
      setMessage(successMsg);
      setError('');
      fetchAll();
    } else {
      setError(data.message || 'Operation failed.');
      setMessage('');
    }
  };

  const normalizeList = (value) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object' && Array.isArray(value.data)) return value.data;
    return [];
  };

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents(token);
      if (data.success) {
        setStudents(normalizeList(data.students));
        setError('');
      } else {
        setStudents([]);
        setError(data.message || 'Failed to fetch students');
      }
    } catch {
      setStudents([]);
      setError('Unable to load students');
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await api.getTeachers(token);
      if (data.success) {
        setTeachers(normalizeList(data.teachers));
        setError('');
      } else {
        setTeachers([]);
        setError(data.message || 'Failed to fetch teachers');
      }
    } catch {
      setTeachers([]);
      setError('Unable to load teachers');
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await api.getCourses(token);
      if (data.success) {
        setCourses(normalizeList(data.courses));
        setError('');
      } else {
        setCourses([]);
        setError(data.message || 'Failed to fetch courses');
      }
    } catch {
      setCourses([]);
      setError('Unable to load courses');
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await api.getDepartments(token);
      if (data.success) {
        setDepartments(normalizeList(data.departments));
        setError('');
      } else {
        setDepartments([]);
        setError(data.message || 'Failed to fetch departments');
      }
    } catch {
      setDepartments([]);
      setError('Unable to load departments');
    }
  };

  const createStudent = async (e) => {
    e.preventDefault();
    const result = await api.createStudent(token, {
      ...newStudent,
      student_id: Number(newStudent.student_id),
      level: Number(newStudent.level),
      term: Number(newStudent.term),
      department_id: Number(newStudent.department_id)
    });
    handleResult(result, 'Student created successfully.');
  };

  const createTeacher = async (e) => {
    e.preventDefault();
    const result = await api.createTeacher(token, {
      ...newTeacher,
      teacher_id: Number(newTeacher.teacher_id),
      department_id: Number(newTeacher.department_id)
    });
    handleResult(result, 'Teacher created successfully.');
  };

  const createCourse = async (e) => {
    e.preventDefault();
    const result = await api.createCourse(token, {
      ...newCourse,
      department_id: Number(newCourse.department_id)
    });
    handleResult(result, 'Course created successfully.');
  };

  const createDepartment = async (e) => {
    e.preventDefault();
    const result = await api.createDepartment(token, newDepartment);
    handleResult(result, 'Department created successfully.');
  };

  const assignStudentToCourse = async (e) => {
    e.preventDefault();
    const result = await api.assignCourseToStudent(token, {
      course_id: Number(courseStudentAssign.course_id),
      student_id: Number(courseStudentAssign.student_id),
      section: courseStudentAssign.section
    });
    handleResult(result, 'Student assigned to course successfully.');
  };

  const assignTeacherToCourse = async (e) => {
    e.preventDefault();
    const result = await api.assignCourseToTeacher(token, {
      course_id: Number(courseTeacherAssign.course_id),
      teacher_id: Number(courseTeacherAssign.teacher_id),
      section: courseTeacherAssign.section
    });
    handleResult(result, 'Teacher assigned to course successfully.');
  };

  const fetchStudentForUpdate = async () => {
    if (!updateStudentId) return;
    setLoadingUpdate(true);
    try {
      const result = await api.getStudentById(token, Number(updateStudentId));
      if (result.success) {
        setUpdateStudentData({
          student_id: result.student.student_id,
          stu_name: result.student.stu_name,
          level: result.student.level,
          term: result.student.term,
          role: result.student.role,
          department_id: result.student.department_id,
          password: result.student.password || ''
        });
        setError('');
      } else {
        setError(result.message || 'Failed to fetch student');
      }
    } catch {
      setError('Unable to fetch student');
    }
    setLoadingUpdate(false);
  };

  const fetchTeacherForUpdate = async () => {
    if (!updateTeacherId) return;
    setLoadingUpdate(true);
    try {
      const result = await api.getTeacherById(token, Number(updateTeacherId));
      if (result.success) {
        setUpdateTeacherData({
          teacher_id: result.teacher.teacher_id,
          teacher_name: result.teacher.teacher_name,
          department_id: result.teacher.department_id,
          password: result.teacher.password || ''
        });
        setError('');
      } else {
        setError(result.message || 'Failed to fetch teacher');
      }
    } catch {
      setError('Unable to fetch teacher');
    }
    setLoadingUpdate(false);
  };

  const fetchCourseForUpdate = async () => {
    if (!updateCourseId) return;
    setLoadingUpdate(true);
    try {
      const result = await api.getCourseById(token, Number(updateCourseId));
      if (result.success) {
        setUpdateCourseData({
          course_id: result.course.id,
          course_code: result.course.course_code,
          course_title: result.course.course_title,
          course_type: result.course.course_type,
          department_id: result.course.department_id
        });
        setError('');
      } else {
        setError(result.message || 'Failed to fetch course');
      }
    } catch {
      setError('Unable to fetch course');
    }
    setLoadingUpdate(false);
  };

  const deleteStudent = async () => {
    if (!updateStudentData.student_id) return;
    if (!confirm('Are you sure you want to delete this student?')) return;
    const result = await api.deleteStudent(token, Number(updateStudentData.student_id));
    handleResult(result, 'Student deleted successfully.');
  };

  const deleteTeacher = async () => {
    if (!updateTeacherData.teacher_id) return;
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    const result = await api.deleteTeacher(token, Number(updateTeacherData.teacher_id));
    handleResult(result, 'Teacher deleted successfully.');
  };

  const deleteCourse = async () => {
    if (!updateCourseData.course_id) return;
    if (!confirm('Are you sure you want to delete this course?')) return;
    const result = await api.deleteCourse(token, Number(updateCourseData.course_id));
    handleResult(result, 'Course deleted successfully.');
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    if (!updateStudentData.student_id) {
      setError('Student ID is required for update');
      return;
    }
    const result = await api.updateStudent(token, Number(updateStudentData.student_id), {
      stu_name: updateStudentData.stu_name,
      level: Number(updateStudentData.level),
      term: Number(updateStudentData.term),
      role: updateStudentData.role,
      department_id: Number(updateStudentData.department_id),
      password: updateStudentData.password
    });
    handleResult(result, 'Student updated successfully.');
  };

  const updateTeacher = async (e) => {
    e.preventDefault();
    if (!updateTeacherData.teacher_id) {
      setError('Teacher ID is required for update');
      return;
    }
    const result = await api.updateTeacher(token, Number(updateTeacherData.teacher_id), {
      teacher_name: updateTeacherData.teacher_name,
      department_id: Number(updateTeacherData.department_id),
      password: updateTeacherData.password
    });
    handleResult(result, 'Teacher updated successfully.');
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    if (!updateCourseData.course_id) {
      setError('Course ID is required for update');
      return;
    }
    const result = await api.updateCourse(token, Number(updateCourseData.course_id), {
      course_code: updateCourseData.course_code,
      course_title: updateCourseData.course_title,
      course_type: updateCourseData.course_type,
      department_id: Number(updateCourseData.department_id)
    });
    handleResult(result, 'Course updated successfully.');
  };

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Summary</button>
        <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>Create Entities</button>
        <button className={activeTab === 'assign' ? 'active' : ''} onClick={() => setActiveTab('assign')}>Assign Courses</button>
        <button className={activeTab === 'update' ? 'active' : ''} onClick={() => setActiveTab('update')}>Update Entities</button>
        <button className={activeTab === 'lists' ? 'active' : ''} onClick={() => setActiveTab('lists')}>Browse Data</button>
      </div>

      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}

      {activeTab === 'dashboard' && (
        <div className="admin-section">
          <h2>Admin Features</h2>
          <ul>
            <li>Create Student, Teacher, Course, Department</li>
            <li>Assign courses to students and teachers</li>
            <li>View all students, teachers, and courses</li>
            <li>Update existing students, teachers, and courses</li>
            <li>Delete students, teachers, and courses</li>
          </ul>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="admin-section admin-grid">
          <div className="admin-card">
            <h3>Create Student</h3>
            <form onSubmit={createStudent}>
              <input value={newStudent.student_id} onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })} placeholder="Student ID" required />
              <input value={newStudent.stu_name} onChange={(e) => setNewStudent({ ...newStudent, stu_name: e.target.value })} placeholder="Name" required />
              <input value={newStudent.level} onChange={(e) => setNewStudent({ ...newStudent, level: e.target.value })} placeholder="Level" required />
              <input value={newStudent.term} onChange={(e) => setNewStudent({ ...newStudent, term: e.target.value })} placeholder="Term" required />
              <select value={newStudent.department_id} onChange={(e) => setNewStudent({ ...newStudent, department_id: e.target.value })} required>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.dept_id} value={dept.dept_id}>{dept.name} ({dept.dept_code})</option>
                ))}
              </select>
              <select value={newStudent.role} onChange={(e) => setNewStudent({ ...newStudent, role: e.target.value })}>
                <option value="student">student</option>
                <option value="cr">cr</option>
              </select>
              <input type="password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} placeholder="Password" required />
              <button type="submit">Create Student</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Create Teacher</h3>
            <form onSubmit={createTeacher}>
              <input value={newTeacher.teacher_id} onChange={(e) => setNewTeacher({ ...newTeacher, teacher_id: e.target.value })} placeholder="Teacher ID" required />
              <input value={newTeacher.teacher_name} onChange={(e) => setNewTeacher({ ...newTeacher, teacher_name: e.target.value })} placeholder="Name" required />
              <select value={newTeacher.department_id} onChange={(e) => setNewTeacher({ ...newTeacher, department_id: e.target.value })} required>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.dept_id} value={dept.dept_id}>{dept.name} ({dept.dept_code})</option>
                ))}
              </select>
              <input type="password" value={newTeacher.password} onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })} placeholder="Password" required />
              <button type="submit">Create Teacher</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Create Course</h3>
            <form onSubmit={createCourse}>
              <input value={newCourse.course_code} onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })} placeholder="Course Code" required />
              <input value={newCourse.course_title} onChange={(e) => setNewCourse({ ...newCourse, course_title: e.target.value })} placeholder="Course Title" required />
              <select value={newCourse.course_type} onChange={(e) => setNewCourse({ ...newCourse, course_type: e.target.value })}>
                <option value="theory">theory</option>
                <option value="sessional">sessional</option>
              </select>
              <select value={newCourse.department_id} onChange={(e) => setNewCourse({ ...newCourse, department_id: e.target.value })} required>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.dept_id} value={dept.dept_id}>{dept.name} ({dept.dept_code})</option>
                ))}
              </select>
              <button type="submit">Create Course</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Create Department</h3>
            <form onSubmit={createDepartment}>
              <input value={newDepartment.name} onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })} placeholder="Department Name" required />
              <input value={newDepartment.dept_code} onChange={(e) => setNewDepartment({ ...newDepartment, dept_code: e.target.value })} placeholder="Department Code" required />
              <button type="submit">Create Department</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'assign' && (
        <div className="admin-section admin-grid">
          <div className="admin-card">
            <h3>Assign Course to Student</h3>
            <form onSubmit={assignStudentToCourse}>
              <input value={courseStudentAssign.course_id} onChange={(e) => setCourseStudentAssign({ ...courseStudentAssign, course_id: e.target.value })} placeholder="Course ID" required />
              <input value={courseStudentAssign.student_id} onChange={(e) => setCourseStudentAssign({ ...courseStudentAssign, student_id: e.target.value })} placeholder="Student ID" required />
              <input value={courseStudentAssign.section} onChange={(e) => setCourseStudentAssign({ ...courseStudentAssign, section: e.target.value })} placeholder="Section" required />
              <button type="submit">Assign Student</button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Assign Course to Teacher</h3>
            <form onSubmit={assignTeacherToCourse}>
              <input value={courseTeacherAssign.course_id} onChange={(e) => setCourseTeacherAssign({ ...courseTeacherAssign, course_id: e.target.value })} placeholder="Course ID" required />
              <input value={courseTeacherAssign.teacher_id} onChange={(e) => setCourseTeacherAssign({ ...courseTeacherAssign, teacher_id: e.target.value })} placeholder="Teacher ID" required />
              <input value={courseTeacherAssign.section} onChange={(e) => setCourseTeacherAssign({ ...courseTeacherAssign, section: e.target.value })} placeholder="Section" required />
              <button type="submit">Assign Teacher</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'update' && (
        <div className="admin-section admin-grid">
          <div className="admin-card">
            <h3>Update Student</h3>
            <div className="fetch-section">
              <input value={updateStudentId} onChange={(e) => setUpdateStudentId(e.target.value)} placeholder="Enter Student ID" />
              <button type="button" onClick={fetchStudentForUpdate} disabled={loadingUpdate}>
                {loadingUpdate ? 'Loading...' : 'Fetch Student'}
              </button>
            </div>
            <form onSubmit={updateStudent}>
              <input value={updateStudentData.student_id} onChange={(e) => setUpdateStudentData({ ...updateStudentData, student_id: e.target.value })} placeholder="Student ID" required readOnly />
              <input value={updateStudentData.stu_name} onChange={(e) => setUpdateStudentData({ ...updateStudentData, stu_name: e.target.value })} placeholder="Name" />
              <input value={updateStudentData.level} onChange={(e) => setUpdateStudentData({ ...updateStudentData, level: e.target.value })} placeholder="Level" />
              <input value={updateStudentData.term} onChange={(e) => setUpdateStudentData({ ...updateStudentData, term: e.target.value })} placeholder="Term" />
              <select value={updateStudentData.role} onChange={(e) => setUpdateStudentData({ ...updateStudentData, role: e.target.value })}>
                <option value="">Select role</option>
                <option value="student">student</option>
                <option value="cr">cr</option>
              </select>
              <select value={updateStudentData.department_id} onChange={(e) => setUpdateStudentData({ ...updateStudentData, department_id: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.dept_id} value={dept.dept_id}>{dept.name} ({dept.dept_code})</option>
                ))}
              </select>
              <input type="text" value={updateStudentData.password} onChange={(e) => setUpdateStudentData({ ...updateStudentData, password: e.target.value })} placeholder="Password" />
              <div className="button-group">
                <button type="submit">Update Student</button>
                <button type="button" onClick={deleteStudent} className="delete-btn">Delete Student</button>
              </div>
            </form>
          </div>

          <div className="admin-card">
            <h3>Update Teacher</h3>
            <div className="fetch-section">
              <input value={updateTeacherId} onChange={(e) => setUpdateTeacherId(e.target.value)} placeholder="Enter Teacher ID" />
              <button type="button" onClick={fetchTeacherForUpdate} disabled={loadingUpdate}>
                {loadingUpdate ? 'Loading...' : 'Fetch Teacher'}
              </button>
            </div>
            <form onSubmit={updateTeacher}>
              <input value={updateTeacherData.teacher_id} onChange={(e) => setUpdateTeacherData({ ...updateTeacherData, teacher_id: e.target.value })} placeholder="Teacher ID" required readOnly />
              <input value={updateTeacherData.teacher_name} onChange={(e) => setUpdateTeacherData({ ...updateTeacherData, teacher_name: e.target.value })} placeholder="Name" />
              <select value={updateTeacherData.department_id} onChange={(e) => setUpdateTeacherData({ ...updateTeacherData, department_id: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.dept_id} value={dept.dept_id}>{dept.name} ({dept.dept_code})</option>
                ))}
              </select>
              <input type="text" value={updateTeacherData.password} onChange={(e) => setUpdateTeacherData({ ...updateTeacherData, password: e.target.value })} placeholder="Password" />
              <div className="button-group">
                <button type="submit">Update Teacher</button>
                <button type="button" onClick={deleteTeacher} className="delete-btn">Delete Teacher</button>
              </div>
            </form>
          </div>

          <div className="admin-card">
            <h3>Update Course</h3>
            <div className="fetch-section">
              <input value={updateCourseId} onChange={(e) => setUpdateCourseId(e.target.value)} placeholder="Enter Course ID" />
              <button type="button" onClick={fetchCourseForUpdate} disabled={loadingUpdate}>
                {loadingUpdate ? 'Loading...' : 'Fetch Course'}
              </button>
            </div>
            <form onSubmit={updateCourse}>
              <input value={updateCourseData.course_id} onChange={(e) => setUpdateCourseData({ ...updateCourseData, course_id: e.target.value })} placeholder="Course ID" required readOnly />
              <input value={updateCourseData.course_code} onChange={(e) => setUpdateCourseData({ ...updateCourseData, course_code: e.target.value })} placeholder="Course Code" />
              <input value={updateCourseData.course_title} onChange={(e) => setUpdateCourseData({ ...updateCourseData, course_title: e.target.value })} placeholder="Course Title" />
              <select value={updateCourseData.course_type} onChange={(e) => setUpdateCourseData({ ...updateCourseData, course_type: e.target.value })}>
                <option value="">Select course type</option>
                <option value="theory">theory</option>
                <option value="sessional">sessional</option>
              </select>
              <select value={updateCourseData.department_id} onChange={(e) => setUpdateCourseData({ ...updateCourseData, department_id: e.target.value })}>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.dept_id} value={dept.dept_id}>{dept.name} ({dept.dept_code})</option>
                ))}
              </select>
              <div className="button-group">
                <button type="submit">Update Course</button>
                <button type="button" onClick={deleteCourse} className="delete-btn">Delete Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'lists' && (
        <div className="admin-section">
          <div className="entity-table-wrapper">
            <h3>Students</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Term</th>
                  <th>Role</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(students) ? students : []).map((s) => (
                  <tr key={s.student_id}>
                    <td>{s.student_id}</td>
                    <td>{s.stu_name}</td>
                    <td>{s.level}</td>
                    <td>{s.term}</td>
                    <td>{s.student_role ?? s.role}</td>
                    <td>{s.department_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="entity-table-wrapper">
            <h3>Teachers</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(teachers) ? teachers : []).map((t) => (
                  <tr key={t.teacher_id}>
                    <td>{t.teacher_id}</td>
                    <td>{t.teacher_name}</td>
                    <td>{t.department_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="entity-table-wrapper">
            <h3>Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(courses) ? courses : []).map((c) => (
                  <tr key={c.id || c.course_id}>
                    <td>{c.id || c.course_id}</td>
                    <td>{c.course_code}</td>
                    <td>{c.course_title}</td>
                    <td>{c.course_type}</td>
                    <td>{c.department_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
