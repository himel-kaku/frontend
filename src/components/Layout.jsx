import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <aside className="left-sidebar">
        <div className="website-title">
             BUET
        </div>
        <div className="profile-section">
          <div className="profile-details">
            <p><strong>Name :</strong> {user?.name}</p>
            <p><strong>ID   :</strong> {user?.id}</p>
            <p><strong>Role :</strong> {user?.role}</p>
            {user?.departmentCode && <p><strong>Dept :</strong> {user?.departmentCode}</p>}
            { (user?.studentRole === 'cr' || user?.studentRole === 'CR') && (
                <>
                      <p><strong>Level:</strong> {user?.level}</p>
                      <p><strong>Term :</strong> {user?.term}</p>
                </>
            )}

            { (user?.studentRole === 'cr' || user?.studentRole === 'CR') && (
              <p className="cr-badge">Class Representative</p>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
        <nav className="navigation">
          <div className="navigation-bar">
            {user?.role?.toLowerCase() === 'admin' ? (
              <>
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
                  Admin Panel
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>
                  Courses
                </NavLink>
                <NavLink to="/class-routine" className={({ isActive }) => isActive ? 'active' : ''}>
                  Class Routine
                </NavLink>
                <NavLink to="/exam-routine" className={({ isActive }) => isActive ? 'active' : ''}>
                  Exam Routine
                </NavLink>
                <NavLink to="/class-resources" className={({ isActive }) => isActive ? 'active' : ''}>
                  Class Resources
                </NavLink>
                <NavLink to="/exam-resources" className={({ isActive }) => isActive ? 'active' : ''}>
                  Exam Resources
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;
