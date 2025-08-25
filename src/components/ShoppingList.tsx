'use client';

import { DayPlan } from '../types/meal';

interface ShoppingListProps {
  days: DayPlan[];
}

export default function ShoppingList({ days }: ShoppingListProps) {
  // Group all ingredients from all meals with case-insensitive matching
  const ingredients = days.reduce((acc, day) => {
    const meals = [day.breakfast, day.lunch, day.dinner].filter(Boolean);
    meals.forEach(meal => {
      if (meal?.ingredients) {
        meal.ingredients.forEach(ingredient => {
          // Create a normalized key (lowercase) for case-insensitive grouping
          const normalizedKey = ingredient.toLowerCase();

          // If this is the first occurrence, use the original capitalization
          if (!acc[normalizedKey]) {
            acc[normalizedKey] = {
              count: 1,
              displayName: ingredient // Keep the first capitalization we see
            };
          } else {
            acc[normalizedKey].count += 1;
            // If this version has a capital letter and the stored one doesn't,
            // use this capitalization instead
            if (
              ingredient[0] === ingredient[0].toUpperCase() &&
              acc[normalizedKey].displayName[0] === acc[normalizedKey].displayName[0].toLowerCase()
            ) {
              acc[normalizedKey].displayName = ingredient;
            }
          }
        });
      }
    });
    return acc;
  }, {} as Record<string, { count: number; displayName: string }>);

  const sortedIngredients = Object.entries(ingredients)
    .sort(([, a], [, b]) => a.displayName.localeCompare(b.displayName));

  if (sortedIngredients.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        Add some meals to generate your shopping list
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Shopping List</h2>
        <button
          onClick={async () => {
            const text = sortedIngredients
              .map(([, { displayName, count }]) => `${displayName} (${count}x)`)
              .join('\n');
            await navigator.clipboard.writeText(text);

            // Show temporary notification
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg';
            notification.textContent = '✓ Shopping list copied to clipboard!';
            document.body.appendChild(notification);

            // Remove notification after 2 seconds
            setTimeout(() => {
              notification.remove();
            }, 2000);
          }}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
        >
          <span>Copy List</span>
          <span>📋</span>
        </button>
      </div>
      <ul className="space-y-2">
        {sortedIngredients.map(([key, { displayName, count }]) => (
          <li
            key={key}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors group"
          >
            <span className="w-5 h-5 flex-shrink-0 rounded border border-gray-300 group-hover:border-blue-400 transition-colors" />
            <span className="flex-1 text-gray-900">{displayName}</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm tabular-nums">
              {count}x
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
