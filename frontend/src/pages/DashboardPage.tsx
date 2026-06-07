import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  PlusCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { AppFooter } from "../components/AppFooter";
import { AppHeader } from "../components/AppHeader";
import { PriorityBadge, StatusBadge } from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import type { ComplaintCategory, ComplaintStatus, Priority } from "../types";

const STATUS_OPTIONS: { value: ComplaintStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const CATEGORY_OPTIONS: { value: ComplaintCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Cleanliness", label: "Cleanliness" },
  { value: "Safety", label: "Safety" },
  { value: "IT", label: "IT" },
  { value: "Academic", label: "Academic" },
  { value: "Other", label: "Other" },
];

const PRIORITY_OPTIONS: { value: Priority | "all"; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function DashboardPage() {
  const { currentUser, complaints } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  // Filter complaints for current user (non-admin sees only their own)
  const userComplaints = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "admin") return complaints;
    return complaints.filter((c) => {
      const submittedBy = typeof c.submittedBy === "string" ? c.submittedBy : c.submittedBy?._id;
      return submittedBy === currentUser._id;
    });
  }, [complaints, currentUser]);

  const filteredComplaints = useMemo(() => {
    return userComplaints.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(search.toLowerCase())) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchCategory = categoryFilter === "all" || c.category === categoryFilter;
      const matchPriority = priorityFilter === "all" || c.priority === priorityFilter;
      return matchSearch && matchStatus && matchCategory && matchPriority;
    });
  }, [userComplaints, search, statusFilter, categoryFilter, priorityFilter]);

  // Stats
  const stats = useMemo(
    () => ({
      open: userComplaints.filter((c) => c.status === "pending").length,
      inProgress: userComplaints.filter((c) => c.status === "in-progress").length,
      resolved: userComplaints.filter((c) => c.status === "resolved").length,
      total: userComplaints.length,
    }),
    [userComplaints],
  );

  const statCards = [
    {
      label: "My Open Issues",
      value: stats.open,
      icon: AlertCircle,
      color: "text-amber-600 dark:text-amber-500",
      bg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-500",
      bg: "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-500",
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20",
    },
    {
      label: "Total Submitted",
      value: stats.total,
      icon: FileText,
      color: "text-primary dark:text-primary",
      bg: "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/20",
    },
  ];

  const categoryColors: Record<string, string> = {
    Infrastructure: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    Cleanliness: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    Safety: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    IT: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    Academic: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    Other: "bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {currentUser?.role === "admin"
                ? "All Complaints"
                : "My Dashboard"}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Welcome back,{" "}
              <span className="font-medium text-foreground">
                {currentUser?.name}
              </span>
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: "/submit" })}
            className="gap-2 font-semibold shrink-0"
            data-ocid="dashboard.new_complaint_button"
          >
            <PlusCircle className="w-4 h-4" />
            Submit New Complaint
          </Button>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className={`border ${stat.bg} shadow-card`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="dashboard.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as ComplaintStatus | "all")}
            >
              <SelectTrigger
                className="w-[150px]"
                data-ocid="dashboard.filter.select"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as ComplaintCategory | "all")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(v) => setPriorityFilter(v as Priority | "all")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Complaints list */}
        {filteredComplaints.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="complaint.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              No complaints found
            </h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              {search ||
              statusFilter !== "all" ||
              categoryFilter !== "all" ||
              priorityFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You haven't submitted any complaints yet. Click below to get started."}
            </p>
            {!search &&
              statusFilter === "all" &&
              categoryFilter === "all" &&
              priorityFilter === "all" && (
                <Button
                  className="mt-4 gap-2"
                  onClick={() => navigate({ to: "/submit" })}
                  data-ocid="dashboard.new_complaint_button"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Your First Complaint
                </Button>
              )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => navigate({ to: `/complaint/${complaint._id}` })}
                className="complaint-card bg-card rounded-xl p-4 sm:p-5"
                data-ocid={`complaint.item.${index + 1}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {/* Category pill */}
                  <div className="shrink-0 hidden sm:block">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                        categoryColors[complaint.category] ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {complaint.category.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {complaint._id.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          categoryColors[complaint.category] ||
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {complaint.category}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground truncate">
                      {complaint.title}
                    </h3>
                    {complaint.location && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{complaint.location}</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-1.5 line-clamp-1">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-2 shrink-0 flex-wrap">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}