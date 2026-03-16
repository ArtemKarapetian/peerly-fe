import { Monitor, MapPin, Clock, LogOut } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Session {
  id: string;
  deviceKey: string;
  locationKey: string;
  lastActiveKey: string;
  isCurrent: boolean;
}

const INITIAL_SESSIONS: Session[] = [
  {
    id: "1",
    deviceKey: "widget.activeSessions.chromeWindows",
    locationKey: "widget.activeSessions.moscowRussia",
    lastActiveKey: "widget.activeSessions.now",
    isCurrent: true,
  },
  {
    id: "2",
    deviceKey: "widget.activeSessions.safariIphone",
    locationKey: "widget.activeSessions.moscowRussia",
    lastActiveKey: "widget.activeSessions.twoHoursAgo",
    isCurrent: false,
  },
  {
    id: "3",
    deviceKey: "widget.activeSessions.firefoxMacos",
    locationKey: "widget.activeSessions.spbRussia",
    lastActiveKey: "widget.activeSessions.oneDayAgo",
    isCurrent: false,
  },
];

export function ActiveSessionsCard() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  const handleSignOutSession = (sessionId: string) => {
    if (confirm(t("widget.activeSessions.confirmEndSession"))) {
      setSessions(sessions.filter((s) => s.id !== sessionId));
    }
  };

  const handleSignOutAll = () => {
    if (confirm(t("widget.activeSessions.confirmEndAll"))) {
      setSessions(sessions.filter((s) => s.isCurrent));
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
            <Monitor className="w-5 h-5 text-accent-foreground" />
          </div>
          <h2 className="text-[20px] font-medium text-foreground">
            {t("widget.activeSessions.title")}
          </h2>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleSignOutAll}
            className="px-4 py-2 border-2 border-destructive text-destructive rounded-[12px] hover:bg-destructive/10 transition-colors text-[14px] font-medium"
          >
            {t("widget.activeSessions.endAll")}
          </button>
        )}
      </div>

      <p className="text-[14px] text-muted-foreground mb-6">
        {t("widget.activeSessions.subtitle")}
      </p>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`p-4 rounded-[12px] border-2 ${
              session.isCurrent ? "border-accent bg-accent/5" : "border-border bg-card"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-[15px] font-medium text-foreground">
                    {t(session.deviceKey)}
                  </h3>
                  {session.isCurrent && (
                    <span className="inline-flex px-2 py-1 bg-accent text-accent-foreground rounded-[6px] text-[11px] font-medium uppercase tracking-wide">
                      {t("widget.activeSessions.current")}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{t(session.locationKey)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {t("widget.activeSessions.lastActive")} {t(session.lastActiveKey)}
                    </span>
                  </div>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => handleSignOutSession(session.id)}
                  className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-[8px] transition-colors text-[14px]"
                  title={t("widget.activeSessions.endSessionTooltip")}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("widget.activeSessions.endSession")}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 1 && (
        <div className="mt-4 p-4 bg-muted rounded-[12px] text-center">
          <p className="text-[13px] text-muted-foreground">
            {t("widget.activeSessions.onlyOneSession")}
          </p>
        </div>
      )}
    </div>
  );
}
