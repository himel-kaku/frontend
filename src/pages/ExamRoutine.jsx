import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import ExamCard from '../components/ExamCard';
import ExamMaterialsModal from '../components/ExamMaterialsModal';
import CreateExamScheduleModal from '../components/CreateExamScheduleModal';
import './ExamRoutine.css';


const ExamRoutine = () => {
  const { token, user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlotData, setNewSlotData] = useState(null);

  // ── FIX 4: normalize CR check once, use everywhere ──────────────────────
  const isEditor = user?.studentRole?.toLowerCase() === 'cr' || user?.role === 'teacher';

  useEffect(() => {
    fetchExamRoutine();
  }, []);

  const fetchExamRoutine = async () => {
    try {
      const data = await api.getExamRoutine(token);
      setExams(data.exams || []);
    } catch (err) {
      setError('Failed to load exam routine');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (dateStr) => {
    setNewSlotData({ date: dateStr });
    setShowCreateModal(true);
  };

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
  };

 
  const toLocalDateStr = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

 const groupExamsByDate = () => {
    const grouped = {};
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = toLocalDateStr(date);
      dates.push(dateStr);
      grouped[dateStr] = [];
    }
    exams.forEach(exam => {
      const examDate = exam.date?.split('T')[0];
      if (grouped[examDate]) grouped[examDate].push(exam);
    });
    return { grouped, dates };
  };

  const { grouped, dates } = groupExamsByDate();


  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00'); // ── FIX 3 applied here ──────
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (loading) return <div className="loading">Loading exam routine...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exam-routine-page">
      <h1>Exam Routine</h1>
      
      <div className="exam-timeline">
        {dates.map((dateStr) => (
          <div key={dateStr} className="exam-date-section">
            <div className="date-header">{formatDate(dateStr)}</div>
            <div className="exam-cards-container">
              {grouped[dateStr].map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onClick={() => handleExamClick(exam)}
                  isTeacher={user?.role === 'teacher'}
                />
              ))}

              {/* ── FIX 4 applied here: was user?.studentRole === 'CR' ───── */}
              {isEditor && (
                <div className="add-exam-slot" onClick={() => handleAddClick(dateStr)}>
                  <span className="plus-icon">+</span>
                  <span className="add-text">Add Exam</span>
                </div>
              )}

              {grouped[dateStr].length === 0 && !isEditor && (
                <div className="no-exams">No exams scheduled</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedExam && (
        <ExamMaterialsModal
          exam={selectedExam}
          onClose={() => setSelectedExam(null)}
          canUpdate={isEditor}
        />
      )}

      {showCreateModal && (
        <CreateExamScheduleModal
          slotData={newSlotData}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchExamRoutine();
          }}
          isTeacher={user?.role === 'teacher'}
        />
      )}
    </div>
  );
};

export default ExamRoutine;
