import React, { useRef } from 'react';
import { Upload as UploadIcon, Trash2, X } from 'lucide-react';

interface UploadProps {
  file: File | null;
  uploading: boolean;
  showDeleteConfirm: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: (event: React.FormEvent) => void;
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

export function Upload({
  file,
  uploading,
  showDeleteConfirm,
  onFileChange,
  onUpload,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel
}: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.FormEvent) => {
    await onUpload(event);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-dark mb-4">Upload Data</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center px-4 py-2 border-2 border-accent rounded-md shadow-sm text-sm font-medium text-dark bg-white hover:bg-accent/10 cursor-pointer transition-colors"
            >
              <UploadIcon className="h-5 w-5 mr-2" />
              {file ? file.name : 'Choose CSV File'}
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={onFileChange}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-dark mb-4">Danger Zone</h3>
          <button
            onClick={onDeleteClick}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Delete All Data
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-dark bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-dark">Confirm Delete</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete all spending data? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-4">
              <button
                onClick={onDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-dark bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Cancel
              </button>
              <button
                onClick={onDeleteConfirm}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}