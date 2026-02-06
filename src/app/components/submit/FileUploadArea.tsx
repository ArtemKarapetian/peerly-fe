import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

/**
 * FileUploadArea - Drag & drop + file picker для загрузки файлов
 * 
 * Features:
 * - Drag & drop support
 * - Click to browse
 * - File format + size validation
 * - Progress bar during upload
 * - Error handling
 */

interface FileUploadAreaProps {
  acceptedFormats: string[]; // e.g., ['.zip', '.pdf']
  maxSizeMB: number;
  onFileSelected: (file: File) => void;
  onUploadStart?: () => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: () => void;
  onUploadError?: (error: string) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  disabled?: boolean;
}

export function FileUploadArea({
  acceptedFormats,
  maxSizeMB,
  onFileSelected,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  isUploading = false,
  uploadProgress = 0,
  error = '',
  disabled = false,
}: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = acceptedFormats.some((ext) => fileName.endsWith(ext.toLowerCase()));

    if (!hasValidExtension) {
      return `Недопустимый формат файла. Разрешены: ${acceptedFormats.join(', ')}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `Файл слишком большой. Максимум ${maxSizeMB} МБ.`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    // Clear previous errors
    onUploadError?.('');

    // Start upload simulation
    onUploadStart?.();
    onFileSelected(file);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onUploadProgress?.(progress);

      if (progress >= 100) {
        clearInterval(interval);
        onUploadComplete?.();
      }
    }, 200);
  };

  // Drag & drop handlers
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Click to browse
  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-[16px] p-8 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-[#5b8def] bg-[#f0f5ff]' 
            : error 
              ? 'border-[#ffb8b8] bg-[#fff5f5]'
              : 'border-[#d2def8] bg-white hover:border-[#a0b8f1] hover:bg-[#f9f9f9]'
          }
          ${(disabled || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          // Uploading state
          <div className="space-y-3">
            <div className="w-12 h-12 bg-[#d2e1f8] rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Upload className="w-6 h-6 text-[#5b8def]" />
            </div>
            <p className="text-[15px] text-[#21214f] font-medium">
              Загрузка... {uploadProgress}%
            </p>
            <div className="max-w-[300px] mx-auto bg-[#e6e8ee] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#5b8def] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          // Default state
          <div className="space-y-3">
            <div className={`w-12 h-12 ${error ? 'bg-[#ffb8b8]' : 'bg-[#d2e1f8]'} rounded-full mx-auto flex items-center justify-center`}>
              {error ? (
                <AlertCircle className="w-6 h-6 text-[#d4183d]" />
              ) : (
                <Upload className="w-6 h-6 text-[#5b8def]" />
              )}
            </div>
            <div>
              <p className="text-[15px] text-[#21214f] font-medium mb-1">
                {isDragging ? 'Отпустите файл' : 'Перетащите файл сюда'}
              </p>
              <p className="text-[13px] text-[#767692]">
                или{' '}
                <span className="text-[#5b8def] font-medium">выберите файл</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Format & size info */}
      <div className="flex items-start gap-2 text-[13px] text-[#767692]">
        <div className="shrink-0">ℹ️</div>
        <div>
          <p>
            <strong>Форматы:</strong> {acceptedFormats.join(', ')}
          </p>
          <p>
            <strong>Макс. размер:</strong> {maxSizeMB} МБ
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 bg-[#fff5f5] border border-[#ffb8b8] rounded-[8px] p-3">
          <AlertCircle className="w-4 h-4 text-[#d4183d] shrink-0 mt-0.5" />
          <p className="text-[13px] text-[#d4183d]">{error}</p>
        </div>
      )}
    </div>
  );
}
