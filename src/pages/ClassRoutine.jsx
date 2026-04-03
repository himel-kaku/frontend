import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import RoutineGrid from '../components/RoutineGrid';
import ClassMaterialsModal from '../components/ClassMaterialsModal';
import './ClassRoutine.css';


import CreateScheduleModal from '../components/CreateScheduleModal';


const ClassRoutine = () => {
  const { token, user } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlotData, setNewSlotData] = useState(null);

  useEffect(() => {
    fetchClassRoutine();
  }, []);

  const fetchClassRoutine = async () => {
    try {
      const data = await api.getClassRoutine(token);
      setRoutines(data.routine || []);
    } catch (err) {
      setError('Failed to load class routine');
    } finally {
      setLoading(false);
    }
  };

  const handleRoutineClick = (routine) => {
    if (routine.isNew) {
      // Only CR can click empty slots to create
      if (user?.role === 'cr' || user?.role==='teacher') {
        setNewSlotData(routine);
        setShowCreateModal(true);
      }
    } else {
      setSelectedRoutine(routine);
    }
  };

  const handleCloseModal = () => {
    setSelectedRoutine(null);
  };

  if (loading) return <div className="loading">Loading class routine...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="class-routine-page">
      <RoutineGrid routines={routines} onRoutineClick={handleRoutineClick} isEditor={user?.role === 'cr'|| user?.role === 'teacher'} />
      
      {selectedRoutine && (
        <ClassMaterialsModal
          routine={selectedRoutine}
          onClose={handleCloseModal}
          canUpload={user?.role === 'cr' || user?.role === 'teacher'}
        />
      )}

      {showCreateModal && (
        <CreateScheduleModal
          slotData={newSlotData}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchClassRoutine(); // Refresh the grid
          }}
          isTeacher={user?.role === 'teacher'}
        />
      )}
    </div>
  );
};

export default ClassRoutine;
