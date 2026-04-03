import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import ClassRoutine from './pages/ClassRoutine';
import ExamRoutine from './pages/ExamRoutine';
import ClassResources from './pages/ClassResources';
import ExamResources from './pages/ExamResources';
import CourseDetails from './pages/CourseDetails';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
            <Route path="/courses" element={<Courses />} />
            <Route path="/class-routine" element={<ClassRoutine />} />
            <Route path="/exam-routine" element={<ExamRoutine />} />
            <Route path="/class-resources" element={<ClassResources />} />
            <Route path="/exam-resources" element={<ExamResources />} />
            <Route path="/course/:id" element={<CourseDetails />} />
          </Route>

          <Route path="/admin" element={<AdminRoute><Layout /></AdminRoute>}>
            <Route index element={<AdminPanel />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
