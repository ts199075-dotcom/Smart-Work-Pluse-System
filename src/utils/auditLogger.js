const AUDIT_STORAGE_KEY = "smart-workspace-audit-logs";

export const getAuditLogs = () => {
  try {
    const logs = localStorage.getItem(AUDIT_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Failed to load audit logs:", error);
    return [];
  }
};

export const addAuditLog = ({
  user,
  action,
  module,
  description,
  target = "",
}) => {
  if (!user || !action || !module || !description) {
    console.error("Invalid audit log data.");
    return;
  }

  const now = new Date();

  const newLog = {
    id: crypto.randomUUID(),
    user: user.name,
    email: user.email,
    role: user.role,
    action,
    module,
    description,
    target,
    date: [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-"),
    time: now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const logs = getAuditLogs();
  const updatedLogs = [newLog, ...logs];

  try {
    localStorage.setItem(
      AUDIT_STORAGE_KEY,
      JSON.stringify(updatedLogs)
    );

    window.dispatchEvent(new Event("auditLogsUpdated"));

    return newLog;
  } catch (error) {
    console.error("Failed to save audit log:", error);
    return null;
  }
};