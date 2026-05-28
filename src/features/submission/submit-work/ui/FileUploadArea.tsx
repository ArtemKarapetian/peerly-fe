import { useFileUploadDropzone } from "../model/useFileUploadDropzone";

import { DropzonePrompt } from "./DropzonePrompt";
import { UploadConstraintsHint } from "./UploadConstraintsHint";
import { UploadErrorBanner } from "./UploadErrorBanner";
import { UploadingPlaceholder } from "./UploadingPlaceholder";

interface FileUploadAreaProps {
  acceptedFormats: string[];
  maxSizeMB: number;
  onFileSelected: (file: File) => void;
  onUploadError?: (error: string) => void;
  isUploading?: boolean;
  error?: string;
  disabled?: boolean;
}

export function FileUploadArea({
  acceptedFormats,
  maxSizeMB,
  onFileSelected,
  onUploadError,
  isUploading = false,
  error = "",
  disabled = false,
}: FileUploadAreaProps) {
  const {
    isDragging,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleClick,
    handleInputChange,
  } = useFileUploadDropzone({
    acceptedFormats,
    maxSizeMB,
    disabled,
    isUploading,
    onFileSelected,
    onUploadError,
  });

  const stateClass = isDragging
    ? "border-brand-primary bg-brand-primary-light"
    : error
      ? "border-error bg-error-light"
      : "border-border bg-card hover:border-brand-primary hover:bg-muted";
  const blockedClass = disabled || isUploading ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${stateClass} ${blockedClass}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <UploadingPlaceholder />
        ) : (
          <DropzonePrompt isDragging={isDragging} hasError={Boolean(error)} />
        )}
      </div>

      <UploadConstraintsHint acceptedFormats={acceptedFormats} maxSizeMB={maxSizeMB} />

      {error && <UploadErrorBanner message={error} />}
    </div>
  );
}
