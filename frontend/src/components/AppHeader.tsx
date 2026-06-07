import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Palette,
  PlusCircle,
  Settings,
  Shield,
  Sun,
  X,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { RoleBadge } from "./StatusBadge";

export function AppHeader() {
  const { currentUser, logout } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const initials =
    currentUser?.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const navLinks = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/dashboard",
      ocid: "nav.dashboard_link",
    },
    {
      label: "Submit Complaint",
      icon: PlusCircle,
      to: "/submit",
      ocid: "nav.submit_link",
    },
    ...(currentUser?.role === "admin"
      ? [
          {
            label: "Admin Panel",
            icon: Shield,
            to: "/admin",
            ocid: "nav.admin_link",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <img
              src="/favicon.png"
              alt="Suggestify Logo"
              className="w-8 h-8 object-contain rounded-lg"
            />
            <span className="font-display font-semibold text-lg text-foreground hidden sm:block">
              Suggestify
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.to}
                variant="ghost"
                size="sm"
                className="gap-2 text-sm"
                onClick={() => navigate({ to: link.to })}
                data-ocid={link.ocid}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode quick toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              data-ocid="nav.theme_toggle_button"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Notifications stub */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 pl-2 pr-1 h-9">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                    {currentUser?.name}
                  </span>
                  {currentUser?.role && (
                    <RoleBadge
                      role={currentUser.role}
                      className="hidden sm:inline-flex"
                    />
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-foreground">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {currentUser?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => navigate({ to: "/dashboard" })}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => navigate({ to: "/appearance" })}
                  data-ocid="nav.appearance_link"
                >
                  <Palette className="w-4 h-4" />
                  Appearance
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                  data-ocid="nav.logout_button"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Button
              key={link.to}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                navigate({ to: link.to });
                setMobileMenuOpen(false);
              }}
              data-ocid={link.ocid}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
            data-ocid="nav.logout_button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}
