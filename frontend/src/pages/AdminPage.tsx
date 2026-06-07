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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Search,
  Shield,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppFooter } from "../components/AppFooter";
import { AppHeader } from "../components/AppHeader";
import {
  PriorityBadge,
  RoleBadge,
  StatusBadge,
} from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { DEPARTMENTS } from "../data/mockData";
import type { ComplaintCategory, ComplaintStatus } from "../types";

const STATUS_OPTIONS: { value: ComplaintStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const CATEGORY_OPTIONS: { value: ComplaintCategory | "all"; label: string }[] =
  [
    { value: "all", label: "All Categories" },
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Cleanliness", label: "Cleanliness" },
    { value: "Safety", label: "Safety" },
    { value: "IT", label: "IT" },
    { value: "Academic", label: "Academic" },
    { value: "Other", label: "Other" },
  ];

export function AdminPage() {
  const { complaints, updateComplaintStatus, currentUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<
    ComplaintCategory | "all"
  >("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // TODO: Firestore - getDocs with real-time onSnapshot listener:
  // onSnapshot(collection(db, 'complaints'), (snapshot) => {
  //   const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //   setComplaints(data);
  // });

  const stats = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
      critical: complaints.filter((c) => c.priority === "Critical").length,
    }),
    [complaints],
  );

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.submittedBy.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchCategory =
        categoryFilter === "all" || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [complaints, search, statusFilter, categoryFilter]);

  const handleStatusChange = (id: string, status: ComplaintStatus) => {
    updateComplaintStatus(id, status);
    // TODO: Firestore - updateDoc(doc(db, 'complaints', id), { status, updatedAt: serverTimestamp() })
    toast.success(`Complaint ${id} status updated to ${status}`);
  };

  const handleBulkResolve = () => {
    if (selectedIds.size === 0) {
      toast.error("No complaints selected.");
      return;
    }
    for (const id of selectedIds) {
      updateComplaintStatus(id, "resolved");
    }
    // TODO: Firestore - batch update
    toast.success(`${selectedIds.size} complaints marked as resolved.`);
    setSelectedIds(new Set());
  };

  // Guard: admin only — AFTER all hooks
  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center" data-ocid="admin.error_state">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground">
              Access Denied
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              This page is only accessible to administrators.
            </p>
            <Button
              className="mt-5"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Go to Dashboard
            </Button>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  const handleExportCSV = () => {
    // TODO: Generate real CSV from Firestore data
    const headers = [
      "ID",
      "Title",
      "Submitted By",
      "Role",
      "Category",
      "Priority",
      "Status",
      "Date",
      "Location",
    ];
    const rows = filtered.map((c) =>
      [
        c.id,
        `"${c.title}"`,
        c.submittedBy,
        c.submittedByRole,
        c.category,
        c.priority,
        c.status,
        c.date,
        `"${c.location}"`,
      ].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suggestify-complaints-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const statCards = [
    {
      label: "Total Complaints",
      value: stats.total,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/5 border-primary/20",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: Zap,
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-display font-bold text-foreground">
                Admin Panel
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Manage all campus complaints and track resolution progress
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleBulkResolve}
              data-ocid="admin.bulk_resolve_button"
            >
              <CheckCircle2 className="w-4 h-4" />
              Bulk Resolve {selectedIds.size > 0 && `(${selectedIds.size})`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExportCSV}
              data-ocid="admin.export_button"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <Card className={`border ${stat.bg} shadow-card`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground truncate">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, title, user, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="admin.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as ComplaintStatus | "all")
              }
            >
              <SelectTrigger
                className="w-[160px]"
                data-ocid="admin.status_filter_select"
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
              onValueChange={(v) =>
                setCategoryFilter(v as ComplaintCategory | "all")
              }
            >
              <SelectTrigger className="w-[155px]">
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
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table data-ocid="admin.complaints.table">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-10 pl-4">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                      checked={
                        selectedIds.size === filtered.length &&
                        filtered.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedIds(new Set(filtered.map((c) => c.id)));
                        else setSelectedIds(new Set());
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs whitespace-nowrap">
                    ID
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs whitespace-nowrap">
                    Submitted By
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs">
                    Priority
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-xs text-right pr-4">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="admin.complaints.empty_state"
                    >
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">
                        No complaints match your search criteria.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((complaint, index) => (
                    <TableRow
                      key={complaint.id}
                      className="hover:bg-muted/30 transition-colors"
                      data-ocid={`admin.complaint.row.${index + 1}`}
                    >
                      <TableCell className="pl-4">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={selectedIds.has(complaint.id)}
                          onChange={() => toggleSelect(complaint.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {complaint.id}
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <p className="text-sm font-medium text-foreground truncate">
                          {complaint.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {complaint.location}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-medium text-foreground whitespace-nowrap">
                            {complaint.submittedBy}
                          </p>
                          <RoleBadge role={complaint.submittedByRole} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-foreground whitespace-nowrap">
                          {complaint.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={complaint.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={complaint.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(complaint.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Status update dropdown */}
                          <Select
                            value={complaint.status}
                            onValueChange={(v) =>
                              handleStatusChange(
                                complaint.id,
                                v as ComplaintStatus,
                              )
                            }
                          >
                            <SelectTrigger className="h-7 w-[130px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="under_review">
                                Under Review
                              </SelectItem>
                              <SelectItem value="in_progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Assign dept */}
                          <Select
                            value={complaint.department || "unassigned"}
                            onValueChange={(v) => {
                              toast.success(`Assigned to ${v}`);
                              // TODO: Firestore - updateDoc(doc(db, 'complaints', complaint.id), { department: v })
                            }}
                          >
                            <SelectTrigger className="h-7 w-[130px] text-xs hidden lg:flex">
                              <SelectValue placeholder="Assign dept" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEPARTMENTS.map((dept) => (
                                <SelectItem
                                  key={dept}
                                  value={dept}
                                  className="text-xs"
                                >
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* View */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              navigate({ to: `/complaint/${complaint.id}` })
                            }
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {complaints.length} complaints
              </p>
              {selectedIds.size > 0 && (
                <p className="text-xs font-medium text-primary">
                  {selectedIds.size} selected
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
