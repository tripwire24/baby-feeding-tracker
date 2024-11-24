import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface AmountControlProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

export function AmountControl({ amount, onAmountChange }: AmountControlProps) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => onAmountChange(Math.max(0, amount - 10))}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <Minus className="w-6 h-6" />
      </button>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {amount}ml
      </div>
      <button
        onClick={() => onAmountChange(amount + 10)}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}