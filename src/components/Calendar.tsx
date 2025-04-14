import React from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { CycleDay } from '../types';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  cycleDays: CycleDay[];
}

export function Calendar({ selectedDate, onDateSelect, cycleDays }: CalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getFlowClass = (date: Date) => {
    const cycleDay = cycleDays.find(
      (day) => day.date === format(date, 'yyyy-MM-dd')
    );
    if (!cycleDay?.flow) return '';
    return {
      light: 'bg-pink-200',
      medium: 'bg-pink-400',
      heavy: 'bg-pink-600',
    }[cycleDay.flow];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-pink-500" />
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-gray-500 font-medium">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day.toString()}
            onClick={() => onDateSelect(day)}
            className={`
              h-10 rounded-full flex items-center justify-center
              ${getFlowClass(day)}
              ${
                format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                  ? 'ring-2 ring-pink-500'
                  : ''
              }
            `}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
}