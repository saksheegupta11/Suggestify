import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppFooter } from "../components/AppFooter";
import { AppHeader } from "../components/AppHeader";
import { useApp } from "../context/AppContext";
import type { ComplaintCategory } from "../types";

// Define the priority options as a union of the actual select values
type FormPriority = "Low" | "Medium" | "High" | "Critical" | "";

interface FormData {
  title: string;
  category: ComplaintCategory | "";
  priority: FormPriority;
  description: string;
}

interface FormErrors {
  title?: string;
  category?: string;
  priority?: string;
  description?: string;
}

export function SubmitComplaintPage() {
  const { currentUser, addComplaint } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState<FormData>({
    title: "",
    category: "",
    priority: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    else if (form.title.trim().length < 10)
      errs.title = "Title must be at least 10 characters";
    if (!form.category) errs.category = "Please select a category";
    if (!form.priority) errs.priority = "Please select a priority level";
    if (!form.description.trim()) errs.description = "Description is required";
    else if (form.description.trim().length < 50)
      errs.description = `Description must be at least 50 characters (${form.description.trim().length}/50)`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Map UI priority to backend priority
  const mapPriority = (uiPriority: FormPriority): string => {
    if (uiPriority === "Critical") return "high";
    return uiPriority.toLowerCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("priority", mapPriority(form.priority));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const id = await addComplaint(formData);
      setSubmitted(id);
      toast.success("Complaint submitted successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => setImageFile(null);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border shadow-elevated p-10 text-center max-w-md w-full"
            data-ocid="complaint.success_state"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">
              Complaint Submitted!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Your complaint has been registered with ID:{" "}
              <span className="font-mono font-semibold text-foreground">
                {submitted}
              </span>
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              You'll receive updates as the status changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                Go to Dashboard
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => navigate({ to: `/complaint/${submitted}` })}
              >
                View Complaint
              </Button>
            </div>
          </motion.div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: "/dashboard" })}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">
              Submit a Complaint
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Report campus issues clearly and we'll ensure they're addressed
              promptly.
            </p>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title">
                  Complaint Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief, descriptive title (e.g. 'Broken water cooler in Block A')"
                  value={form.title}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, title: e.target.value }));
                    if (errors.title)
                      setErrors((p) => ({ ...p, title: undefined }));
                  }}
                  data-ocid="complaint.title_input"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => {
                      setForm((p) => ({
                        ...p,
                        category: v as ComplaintCategory,
                      }));
                      if (errors.category)
                        setErrors((p) => ({ ...p, category: undefined }));
                    }}
                  >
                    <SelectTrigger
                      id="category"
                      data-ocid="complaint.category_select"
                      className={errors.category ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Infrastructure">
                        🏗️ Infrastructure
                      </SelectItem>
                      <SelectItem value="Cleanliness">
                        🧹 Cleanliness
                      </SelectItem>
                      <SelectItem value="Safety">⚠️ Safety</SelectItem>
                      <SelectItem value="IT">💻 IT</SelectItem>
                      <SelectItem value="Academic">📚 Academic</SelectItem>
                      <SelectItem value="Other">🔧 Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-destructive">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="priority">
                    Priority Level <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.priority}
                    onValueChange={(v) => {
                      setForm((p) => ({ ...p, priority: v as FormPriority }));
                      if (errors.priority)
                        setErrors((p) => ({ ...p, priority: undefined }));
                    }}
                  >
                    <SelectTrigger
                      id="priority"
                      data-ocid="complaint.priority_select"
                      className={errors.priority ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">
                        🟢 Low — Minor inconvenience
                      </SelectItem>
                      <SelectItem value="Medium">
                        🟡 Medium — Affects daily activities
                      </SelectItem>
                      <SelectItem value="High">
                        🟠 High — Significant disruption
                      </SelectItem>
                      <SelectItem value="Critical">
                        🔴 Critical — Safety risk / emergency
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-xs text-destructive">
                      {errors.priority}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                  <span className="text-muted-foreground font-normal ml-2 text-xs">
                    (minimum 50 characters)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail — what happened, when it started, how it affects people, and any relevant context..."
                  value={form.description}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, description: e.target.value }));
                    if (errors.description)
                      setErrors((p) => ({ ...p, description: undefined }));
                  }}
                  rows={5}
                  data-ocid="complaint.description_textarea"
                  className={`resize-none ${errors.description ? "border-destructive" : ""}`}
                />
                <div className="flex justify-between items-center">
                  {errors.description ? (
                    <p className="text-xs text-destructive">
                      {errors.description}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span
                    className={`text-xs ${form.description.length >= 50
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                      }`}
                  >
                    {form.description.length} / 50 min
                  </span>
                </div>
              </div>

              {/* File attachment */}
              <div className="space-y-1.5">
                <Label>Attachment (Optional)</Label>
                {!imageFile ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-5 text-center">
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setImageFile(file);
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Paperclip className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to attach a photo or document
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                    <span className="text-sm truncate flex-1">
                      {imageFile.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeImage}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Priority warning */}
              {form.priority === "Critical" && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-400">
                      Critical Priority Selected
                    </p>
                    <p className="text-xs text-red-700 mt-0.5 dark:text-red-300">
                      Critical issues indicate safety risks or emergencies. Our
                      team will respond within 4 hours. For immediate danger,
                      contact campus security directly.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate({ to: "/dashboard" })}
                  data-ocid="complaint.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2 font-semibold"
                  disabled={isLoading}
                  data-ocid="complaint.submit_button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
}