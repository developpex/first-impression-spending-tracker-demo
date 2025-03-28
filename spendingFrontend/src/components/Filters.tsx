import React from 'react';
import { RotateCcw } from 'lucide-react';

interface FiltersProps {
  startDate: string;
  endDate: string;
  selectedCategory: string;
  categories: string[];
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}

export function Filters({
  startDate,
  endDate,
  selectedCategory,
  categories,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onReset,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-dark">Filters</h2>
          <button
            onClick={onReset}
            className="inline-flex items-center text-accent hover:text-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-dark">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm h-[38px]"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-dark">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm h-[38px]"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-dark">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm h-[38px]"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}