'use client';

import { WeekPlan as WeekPlanType, Meal } from '../types/meal';
import DayPlan from './DayPlan';
import { useState } from 'react';

// Return a local YYYY-MM-DD string for a Date or ISO string
function localYMD(input: string | Date) {
  const d = typeof input === 'string' ? new Date(input) : input;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

interface WeekPlanProps {
  weekPlan: WeekPlanType;
  onAddMeal: (date: string, meal: Meal) => void;
  onUpdateMeal: (date: string, meal: Meal) => void;
  onDeleteMeal: (date: string, type: 'breakfast' | 'lunch' | 'dinner') => void;
}

export default function WeekPlan({ weekPlan, onAddMeal, onUpdateMeal, onDeleteMeal }: WeekPlanProps) {
  const today = localYMD(new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const selectedDay = weekPlan.days.find(day => localYMD(day.date) === selectedDate);

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm min-h-[600px]">
      {/* Mobile Day Selector */}
      <div className="lg:hidden overflow-x-auto py-2 px-4 border-b bg-white sticky top-0 z-10">
        <div className="flex gap-2">
          {weekPlan.days.map((day, index) => {
            const date = new Date(day.date);
            const isToday = localYMD(day.date) === today;
            const isSelected = localYMD(day.date) === selectedDate;
            const totalMeals = [day.breakfast, day.lunch, day.dinner].filter(Boolean).length;

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(localYMD(day.date))}
                className={`flex-shrink-0 p-3 flex flex-col items-center rounded-lg transition-colors min-w-[80px]
                  ${isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                <span className="text-sm font-medium">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-2xl font-bold my-1">
                  {date.getDate()}
                </span>
                {totalMeals > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                    {totalMeals}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Desktop Navigation Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 border-r overflow-y-auto max-h-[calc(100vh-8rem)]">
          <nav className="space-y-1 p-4">
            {weekPlan.days.map((day, index) => {
              const date = new Date(day.date);
              const isToday = localYMD(day.date) === today;
              const isSelected = localYMD(day.date) === selectedDate;
              const totalMeals = [day.breakfast, day.lunch, day.dinner].filter(Boolean).length;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(localYMD(day.date))}
                  className={`w-full px-4 py-3 flex items-center justify-between rounded-lg transition-colors
                    ${isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}
                    ${isToday ? 'border-l-4 border-blue-500' : ''}
                  `}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                    <span className="text-sm text-gray-500">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      totalMeals > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {totalMeals} meals
                    </span>
                    {isToday && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {selectedDay && (
            <DayPlan
              day={selectedDay}
              onAddMeal={(meal) => onAddMeal(selectedDay.date, meal)}
              onUpdateMeal={(meal) => onUpdateMeal(selectedDay.date, meal)}
              onDeleteMeal={(type) => onDeleteMeal(selectedDay.date, type)}
              isToday={localYMD(selectedDay.date) === today}
            />
          )}
        </div>
      </div>
    </div>
  );
}
