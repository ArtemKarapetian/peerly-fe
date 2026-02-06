import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { formatSaveTime } from '@/app/utils/reviewDraft';

/**
 * SaveStatusIndicator - Shows save status with timestamp
 */

export type SaveStatus = 'unsaved' | 'saving' | 'saved' | 'error';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSavedTimestamp?: number;
}

export function SaveStatusIndicator({
  status,
  lastSavedTimestamp,
}: SaveStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'unsaved':
        return {
          icon: AlertCircle,
          text: 'Несохранённые изменения',
          color: 'text-[#f57c00]',
          bgColor: 'bg-[#fff8e1]',
        };
      case 'saving':
        return {
          icon: Loader2,
          text: 'Сохранение...',
          color: 'text-[#5b8def]',
          bgColor: 'bg-[#e9f5ff]',
          animate: true,
        };
      case 'saved':
        return {
          icon: Check,
          text: lastSavedTimestamp
            ? `Сохранено в ${formatSaveTime(lastSavedTimestamp)}`
            : 'Сохранено',
          color: 'text-[#4caf50]',
          bgColor: 'bg-[#e8f5e9]',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Ошибка сохранения',
          color: 'text-[#d4183d]',
          bgColor: 'bg-[#fff5f5]',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] ${config.bgColor}`}
    >
      <Icon
        className={`w-3.5 h-3.5 ${config.color} ${config.animate ? 'animate-spin' : ''}`}
      />
      <span className={`text-[12px] font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
}
