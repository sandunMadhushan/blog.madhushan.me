import { AdminAuthContext } from "@/contexts/admin-auth-context";
import { useContext } from "react";

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return value;
}
