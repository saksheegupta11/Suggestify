import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  Outlet,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { AppProvider, useApp } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminPage } from "./pages/AdminPage";
import { AppearancePage } from "./pages/AppearancePage";
import { ComplaintDetailPage } from "./pages/ComplaintDetailPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage"; 
import { SubmitComplaintPage } from "./pages/SubmitComplaintPage";

// ============================================================
// ROUTE DEFINITIONS
// ============================================================

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const registerRoute = createRoute({ 
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// Auth guard wrapper
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  return <>{children}</>;
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/submit",
  component: () => (
    <RequireAuth>
      <SubmitComplaintPage />
    </RequireAuth>
  ),
});

const complaintDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/complaint/$id",
  component: () => (
    <RequireAuth>
      <ComplaintDetailPage />
    </RequireAuth>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <RequireAuth>
      <AdminPage />
    </RequireAuth>
  ),
});

const appearanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/appearance",
  component: () => (
    <RequireAuth>
      <AppearancePage />
    </RequireAuth>
  ),
});

// ============================================================
// ROUTER
// ============================================================

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute, 
  dashboardRoute,
  submitRoute,
  complaintDetailRoute,
  adminRoute,
  appearanceRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ============================================================
// APP ROOT
// ============================================================

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  );
}

// Suppress unused import warning
void redirect;