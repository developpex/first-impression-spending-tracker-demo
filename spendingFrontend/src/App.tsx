import React, { useState, useEffect } from 'react';
import { Upload } from './components/Upload';
import { Filters } from './components/Filters';
import { MonthlySpending } from './components/MonthlySpending';

interface MonthlySpendingData {
  date: string;
  amount: number;
  category: string;
  description: string;
}

type SortField = 'date' | 'category' | 'amount';
type SortDirection = 'asc' | 'desc';

const serverUrl = '';
const ITEMS_PER_PAGE = 15;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpendingData[]>([]);
  const [selectedSpending, setSelectedSpending] = useState<MonthlySpendingData | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategory('');
    setSortField('date');
    setSortDirection('desc');
    setCurrentPage(1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

    const handleUpload = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!file) {
        console.warn("No file selected for upload.");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("csv_file", file);

      try {
        const response = await fetch(`${serverUrl}/upload_csv/`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed. Status: ${response.status}, Response: ${errorText}`);
        }

        fetchMonthlySpending();

        setFile(null);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
        console.info("Upload process finished.");
      }
    };


    const handleDeleteAll = async () => {
    try {
        fetch(`${serverUrl}/delete_all_transactions/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) throw new Error('Delete failed');
            return response.json();
        })
        .then(data => {
            console.log(data);
            return fetchMonthlySpending();
        })
        .then(() => setShowDeleteConfirm(false))
        .catch(error => console.error('Error deleting data:', error));
    } catch (error) {
        console.error('Error deleting data:', error);
    }
    };

  const fetchMonthlySpending = async () => {
    try {
      const response = await fetch(`${serverUrl}/get_monthly_spending/`);
      if (!response.ok) {
        throw new Error('Failed to fetch spending data');
      }
      const data = await response.json();
      setMonthlySpending(data);
    } catch (error) {
      console.error('Error fetching monthly spending:', error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const uniqueCategories = Array.from(new Set(monthlySpending.map(s => s.category))).sort();

  const filteredSpending = monthlySpending.filter(spending => {
    const date = new Date(spending.date);
    const matchesStartDate = !startDate || date >= new Date(startDate);
    const matchesEndDate = !endDate || date <= new Date(endDate);
    const matchesCategory = !selectedCategory || spending.category === selectedCategory;
    return matchesStartDate && matchesEndDate && matchesCategory;
  });

  const sortedSpending = [...filteredSpending].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    return sortDirection === 'asc'
      ? a.category.localeCompare(b.category)
      : b.category.localeCompare(a.category);
  });

  const totalPages = Math.ceil(sortedSpending.length / ITEMS_PER_PAGE);
  const paginatedSpending = sortedSpending.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchMonthlySpending();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, selectedCategory, sortField, sortDirection]);

  return (
    <div>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Left Column - Controls */}
          <div className="w-1/3 space-y-6">
            <Filters
              startDate={startDate}
              endDate={endDate}
              selectedCategory={selectedCategory}
              categories={uniqueCategories}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onCategoryChange={setSelectedCategory}
              onReset={resetFilters}
            />

            <Upload
              file={file}
              uploading={uploading}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
              showDeleteConfirm={showDeleteConfirm}
              onDeleteClick={() => setShowDeleteConfirm(true)}
              onDeleteConfirm={handleDeleteAll}
              onDeleteCancel={() => setShowDeleteConfirm(false)}
            />
          </div>

          {/* Right Column - Data View */}
          <div className="w-2/3">
            <MonthlySpending
              spending={paginatedSpending}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              sortField={sortField}
              sortDirection={sortDirection}
              selectedSpending={selectedSpending}
              showModal={showModal}
              onSort={handleSort}
              onRowClick={(spending) => {
                setSelectedSpending(spending);
                setShowModal(true);
              }}
              onCloseModal={() => setShowModal(false)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;