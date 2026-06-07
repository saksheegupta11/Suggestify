import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import type { Complaint, User } from "../types";

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;

  // Complaints
  complaints: Complaint[];
  loading: boolean;
  addComplaint: (formData: FormData) => Promise<string>;
  updateComplaintStatus: (id: string, status: Complaint["status"]) => Promise<void>;
  getComplaintById: (id: string) => Complaint | undefined;
  generateAIPlan: (id: string) => Promise<string>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          setCurrentUser(data);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Fetch complaints whenever user changes
  useEffect(() => {
    if (!currentUser) {
      setComplaints([]);
      return;
    }
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/issues");
        // Add location if needed (backend doesn't have it, so we set a placeholder)
        const enriched = data.map((c: any) => ({
          ...c,
          location: c.location || "Campus",
          department: c.department || "Unassigned",
        }));
        setComplaints(enriched);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      }
    };
    fetchComplaints();
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setCurrentUser(data);
  };

  const register = async (formData: FormData) => {
    const { data } = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    localStorage.setItem("token", data.token);
    setCurrentUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const addComplaint = async (formData: FormData): Promise<string> => {
    const { data } = await api.post("/issues", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setComplaints((prev) => [data, ...prev]);
    return data._id;
  };

  const updateComplaintStatus = async (id: string, status: Complaint["status"]) => {
    await api.put(`/issues/${id}/status`, { status });
    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status } : c))
    );
  };

  const getComplaintById = (id: string) => complaints.find((c) => c._id === id);

  const generateAIPlan = async (id: string): Promise<string> => {
    const { data } = await api.post(`/issues/${id}/ai-plan`);
    return data.plan;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser,
        complaints,
        loading,
        addComplaint,
        updateComplaintStatus,
        getComplaintById,
        generateAIPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}