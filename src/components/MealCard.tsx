'use client';

import { Meal } from '../types/meal';

interface MealCardProps {
  meal?: Meal;
  type: 'breakfast' | 'lunch' | 'dinner';
  onAddMeal?: (meal: Meal) => void;
  onUpdateMeal?: (meal: Meal) => void;
  onDeleteMeal?: () => void;
}

const mealTypeColors = {
  breakfast: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
  lunch: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
  dinner: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
};

const mealTypeIcons = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️'
};

import AddMealForm from './AddMealForm';
import { useState } from 'react';

export default function MealCard({ meal, type, onAddMeal, onUpdateMeal, onDeleteMeal }: MealCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!meal) {
    return (
      <>
        <div
          className={`p-4 lg:p-6 border-2 border-dashed rounded-xl ${mealTypeColors[type]} cursor-pointer min-h-[120px] lg:min-h-[180px] transition-all duration-300 active:scale-[0.98] lg:hover:scale-[1.02] group touch-manipulation`}
          onClick={() => setShowForm(true)}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2 lg:gap-3">
            <span className="text-3xl lg:text-4xl opacity-70 group-hover:scale-110 transition-transform duration-300">
              {mealTypeIcons[type]}
            </span>
            <span className="text-sm font-medium capitalize text-gray-600">
              Add {type}
            </span>
          </div>
        </div>
        {showForm && (
          <AddMealForm
            type={type}
            onAdd={(newMeal) => {
              if (onAddMeal) {
                onAddMeal(newMeal);
              }
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className="border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] lg:hover:scale-[1.02] relative touch-manipulation cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        <div className={`absolute top-0 left-0 w-1 h-full ${
          type === 'breakfast' ? 'bg-amber-400' :
          type === 'lunch' ? 'bg-emerald-400' :
          'bg-indigo-400'
        }`} />
        <div className="p-3 lg:p-4">
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xl flex-shrink-0">{mealTypeIcons[type]}</span>
              <h3 className="font-semibold text-base lg:text-lg text-gray-900 truncate">{meal.name}</h3>
            </div>
            {meal.calories && (
              <div className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                🔥 {meal.calories} cal
              </div>
            )}
          </div>
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="mt-3 lg:mt-4">
              <p className="text-xs uppercase tracking-wider text-gray-700 font-medium mb-2">Ingredients</p>
              <ul className="text-xs lg:text-sm text-gray-600 flex flex-wrap gap-1.5 lg:gap-2">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 lg:py-1 rounded">
                    <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    <span className="break-words">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {isEditing && (
        <AddMealForm
          type={type}
          initialMeal={meal}
          onAdd={(updatedMeal) => {
            if (onUpdateMeal) {
              onUpdateMeal(updatedMeal);
            }
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          onDelete={onDeleteMeal}
        />
      )}
    </>
  );
}
