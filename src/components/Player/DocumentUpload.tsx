import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Loader, Download, Eye } from 'lucide-react';
import { uploadPlayerDocument, deletePlayerDocument } from '../../lib/storage';

interface DocumentUploadProps {
  onDocumentUpload: (documentUrl: string) => void;
  currentDocument?: string;
  playerId?: string;
  documentType: 'aadhar' | 'birth' | 'irbf';
  label: string;
  className?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onDocumentUpload,
  currentDocument,
  playerId,
  documentType,
  label,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(currentDocument || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);

    try {
      // Upload to Supabase
      const tempId = playerId || `temp-${Date.now()}`;
      const uploadedUrl = await uploadPlayerDocument(file, tempId, documentType);
      
      if (uploadedUrl) {
        setDocumentUrl(uploadedUrl);
        onDocumentUpload(uploadedUrl);
      } else {
        alert('Failed to upload document. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onDocumentUpload, playerId, documentType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const removeDocument = async () => {
    if (documentUrl) {
      try {
        await deletePlayerDocument(documentUrl);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
    setDocumentUrl(null);
    onDocumentUpload('');
  };

  const viewDocument = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const downloadDocument = () => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = `${label.replace(/\s+/g, '_')}_${playerId || 'document'}`;
      link.click();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {documentUrl ? (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Document Uploaded</p>
                <p className="text-xs text-gray-500">Click to view or download</p>
              </div>
            </div>
            
            {!uploading && (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={viewDocument}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title="View Document"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={downloadDocument}
                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  title="Download Document"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={removeDocument}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  title="Remove Document"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {uploading && (
              <Loader className="h-5 w-5 text-blue-600 animate-spin" />
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 text-blue-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {isDragActive ? 'Drop the file here' : 'Click or drag file here'}
              </p>
              <p className="text-xs text-gray-500">
                Supports: Images (JPG, PNG) and PDF (max 10MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;