import { VersionCard } from "./VersionCard";
import type { Version } from "./VersionCard";

/**
 * VersionTimeline - Хронологический список версий работы
 *
 * Displays:
 * - Versions in reverse chronological order (newest first)
 * - Timeline connector between versions
 * - Version cards with all details
 */

interface VersionTimelineProps {
  versions: Version[];
  allowResubmissions: boolean;
  onDownload: (versionId: string) => void;
  onViewReports: (versionId: string) => void;
  onMakeCurrent?: (versionId: string) => void;
  onCreateNewVersion: () => void;
  onToggleSelect?: (versionId: string) => void;
  comparisonMode?: boolean;
}

export function VersionTimeline({
  versions,
  allowResubmissions,
  onDownload,
  onViewReports,
  onMakeCurrent,
  onCreateNewVersion,
  onToggleSelect,
  comparisonMode = false,
}: VersionTimelineProps) {
  if (versions.length === 0) {
    return null;
  }

  // Sort versions by version number descending (newest first)
  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
  const latestVersion = sortedVersions[0];

  return (
    <div className="space-y-6">
      {sortedVersions.map((version, index) => (
        <div key={version.id} className="relative">
          {/* Timeline connector */}
          {index < sortedVersions.length - 1 && (
            <div className="absolute left-6 top-full w-0.5 h-6 bg-[#e6e8ee]" />
          )}

          {/* Version dot */}
          <div className="absolute left-3 top-8 w-6 h-6 bg-[#5b8def] rounded-full border-4 border-white shadow-sm z-10" />

          {/* Version card with left padding for timeline */}
          <div className="ml-12">
            <VersionCard
              version={version}
              isLatest={version.id === latestVersion.id}
              allowResubmissions={allowResubmissions}
              onDownload={() => onDownload(version.id)}
              onViewReports={() => onViewReports(version.id)}
              onMakeCurrent={
                version.status === "draft" && onMakeCurrent
                  ? () => onMakeCurrent(version.id)
                  : undefined
              }
              onCreateNewVersion={onCreateNewVersion}
              onToggleSelect={onToggleSelect ? () => onToggleSelect(version.id) : undefined}
              comparisonMode={comparisonMode}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
