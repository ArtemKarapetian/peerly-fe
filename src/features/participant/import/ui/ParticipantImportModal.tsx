import { X, Upload, UserPlus, Key, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * ParticipantImportModal - Модальное окно импорта участников
 *
 * Возможности:
 * 1. CSV paste (name, surname, login) с preview
 * 2. Ручное добавление одного пользователя
 * 3. Генерация инвайт-кодов (демо)
 *
 * Валидация:
 * - Дубликаты логина
 * - Отсутствующие поля
 * - Inline-ошибки
 */

interface ParticipantImportModalProps {
  courseId: string;
  onClose: () => void;
}

interface ParsedUser {
  name: string;
  surname: string;
  login: string;
  error?: string;
}

type ImportMode = "csv" | "manual" | "invite";

export function ParticipantImportModal({
  courseId: _courseId,
  onClose,
}: ParticipantImportModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ImportMode>("csv");
  const [csvText, setCsvText] = useState("");
  const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Manual add fields
  const [manualName, setManualName] = useState("");
  const [manualSurname, setManualSurname] = useState("");
  const [manualLogin, setManualLogin] = useState("");

  // Invite codes
  const [inviteCount, setInviteCount] = useState(5);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  // Parse CSV text
  const handleParseCSV = () => {
    const lines = csvText.trim().split("\n");
    const users: ParsedUser[] = [];
    const seenLogins = new Set<string>();

    lines.forEach((line, _index) => {
      const parts = line.split(",").map((p) => p.trim());

      if (parts.length < 3) {
        users.push({
          name: parts[0] || "",
          surname: parts[1] || "",
          login: parts[2] || "",
          error: t("feature.participantImport.notAllFieldsFilled"),
        });
        return;
      }

      const [name, surname, login] = parts;

      // Validation
      let error: string | undefined;

      if (!name || !surname || !login) {
        error = t("feature.participantImport.notAllFieldsFilled");
      } else if (seenLogins.has(login)) {
        error = t("feature.participantImport.duplicateLogin", { login });
      } else if (login.length < 3) {
        error = t("feature.participantImport.loginTooShort");
      }

      if (!error) {
        seenLogins.add(login);
      }

      users.push({ name, surname, login, error });
    });

    setParsedUsers(users);
    setShowPreview(true);
  };

  // Add manual user
  const handleAddManual = () => {
    if (!manualName || !manualSurname || !manualLogin) {
      alert(t("feature.participantImport.fillAllFields"));
      return;
    }

    alert(
      t("feature.participantImport.userAdded", {
        name: manualName,
        surname: manualSurname,
        login: manualLogin,
      }),
    );
    setManualName("");
    setManualSurname("");
    setManualLogin("");
  };

  // Generate invite codes
  const handleGenerateInvites = () => {
    const codes: string[] = [];
    for (let i = 0; i < inviteCount; i++) {
      const code = `PEER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      codes.push(code);
    }
    setGeneratedCodes(codes);
  };

  // Import CSV users
  const handleImportCSV = () => {
    const validUsers = parsedUsers.filter((u) => !u.error);
    if (validUsers.length === 0) {
      alert(t("feature.participantImport.noValidUsers"));
      return;
    }
    alert(t("feature.participantImport.importedCount", { count: validUsers.length }));
    onClose();
  };

  const validCount = parsedUsers.filter((u) => !u.error).length;
  const errorCount = parsedUsers.filter((u) => u.error).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-[20px] w-full max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-border">
          <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px]">
            {t("feature.participantImport.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-[8px] transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b-2 border-border">
          <button
            onClick={() => setMode("csv")}
            className={`
              flex-1 px-4 py-3 text-[15px] font-medium transition-colors relative
              ${mode === "csv" ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <Upload className="w-4 h-4 inline-block mr-2" />
            {t("feature.participantImport.csvImport")}
            {mode === "csv" && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary"></div>
            )}
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`
              flex-1 px-4 py-3 text-[15px] font-medium transition-colors relative
              ${mode === "manual" ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <UserPlus className="w-4 h-4 inline-block mr-2" />
            {t("feature.participantImport.addManually")}
            {mode === "manual" && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary"></div>
            )}
          </button>
          <button
            onClick={() => setMode("invite")}
            className={`
              flex-1 px-4 py-3 text-[15px] font-medium transition-colors relative
              ${mode === "invite" ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <Key className="w-4 h-4 inline-block mr-2" />
            {t("feature.participantImport.inviteCodes")}
            {mode === "invite" && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* CSV Import Mode */}
          {mode === "csv" && (
            <div>
              <p className="text-[14px] text-muted-foreground mb-4">
                {t("feature.participantImport.csvHint")}{" "}
                <code className="bg-muted px-2 py-1 rounded">имя,фамилия,логин</code>
              </p>

              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Иван,Петров,ivan.petrov&#10;Мария,Сидорова,maria.sidorova&#10;Алексей,Смирнов,alex.smirnov"
                className="w-full h-[200px] p-4 border-2 border-border rounded-[12px] text-[14px] font-mono resize-none focus:outline-none focus:border-brand-primary transition-colors"
              />

              <button
                onClick={handleParseCSV}
                disabled={!csvText.trim()}
                className="mt-4 px-4 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors disabled:bg-muted disabled:cursor-not-allowed"
              >
                {t("feature.participantImport.parseAndPreview")}
              </button>

              {/* Preview */}
              {showPreview && parsedUsers.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[18px] font-medium text-foreground">
                      {t("feature.participantImport.preview")} ({parsedUsers.length})
                    </h3>
                    <div className="flex items-center gap-4 text-[13px]">
                      <span className="text-success flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {validCount} {t("feature.participantImport.valid")}
                      </span>
                      {errorCount > 0 && (
                        <span className="text-destructive flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errorCount} {t("feature.participantImport.errors")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-2 border-border rounded-[12px] overflow-hidden max-h-[300px] overflow-y-auto">
                    <table className="w-full text-[14px]">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="text-left px-3 py-2 text-[12px] font-medium text-muted-foreground uppercase">
                            {t("feature.participantImport.nameHeader")}
                          </th>
                          <th className="text-left px-3 py-2 text-[12px] font-medium text-muted-foreground uppercase">
                            {t("feature.participantImport.surnameHeader")}
                          </th>
                          <th className="text-left px-3 py-2 text-[12px] font-medium text-muted-foreground uppercase">
                            {t("feature.participantImport.loginHeader")}
                          </th>
                          <th className="text-left px-3 py-2 text-[12px] font-medium text-muted-foreground uppercase">
                            {t("feature.participantImport.statusHeader")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedUsers.map((user, index) => (
                          <tr
                            key={index}
                            className={`border-t border-border ${user.error ? "bg-error-light" : ""}`}
                          >
                            <td className="px-3 py-2">{user.name || "-"}</td>
                            <td className="px-3 py-2">{user.surname || "-"}</td>
                            <td className="px-3 py-2 font-mono text-[13px]">{user.login || "-"}</td>
                            <td className="px-3 py-2">
                              {user.error ? (
                                <span className="text-destructive text-[12px] flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  {user.error}
                                </span>
                              ) : (
                                <span className="text-success text-[12px] flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  OK
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={handleImportCSV}
                    disabled={validCount === 0}
                    className="mt-4 px-6 py-2 bg-success text-primary-foreground rounded-[12px] hover:bg-success/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed"
                  >
                    {t("feature.participantImport.importUsers", { count: validCount })}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Manual Add Mode */}
          {mode === "manual" && (
            <div>
              <p className="text-[14px] text-muted-foreground mb-4">
                {t("feature.participantImport.addOneManually")}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("feature.participantImport.nameLabel")}
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Иван"
                    className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("feature.participantImport.surnameLabel")}
                  </label>
                  <input
                    type="text"
                    value={manualSurname}
                    onChange={(e) => setManualSurname(e.target.value)}
                    placeholder="Петров"
                    className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("feature.participantImport.loginLabel")}
                  </label>
                  <input
                    type="text"
                    value={manualLogin}
                    onChange={(e) => setManualLogin(e.target.value)}
                    placeholder="ivan.petrov"
                    className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] font-mono focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                <button
                  onClick={handleAddManual}
                  className="w-full px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium"
                >
                  {t("feature.participantImport.addParticipant")}
                </button>
              </div>
            </div>
          )}

          {/* Invite Codes Mode */}
          {mode === "invite" && (
            <div>
              <p className="text-[14px] text-muted-foreground mb-4">
                {t("feature.participantImport.generateInviteDesc")}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("feature.participantImport.codeCount")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={inviteCount}
                    onChange={(e) => setInviteCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border-2 border-border rounded-[12px] text-[15px] focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>

                <button
                  onClick={handleGenerateInvites}
                  className="w-full px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors font-medium"
                >
                  {t("feature.participantImport.generateCodes")}
                </button>

                {generatedCodes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-[16px] font-medium text-foreground mb-3">
                      {t("feature.participantImport.generatedCodes")} ({generatedCodes.length})
                    </h3>
                    <div className="bg-muted border-2 border-border rounded-[12px] p-4 max-h-[300px] overflow-y-auto">
                      <div className="space-y-2 font-mono text-[14px]">
                        {generatedCodes.map((code, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-card rounded-[8px]"
                          >
                            <span className="text-foreground">{code}</span>
                            <button
                              onClick={() => void navigator.clipboard.writeText(code)}
                              className="text-[13px] text-brand-primary hover:underline"
                            >
                              {t("feature.participantImport.copy")}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-[12px] transition-colors"
          >
            {t("feature.participantImport.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
