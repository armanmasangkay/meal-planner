'use client';

import { useState } from 'react';
import { Meal } from '../types/meal';

const mealTypeIcons = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️'
};

interface AddMealFormProps {
  type: 'breakfast' | 'lunch' | 'dinner';
  date: string; // ISO date string
  initialMeal?: Meal;
  onAdd: (meal: Meal) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function AddMealForm({ type, date, initialMeal, onAdd, onCancel, onDelete }: AddMealFormProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  const [name, setName] = useState(initialMeal?.name || '');
  const [calories, setCalories] = useState(initialMeal?.calories?.toString() || '');
  const [ingredients, setIngredients] = useState(initialMeal?.ingredients?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meal: Meal = {
      id: initialMeal?.id || Math.random().toString(),
      name,
      type,
      calories: parseInt(calories) || undefined,
      ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i !== ''),
    };
    onAdd(meal);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start lg:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-b-2xl lg:rounded-xl p-4 lg:p-6 w-full max-w-md mt-0 lg:mt-0">
        <div className="space-y-4 mb-6 pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{mealTypeIcons[type]}</span>
              <h2 className="text-xl lg:text-2xl font-bold capitalize text-gray-900">
                {initialMeal ? 'Edit' : 'Add'} {type}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 -m-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500">📅</span>
            <p className="text-sm text-gray-600">{formattedDate}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Meal Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 bg-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
              required
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700">
              Calories (optional)
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 bg-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
              Ingredients (comma-separated)
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 bg-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
              placeholder="e.g., Eggs, Bread, Butter"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {initialMeal && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 lg:flex-none order-1 lg:order-none px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors active:bg-red-200"
              >
                Delete Meal
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 lg:flex-none px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors active:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 lg:flex-none px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors active:bg-blue-800"
            >
              {initialMeal ? 'Save Changes' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
