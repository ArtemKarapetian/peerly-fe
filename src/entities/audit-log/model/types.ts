export interface DemoAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
