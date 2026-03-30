import { Upload, AlertCircle } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

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
  error = "",
  disabled = false,
}: FileUploadAreaProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = acceptedFormats.some((ext) => fileName.endsWith(ext.toLowerCase()));

    if (!hasValidExtension) {
      return t("feature.submission.upload.invalidFormat", { formats: acceptedFormats.join(", ") });
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return t("feature.submission.upload.fileTooLarge", { max: maxSizeMB });
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
    onUploadError?.("");

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
          ${
            isDragging
              ? "border-brand-primary bg-brand-primary-light"
              : error
                ? "border-error bg-error-light"
                : "border-border bg-card hover:border-brand-primary hover:bg-muted"
          }
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          // Uploading state
          <div className="space-y-3">
            <div className="w-12 h-12 bg-brand-primary-light rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Upload className="w-6 h-6 text-brand-primary" />
            </div>
            <p className="text-[15px] text-foreground font-medium">
              {t("feature.submission.upload.uploading")} {uploadProgress}%
            </p>
            <div className="max-w-[300px] mx-auto bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-primary h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          // Default state
          <div className="space-y-3">
            <div
              className={`w-12 h-12 ${error ? "bg-error-light" : "bg-brand-primary-light"} rounded-full mx-auto flex items-center justify-center`}
            >
              {error ? (
                <AlertCircle className="w-6 h-6 text-destructive" />
              ) : (
                <Upload className="w-6 h-6 text-brand-primary" />
              )}
            </div>
            <div>
              <p className="text-[15px] text-foreground font-medium mb-1">
                {isDragging
                  ? t("feature.submission.upload.dropFile")
                  : t("feature.submission.upload.dragFileHere")}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {t("feature.submission.upload.or")}{" "}
                <span className="text-brand-primary font-medium">
                  {t("feature.submission.upload.browseFile")}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Format & size info */}
      <div className="flex items-start gap-2 text-[13px] text-muted-foreground">
        <div className="shrink-0">ℹ️</div>
        <div>
          <p>
            <strong>{t("feature.submission.upload.formats")}</strong> {acceptedFormats.join(", ")}
          </p>
          <p>
            <strong>{t("feature.submission.upload.maxSize")}</strong> {maxSizeMB}{" "}
            {t("feature.submission.upload.mb")}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 bg-error-light border border-error rounded-[8px] p-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-[13px] text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
