import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

export function AdminShell() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold">
            Blog Admin
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{admin?.username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await logout();
                navigate("/admin/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto grid gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-border/60 bg-card/60 p-3">
          <nav className="space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "text-muted-foreground hover:bg-muted/60"
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/posts"
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "text-muted-foreground hover:bg-muted/60"
                }`
              }
            >
              Posts
            </NavLink>
            <NavLink
              to="/admin/medium"
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm ${
                  isActive
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "text-muted-foreground hover:bg-muted/60"
                }`
              }
            >
              Medium
            </NavLink>
          </nav>
        </aside>
        <main className="rounded-xl border border-border/60 bg-card/40 p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
