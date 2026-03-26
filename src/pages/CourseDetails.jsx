import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClassResources from './ClassResources';
import ExamResources from './ExamResources';
import './CourseDetails.css';

const CourseDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  const [activeTab, setActiveTab] = useState('class');

  if (!course) {
    return <div>No course selected</div>;
  }

  return (
    <div className="course-details-page">

      {/* TOP BAR */}
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="tabs">
          <button
            className={activeTab === 'class' ? 'active' : ''}
            onClick={() => setActiveTab('class')}
          >
            Class Resources
          </button>

          <button
            className={activeTab === 'exam' ? 'active' : ''}
            onClick={() => setActiveTab('exam')}
          >
            Exam Resources
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content-area">
        {activeTab === 'class' ? (
          <ClassResources singleCourse={course} />
        ) : (
          <ExamResources singleCourse={course} />
        )}
      </div>
    </div>
  );
};

export default CourseDetails;