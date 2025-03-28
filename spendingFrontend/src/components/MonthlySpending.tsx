import React from 'react';
import { ChevronUp, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthlySpending {
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface SortIconProps {
  field: 'date' | 'category' | 'amount';
  currentField: string;
  direction: 'asc' | 'desc';
}

interface MonthlySpendingProps {
  spending: MonthlySpending[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  sortField: 'date' | 'category' | 'amount';
  sortDirection: 'asc' | 'desc';
  selectedSpending: MonthlySpending | null;
  showModal: boolean;
  onSort: (field: 'date' | 'category' | 'amount') => void;
  onRowClick: (spending: MonthlySpending) => void;
  onCloseModal: () => void;
  onPageChange: (page: number) => void;
}

function SortIcon({ field, currentField, direction }: SortIconProps) {
  if (field !== currentField) {
    return <ChevronUp className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
  }
  return direction === 'asc'
    ? <ChevronUp className="h-4 w-4 text-accent" />
    : <ChevronDown className="h-4 w-4 text-accent" />;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const delta = 2; // Number of pages to show on each side of current page
  const range: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Always show first page
      i === totalPages || // Always show last page
      (i >= currentPage - delta && i <= currentPage + delta) // Show pages around current page
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
}

export function MonthlySpending({
  spending,
  currentPage,
  totalPages,
  itemsPerPage,
  sortField,
  sortDirection,
  selectedSpending,
  showModal,
  onSort,
  onRowClick,
  onCloseModal,
  onPageChange,
}: MonthlySpendingProps) {
  const totalTransactions = spending.length * totalPages;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalTransactions);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-medium text-dark">Monthly Spending</h2>
        <p className="text-sm text-gray-500">
          {totalTransactions} transactions found
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="date" currentField={sortField} direction={sortDirection} />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => onSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <SortIcon field="category" currentField={sortField} direction={sortDirection} />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => onSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <SortIcon field="amount" currentField={sortField} direction={sortDirection} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {spending.map((item, index) => (
              <tr
                key={`${item.date}-${item.category}-${index}`}
                onClick={() => onRowClick(item)}
                className="cursor-pointer hover:bg-accent/10 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  ${item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            {spending.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No spending data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-dark bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-dark bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-dark">
                  Showing <span className="font-medium">{startIndex}</span> to{' '}
                  <span className="font-medium">{endIndex}</span> of{' '}
                  <span className="font-medium">{totalTransactions}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {visiblePages.map((page, index) => (
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-accent/10 border-accent text-dark'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span
                        key={index}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    )
                  ))}

                  <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && selectedSpending && (
        <div className="fixed inset-0 bg-dark bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-dark">Transaction Details</h3>
              <button
                onClick={onCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark">Date</label>
                <p className="mt-1 text-sm text-dark">
                  {formatDate(selectedSpending.date)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark">Category</label>
                <p className="mt-1 text-sm text-dark">{selectedSpending.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark">Amount</label>
                <p className="mt-1 text-sm text-dark">${selectedSpending.amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark">Description</label>
                <p className="mt-1 text-sm text-dark">{selectedSpending.description}</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={onCloseModal}
                className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}