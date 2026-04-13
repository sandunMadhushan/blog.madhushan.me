import { AdminShell } from "@/components/admin/AdminShell";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { PageFadeLayout } from "@/components/PageFadeLayout";
import { ScrollToTopFab } from "@/components/ScrollToTopFab";
import { ScrollToTopOnRoute } from "@/components/ScrollToTopOnRoute";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminMediumPage from "./pages/admin/AdminMediumPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostDetail from "./pages/PostDetail";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    forcedTheme="dark"
    enableSystem={false}
    disableTransitionOnChange
  >
    <AdminAuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SmoothScrollProvider>
              <ScrollToTopOnRoute />
              <Routes>
                <Route element={<PageFadeLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/posts/:slug" element={<PostDetail />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminShell />}>
                      <Route index element={<AdminDashboardPage />} />
                      <Route path="posts" element={<AdminPostsPage />} />
                      <Route path="medium" element={<AdminMediumPage />} />
                    </Route>
                  </Route>
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <ScrollToTopFab />
            </SmoothScrollProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AdminAuthProvider>
  </ThemeProvider>
);

export default App;
