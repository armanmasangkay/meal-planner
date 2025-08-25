export type Meal = {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  calories?: number;
  ingredients?: string[];
};

export type DayPlan = {
  date: string; // ISO string format
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
};

export type WeekPlan = {
  weekStartDate: string; // ISO string format
  days: DayPlan[];
};
