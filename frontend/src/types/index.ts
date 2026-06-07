export type Role = "student" | "faculty" | "admin";

export type ComplaintStatus = "pending" | "in-progress" | "resolved";

export type ComplaintCategory =
  | "Infrastructure"
  | "Cleanliness"
  | "Safety"
  | "IT"
  | "Academic"
  | "Other";

export type Priority = "low" | "medium" | "high";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: Priority;
  submittedBy: User | string; // populated or just id
  resolvedBy?: User | string;
  aiPlan?: string; // plain text from Gemini
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Frontend-only fields (optional, for UI)
  location?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}