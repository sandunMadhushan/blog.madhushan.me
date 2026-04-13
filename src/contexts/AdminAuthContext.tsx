import { AdminAuthService, type AdminUser } from "@/services/adminAuthService";
import { AdminAuthContext } from "@/contexts/admin-auth-context";
import { useEffect, useMemo, useState } from "react";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await AdminAuthService.me();
      setAdmin(data.admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await AdminAuthService.login(username, password);
    setAdmin(data.admin);
  };

  const logout = async () => {
    await AdminAuthService.logout();
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ admin, loading, refresh, login, logout }),
    [admin, loading]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
