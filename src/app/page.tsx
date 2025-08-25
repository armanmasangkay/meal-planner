'use client';

import { useState, useEffect } from 'react';
import WeekPlan from '../components/WeekPlan';
import ClientWrapper from '../components/ClientWrapper';
import ShoppingList from '../components/ShoppingList';
import { WeekPlan as WeekPlanType, Meal } from '../types/meal';

function getWeekStartDate() {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start from Sunday
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
}

function getDatesForWeek(weekStartStr: string) {
  const weekStart = new Date(weekStartStr);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return {
      date: date.toISOString(),
    };
  });
}

export default function Home() {
  const [weekPlan, setWeekPlan] = useState<WeekPlanType>(() => {
    // Try to get saved data from localStorage on initial load
    if (typeof window !== 'undefined') {
      const savedPlan = localStorage.getItem('mealPlan');
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan);
        // Check if the saved plan is for the current week
        const savedStartDate = new Date(parsed.weekStartDate);
        const currentStartDate = new Date(getWeekStartDate());

        if (savedStartDate.toISOString().split('T')[0] === currentStartDate.toISOString().split('T')[0]) {
          return parsed;
        }
      }
    }

    // If no saved data or it's a different week, create new plan
    const weekStartDate = getWeekStartDate();
    return {
      weekStartDate: weekStartDate,
      days: getDatesForWeek(weekStartDate),
    };
  });

  useEffect(() => {
    // Save to localStorage whenever weekPlan changes
    localStorage.setItem('mealPlan', JSON.stringify(weekPlan));
  }, [weekPlan]);

  const handleAddMeal = (dateStr: string, meal: Meal) => {
    setWeekPlan(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.date.split('T')[0] === dateStr.split('T')[0]) {
          return {
            ...day,
            [meal.type]: meal,
          };
        }
        return day;
      }),
    }));
  };

  const handleUpdateMeal = (dateStr: string, meal: Meal) => {
    setWeekPlan(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.date.split('T')[0] === dateStr.split('T')[0]) {
          return {
            ...day,
            [meal.type]: meal,
          };
        }
        return day;
      }),
    }));
  };

  const handleDeleteMeal = (dateStr: string, type: 'breakfast' | 'lunch' | 'dinner') => {
    setWeekPlan(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.date.split('T')[0] === dateStr.split('T')[0]) {
          const { [type]: _unused, ...rest } = day; // eslint-disable-line @typescript-eslint/no-unused-vars
          return rest;
        }
        return day;
      }),
    }));
  };

  const weekStartDate = new Date(weekPlan.weekStartDate);
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto py-4 lg:py-6 px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Weekly Meal Plan</h1>
                <button
                  className="lg:hidden px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('mealPlan');
                    }
                    const weekStartDate = getWeekStartDate();
                    setWeekPlan({
                      weekStartDate: weekStartDate,
                      days: getDatesForWeek(weekStartDate),
                    });
                  }}
                >
                  <span>Reset</span>
                  <span>🔄</span>
                </button>
              </div>
              <p className="text-sm lg:text-base text-gray-500 mt-1">
                {weekStartDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })} - {
                  weekEndDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                }
              </p>
            </div>
            <button
              className="hidden lg:flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors items-center gap-2"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('mealPlan');
                }
                const weekStartDate = getWeekStartDate();
                setWeekPlan({
                  weekStartDate: weekStartDate,
                  days: getDatesForWeek(weekStartDate),
                });
              }}
            >
              <span>Reset Plan</span>
              <span>🔄</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-4 lg:py-8 px-0 lg:px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ClientWrapper>
              <WeekPlan
                weekPlan={weekPlan}
                onAddMeal={handleAddMeal}
                onUpdateMeal={handleUpdateMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            </ClientWrapper>
          </div>
          <div className="lg:w-96">
            <div className="lg:sticky lg:top-28">
              <ShoppingList days={weekPlan.days} />
            </div>
          </div>
        </div>
      </main>
      <footer className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>💪 Plan your meals for a healthier lifestyle</p>
      </footer>
    </div>
  );
}
