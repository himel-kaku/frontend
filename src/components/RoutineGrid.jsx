import React from 'react';
import './RoutineGrid.css';

const RoutineGrid = ({ routines, onRoutineClick, isEditor }) => {
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const formatTime12h = (time24) => {
    const hr = parseInt(time24.split(':')[0], 10);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const displayHr = hr % 12 || 12;
    return `${displayHr} ${ampm}`;
  };

  const getRoutineForSlot = (date, timeSlot) => {
    const dateStr = date.toISOString().split('T')[0];
    return routines.filter(routine => {
      const routineDate = routine.date?.split('T')[0];
      const routineStartTime = routine.startTime?.substring(0, 5);
      const routineEndTime = routine.endTime?.substring(0, 5);
      return routineDate === dateStr && (routineStartTime <= timeSlot && routineEndTime > timeSlot);
    });
  };

  const formatDate = (date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      sub: `${months[date.getMonth()]} ${date.getDate()}`
    };
  };

  return (
    <div className="routine-container-fixed">
      <div className="routine-grid">
        <div className="grid-header">
          <div className="corner-label">Day</div>
          {timeSlots.map((slot) => (
            <div key={slot} className="time-header">{formatTime12h(slot)}</div>
          ))}
        </div>

        {dates.map((date, dIdx) => {
          const formatted = formatDate(date);
          return (
            <div key={dIdx} className="grid-row">
              <div className="date-cell">
                <span className="day-name">{formatted.day}</span>
                <span className="date-sub">{formatted.sub}</span>
              </div>
              {timeSlots.map((timeSlot, tIdx) => (
                  <div 
                    key={tIdx} 
                    className={`routine-cell clickable-slot ${isEditor ? 'cr-clickable' : ''}`}
                    onClick={() => {
                      const existingRoutines = getRoutineForSlot(date, timeSlot);
                      if (existingRoutines.length === 0) {
                        // Use en-CA or manual parts to get YYYY-MM-DD without UTC shifting
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const localDateStr = `${year}-${month}-${day}`;

                        onRoutineClick({
                          isNew: true,
                          date: localDateStr, // Correct local date
                          startTime: timeSlot,
                          endTime: `${(parseInt(timeSlot.split(':')[0]) + 1).toString().padStart(2, '0')}:00`
                        });
                      }
                    }}
                  >
                    {getRoutineForSlot(date, timeSlot).map((routine, rIdx) => (
                      <div
                        key={rIdx}
                        className={`routine-block ${routine.courseType === 'theory' ? 'theory' : 'sessional'}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the empty slot click
                          onRoutineClick(routine);
                        }}
                      >
                        <div className="routine-code">{routine.courseCode}</div>
                        <div className="routine-room">{routine.room}, {routine.building_name}</div>
                      </div>
                    ))}
                  </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoutineGrid;