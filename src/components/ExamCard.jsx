import React from 'react';
import './ExamCard.css';

const ExamCard = ({ exam, onClick, isTeacher }) => {
  return (
    <div className="exam-card" onClick={onClick}>
      <div className="exam-card-header">
        <h3>
          {exam.courseCode}
          {isTeacher && exam.section ? ` (sec: ${exam.section})` : ''}
        </h3>
        <span className="exam-time">ExamTime: {exam.startTime} - {exam.endTime}</span>
      </div>
      <h4>{exam.courseTitle}</h4>
      <div className="exam-card-details">
        <p><strong>Venue:</strong> {exam.venue}</p>
        {exam.description && <p className="exam-description">{exam.description}</p>}
      </div>
    </div>
  );
};

export default ExamCard;
