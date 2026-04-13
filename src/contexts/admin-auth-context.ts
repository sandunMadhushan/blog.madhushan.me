import type { AdminUser } from "@/services/adminAuthService";
import { createContext } from "react";

export type AdminAuthContextValue = {
  admin: AdminUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);
