import React, { useState, useEffect } from 'react';

const DatePicker = ({ startDate, endDate, onChange, minDate, maxDate, popularTimes }) => {
  const [currentMonth, setCurrentMonth] = useState(
    startDate ? new Date(startDate) : new Date()
  );
  const [hoveredDate, setHoveredDate] = useState(null);

  // Update current month when startDate changes
  useEffect(() => {
    if (startDate) {
      setCurrentMonth(new Date(startDate));
    }
  }, [startDate]);

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  // Parse date string to Date object
  const parseDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
  };

  // Get the number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      days.push({
        day,
        date: formatDate(date)
      });
    }
    
    return days;
  };

  // Check if date is in the past
  const isPastDate = (dateString) => {
    const date = parseDate(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today;
  };

  // Check if date is before minDate or after maxDate
  const isOutOfRange = (dateString) => {
    if (!dateString) return false;
    
    const date = parseDate(dateString);
    
    if (minDate && parseDate(minDate) > date) {
      return true;
    }
    
    if (maxDate && parseDate(maxDate) < date) {
      return true;
    }
    
    return false;
  };

  // Check if date is selected (start date or end date)
  const isSelected = (dateString) => {
    return dateString === startDate || dateString === endDate;
  };

  // Check if date is in the selected range
  const isInRange = (dateString) => {
    if (!startDate || !endDate || !dateString) return false;
    
    const date = parseDate(dateString);
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    return date > start && date < end;
  };

  // Check if date is being hovered and is valid for range selection
  const isHovered = (dateString) => {
    if (!startDate || endDate || !hoveredDate || !dateString) return false;
    
    const date = parseDate(dateString);
    const start = parseDate(startDate);
    const hovered = parseDate(hoveredDate);
    
    return date > start && date <= hovered;
  };

  // Get the popularity level of a date (based on popularTimes)
  const getPopularityLevel = (dateString) => {
    if (!popularTimes || !dateString) return 'normal';
    
    const date = new Date(dateString);
    const monthName = date.toLocaleString('en-US', { month: 'long' });
    
    if (popularTimes.peak_months && popularTimes.peak_months.includes(monthName)) {
      return 'peak';
    }
    
    if (popularTimes.off_peak_months && popularTimes.off_peak_months.includes(monthName)) {
      return 'off-peak';
    }
    
    return 'normal';
  };

  // Handle date click
  const handleDateClick = (dateString) => {
    if (!dateString || isPastDate(dateString) || isOutOfRange(dateString)) {
      return;
    }
    
    // If no dates selected or both dates selected, start new selection
    if (!startDate || (startDate && endDate)) {
      onChange(dateString, '');
      return;
    }
    
    // If start date is selected but not end date
    if (startDate && !endDate) {
      const start = parseDate(startDate);
      const selected = parseDate(dateString);
      
      // If clicked date is before start date, make it the new start date
      if (selected < start) {
        onChange(dateString, '');
      } else {
        // Otherwise, set it as end date
        onChange(startDate, dateString);
      }
    }
  };

  // Handle mouse enter on date
  const handleDateMouseEnter = (dateString) => {
    if (!dateString || isPastDate(dateString) || isOutOfRange(dateString)) {
      return;
    }
    
    setHoveredDate(dateString);
  };

  // Handle mouse leave on date
  const handleDateMouseLeave = () => {
    setHoveredDate(null);
  };

  // Go to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Go to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get month name and year for display
  const getMonthDisplay = () => {
    const options = { month: 'long', year: 'numeric' };
    return currentMonth.toLocaleDateString('en-US', options);
  };

  // Check if previous month button should be disabled
  const isPreviousMonthDisabled = () => {
    if (!minDate) return false;
    
    const minDateObj = parseDate(minDate);
    const firstDayOfCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const firstDayOfPreviousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    
    return firstDayOfPreviousMonth < minDateObj && firstDayOfCurrentMonth >= minDateObj;
  };

  // Generate calendar days
  const calendarDays = generateCalendarDays();
  
  // Day names for header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <button
          className="month-nav prev"
          onClick={goToPreviousMonth}
          disabled={isPreviousMonthDisabled()}
          aria-label="Previous month"
        >
          <span className="nav-arrow">\u2190</span>
        </button>
        <div className="current-month">{getMonthDisplay()}</div>
        <button
          className="month-nav next"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          <span className="nav-arrow">\u2192</span>
        </button>
      </div>
      
      <div className="date-picker-days">
        {dayNames.map((day, index) => (
          <div key={index} className="day-name">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${
              day.day ? 'has-date' : ''
            } ${
              isPastDate(day.date) ? 'past' : ''
            } ${
              isOutOfRange(day.date) ? 'out-of-range' : ''
            } ${
              isSelected(day.date) ? 'selected' : ''
            } ${
              isInRange(day.date) ? 'in-range' : ''
            } ${
              isHovered(day.date) ? 'hovered' : ''
            } ${
              day.date === startDate ? 'start-date' : ''
            } ${
              day.date === endDate ? 'end-date' : ''
            } ${
              getPopularityLevel(day.date)
            }`}
            onClick={() => handleDateClick(day.date)}
            onMouseEnter={() => handleDateMouseEnter(day.date)}
            onMouseLeave={handleDateMouseLeave}
          >
            {day.day && (
              <>
                <span className="day-number">{day.day}</span>
                {getPopularityLevel(day.date) !== 'normal' && (
                  <span className="popularity-indicator"></span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      {popularTimes && (
        <div className="popularity-legend">
          <div className="legend-item">
            <span className="legend-indicator peak"></span>
            <span>Peak Season</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator off-peak"></span>
            <span>Off Peak</span>
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .date-picker {
          background-color: var(--card-bg);
          border-radius: 0.75rem;
          overflow: hidden;
          width: 100%;
          max-width: 350px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .date-picker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background-color: var(--primary-light);
        }
        
        .current-month {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .month-nav {
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
        }
        
        .month-nav:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .month-nav:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .nav-arrow {
          font-size: 1.2rem;
        }
        
        .date-picker-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 0.5rem;
        }
        
        .day-name {
          text-align: center;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          padding: 0.5rem 0;
        }
        
        .calendar-day {
          position: relative;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
        }
        
        .calendar-day.has-date {
          cursor: pointer;
        }
        
        .calendar-day.past,
        .calendar-day.out-of-range {
          color: var(--text-muted);
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .day-number {
          z-index: 1;
          position: relative;
        }
        
        .calendar-day.selected,
        .calendar-day.start-date,
        .calendar-day.end-date {
          background-color: var(--secondary);
          color: var(--primary-dark);
          font-weight: 600;
          border-radius: 50%;
        }
        
        .calendar-day.in-range,
        .calendar-day.hovered {
          background-color: rgba(20, 184, 166, 0.2);
        }
        
        .calendar-day.start-date {
          border-radius: 50% 0 0 50%;
        }
        
        .calendar-day.end-date {
          border-radius: 0 50% 50% 0;
        }
        
        .calendar-day.start-date.end-date {
          border-radius: 50%;
        }
        
        .popularity-indicator {
          position: absolute;
          bottom: 3px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
        
        .calendar-day.peak .popularity-indicator {
          background-color: var(--danger);
        }
        
        .calendar-day.off-peak .popularity-indicator {
          background-color: var(--success);
        }
        
        .popularity-legend {
          display: flex;
          justify-content: center;
          gap: 1rem;
          padding: 0.75rem;
          font-size: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .legend-item {
          display: flex;
          align-items: center;
        }
        
        .legend-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 5px;
        }
        
        .legend-indicator.peak {
          background-color: var(--danger);
        }
        
        .legend-indicator.off-peak {
          background-color: var(--success);
        }
      `}</style>
    </div>
  );
};

export default DatePicker;