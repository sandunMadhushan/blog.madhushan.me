import { apiFetch } from "./api";

export type AdminUser = { id: string; username: string };

export class AdminAuthService {
  static async me() {
    return apiFetch<{ admin: AdminUser }>("/admin/me");
  }

  static async login(username: string, password: string) {
    return apiFetch<{ admin: AdminUser }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  static async logout() {
    return apiFetch<{ ok: boolean }>("/admin/logout", { method: "POST" });
  }
}
