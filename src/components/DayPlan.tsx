'use client';

import { DayPlan as DayPlanType, Meal } from '../types/meal';
import MealCard from './MealCard';

interface DayPlanProps {
  day: DayPlanType;
  onAddMeal: (meal: Meal) => void;
  onUpdateMeal: (meal: Meal) => void;
  onDeleteMeal?: (type: 'breakfast' | 'lunch' | 'dinner') => void;
  isToday?: boolean;
}

export default function DayPlan({ day, onAddMeal, onUpdateMeal, onDeleteMeal, isToday }: DayPlanProps) {
  const date = new Date(day.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`mb-8 pb-4 border-b ${isToday ? 'border-blue-400' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`font-bold text-2xl ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
              {dayName}
            </h2>
            <p className="text-lg text-gray-500 mt-1">{dateStr}</p>
          </div>
          {isToday && (
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
              Today
            </span>
          )}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 uppercase tracking-wider font-medium mb-4">
          <span className="w-4 h-0.5 bg-gray-200"></span>
          <span>Meals for the Day</span>
          <span className="flex-1 h-0.5 bg-gray-200"></span>
        </div>
        <MealCard
          meal={day.breakfast}
          type="breakfast"
          onAddMeal={onAddMeal}
          onUpdateMeal={onUpdateMeal}
          onDeleteMeal={onDeleteMeal ? () => onDeleteMeal('breakfast') : undefined}
        />
        <MealCard
          meal={day.lunch}
          type="lunch"
          onAddMeal={onAddMeal}
          onUpdateMeal={onUpdateMeal}
          onDeleteMeal={onDeleteMeal ? () => onDeleteMeal('lunch') : undefined}
        />
        <MealCard
          meal={day.dinner}
          type="dinner"
          onAddMeal={onAddMeal}
          onUpdateMeal={onUpdateMeal}
          onDeleteMeal={onDeleteMeal ? () => onDeleteMeal('dinner') : undefined}
        />
      </div>
    </div>
  );
}
