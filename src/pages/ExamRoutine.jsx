// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { api } from '../utils/api';
// import ExamCard from '../components/ExamCard';
// import ExamMaterialsModal from '../components/ExamMaterialsModal';
// import CreateExamScheduleModal from '../components/CreateExamScheduleModal'; // Import the new modal
// import './ExamRoutine.css';


// const ExamRoutine = () => {
//   const { token, user } = useAuth(); // Get user to check CR role
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedExam, setSelectedExam] = useState(null);
  
//   // States for creation
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newSlotData, setNewSlotData] = useState(null);

//   useEffect(() => {
//     fetchExamRoutine();
//   }, []);

//   const fetchExamRoutine = async () => {
//     try {
//       const data = await api.getExamRoutine(token);
//       setExams(data.exams || []);
//     } catch (err) {
//       setError('Failed to load exam routine');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddClick = (dateStr) => {
//     setNewSlotData({ date: dateStr });
//     setShowCreateModal(true);
//   };

//   const handleExamClick = (exam) => {
//     setSelectedExam(exam);
//   };

//   const groupExamsByDate = () => {
//     const grouped = {};
//     const dates = [];
//     for (let i = 0; i < 7; i++) {
//       const date = new Date();
//       date.setDate(date.getDate() + i);
//       const dateStr = date.toISOString().split('T')[0];
//       dates.push(dateStr);
//       grouped[dateStr] = [];
//     }
//     exams.forEach(exam => {
//       const examDate = exam.date?.split('T')[0];
//       if (grouped[examDate]) grouped[examDate].push(exam);
//     });
//     return { grouped, dates };
//   };

//   const { grouped, dates } = groupExamsByDate();

//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
//   };

//   if (loading) return <div className="loading">Loading exam routine...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="exam-routine-page">
//       <h1>Exam Routine</h1>
      
//       <div className="exam-timeline">
//         {dates.map((dateStr) => (
//           <div key={dateStr} className="exam-date-section">
//             <div className="date-header">{formatDate(dateStr)}</div>
//             <div className="exam-cards-container">
//               {grouped[dateStr].map((exam) => (
//                 <ExamCard
//                   key={exam.id}
//                   exam={exam}
//                   onClick={() => handleExamClick(exam)}
//                 />
//               ))}

//               {/* Show + Add block only for CR */}
//               {user?.studentRole === 'CR' && (
//                 <div className="add-exam-slot" onClick={() => handleAddClick(dateStr)}>
//                   <span className="plus-icon">+</span>
//                   <span className="add-text">Add Exam</span>
//                 </div>
//               )}

//               {grouped[dateStr].length === 0 && user?.studentRole !== 'cr' && (
//                 <div className="no-exams">No exams scheduled</div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedExam && (
//         <ExamMaterialsModal
//           exam={selectedExam}
//           onClose={() => setSelectedExam(null)}
//           canUpdate={user?.studentRole === 'cr' || user?.studentRole === 'CR'} // small cr
//         />
//       )}

//       {showCreateModal && (
//         <CreateExamScheduleModal
//           slotData={newSlotData}
//           onClose={() => setShowCreateModal(false)}
//           onSuccess={() => {
//             setShowCreateModal(false);
//             fetchExamRoutine();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ExamRoutine;



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
  const isCR = user?.studentRole?.toLowerCase() === 'cr' || user?.role === 'teacher';

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

  // ── FIX 1: extract local date as YYYY-MM-DD without using toISOString() ─
  // toISOString() always returns UTC — in Dhaka (UTC+6) the first ~6 hours
  // of the day would produce yesterday's date string.
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
      console.log('exam.date from backend:', exam.date, '→ parsed as:', examDate); // ADD THIS
      if (grouped[examDate]) grouped[examDate].push(exam);
    });
    console.log('generated date keys:', dates); // ADD THIS
    return { grouped, dates };
  };

  const { grouped, dates } = groupExamsByDate();

  // ── FIX 3: append T00:00 to force local midnight ─────────────────────────
  // new Date("2024-03-24") is parsed as UTC midnight.
  // In Dhaka that is 6 PM on March 23 — so .getDay() returns the wrong day.
  // "2024-03-24T00:00" (no Z) is parsed as LOCAL midnight — always correct.
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
                />
              ))}

              {/* ── FIX 4 applied here: was user?.studentRole === 'CR' ───── */}
              {isCR && (
                <div className="add-exam-slot" onClick={() => handleAddClick(dateStr)}>
                  <span className="plus-icon">+</span>
                  <span className="add-text">Add Exam</span>
                </div>
              )}

              {/* ── FIX 4 applied here: was user?.studentRole !== 'cr' ───── */}
              {grouped[dateStr].length === 0 && !isCR && (
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
          canUpdate={isCR}
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
        />
      )}
    </div>
  );
};

export default ExamRoutine;
