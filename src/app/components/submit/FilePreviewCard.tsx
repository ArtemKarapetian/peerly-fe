import { FileText, Download, Trash2, RefreshCw } from 'lucide-react';

/**
 * FilePreviewCard - Превью загруженного файла с действиями
 * 
 * Features:
 * - File info (name, size, upload time)
 * - Actions: Replace, Download, Delete
 */

export interface UploadedFile {
  id: string;
  name: string;
  size: number; // bytes
  uploadedAt: string; // e.g., "10:30, 25 января"
  url?: string; // for download
}

interface FilePreviewCardProps {
  file: UploadedFile;
  onReplace: () => void;
  onDownload: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function FilePreviewCard({
  file,
  onReplace,
  onDownload,
  onDelete,
  disabled = false,
}: FilePreviewCardProps) {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  // Get file icon based on extension
  const getFileIcon = () => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    // Different colors for different file types
    const colors: Record<string, string> = {
      pdf: 'bg-[#ffb8b8]',
      zip: 'bg-[#ffd4a3]',
      doc: 'bg-[#b7bdff]',
      docx: 'bg-[#b7bdff]',
      jpg: 'bg-[#b0e9fb]',
      jpeg: 'bg-[#b0e9fb]',
      png: 'bg-[#b0e9fb]',
      default: 'bg-[#d2e1f8]',
    };

    return colors[ext || 'default'] || colors.default;
  };

  return (
    <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
      <div className="flex items-start gap-4">
        {/* File icon */}
        <div className={`w-12 h-12 ${getFileIcon()} rounded-[8px] flex items-center justify-center shrink-0`}>
          <FileText className="w-6 h-6 text-[#21214f]" />
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium text-[#21214f] mb-1 truncate">
            {file.name}
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#767692]">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>Загружено {file.uploadedAt}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#e6e8ee]">
        <button
          onClick={onReplace}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-[#f9f9f9] hover:bg-[#e6e8ee] text-[#21214f] rounded-[8px] text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Заменить файл</span>
        </button>

        <button
          onClick={onDownload}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-[#f9f9f9] hover:bg-[#e6e8ee] text-[#21214f] rounded-[8px] text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Скачать</span>
        </button>

        <button
          onClick={onDelete}
          disabled={disabled}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#fff5f5] hover:bg-[#ffe6e6] text-[#d4183d] rounded-[8px] text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          <span>Удалить</span>
        </button>
      </div>
    </div>
  );
}
