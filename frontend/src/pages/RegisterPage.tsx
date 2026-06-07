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
import { useNavigate, Link } from "@tanstack/react-router";
import { Loader2, Paperclip, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { Role } from "../types";

export function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [collegeIdFile, setCollegeIdFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as Role,
    aadharNo: "",
    enrollmentNo: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    collegeIdUrl: "",
    // Remove unused identityFile
    // identityFile: null as File | null,
    
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";

    if (form.role === "student") {
      if (!form.aadharNo.trim()) errs.aadharNo = "Aadhar number is required";
      if (!form.enrollmentNo.trim()) errs.enrollmentNo = "Enrollment number is required";
      if (!form.city.trim()) errs.city = "City is required";
      if (!form.state.trim()) errs.state = "State is required";
      if (!form.address.trim()) errs.address = "Address is required";
      if (!studentIdFile) errs.studentIdFile = "Student ID proof is required";
    }
    if (form.role === "faculty") {
      if (!form.mobileNo.trim()) errs.mobileNo = "Mobile number is required";
      if (!form.aadharNo.trim()) errs.aadharNo = "Aadhar number is required";
      if (!form.city.trim()) errs.city = "City is required";
      if (!form.state.trim()) errs.state = "State is required";
      if (!collegeIdFile) errs.collegeIdFile = "College ID proof is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("role", form.role);
      
      if (form.role === "student") {
        data.append("aadharNo", form.aadharNo);
        data.append("enrollmentNo", form.enrollmentNo);
        data.append("city", form.city);
        data.append("state", form.state);
        data.append("address", form.address);
        if (studentIdFile) data.append("studentId", studentIdFile);
      }
      if (form.role === "faculty") {
        data.append("aadharNo", form.aadharNo);
        data.append("mobileNo", form.mobileNo);
        data.append("city", form.city);
        data.append("state", form.state);
        if (collegeIdFile) data.append("collegeId", collegeIdFile);
      }
      await register(data);
      toast.success("Registration successful!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex flex-col justify-between w-[45%] bg-sidebar p-10 relative z-10 shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
              <span className="text-white text-lg font-bold font-display">S</span>
            </div>
            <span className="text-white font-display text-2xl font-bold">
              Suggestify
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-white leading-tight">
                Join the
                <br />
                <span className="text-sidebar-primary opacity-80">
                  Campus Feedback
                </span>
              </h1>
              <p className="mt-4 text-white/70 text-base leading-relaxed max-w-xs">
                Create an account to report issues, track resolutions, and help improve campus life.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-6 h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg my-auto py-8"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Create an account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            <div className="space-y-1.5">
              <Label htmlFor="role">I am a</Label>
              <Select
                value={form.role}
                onValueChange={(v) => {
                  setForm((p) => ({ ...p, role: v as Role }));
                  setErrors({});
                }}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => {
                  setForm((p) => ({ ...p, name: e.target.value }));
                  if (errors.name) clearError("name");
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {form.role === "student" && (
  <div className="space-y-1.5">
    <Label htmlFor="enrollmentNo">Enrollment No <span className="text-destructive">*</span></Label>
    <Input
      id="enrollmentNo"
      placeholder="e.g. 120BXXXXX"
      value={form.enrollmentNo}
      onChange={(e) => {
        setForm((p) => ({ ...p, enrollmentNo: e.target.value }));
        if (errors.enrollmentNo) clearError("enrollmentNo");
      }}
      className={errors.enrollmentNo ? "border-destructive" : ""}
    />
    {errors.enrollmentNo && <p className="text-xs text-destructive">{errors.enrollmentNo}</p>}

    <Label htmlFor="aadharNo">Aadhar No <span className="text-destructive">*</span></Label>
    <Input
      id="aadharNo"
      placeholder="XXXX XXXX XXXX"
      value={form.aadharNo}
      onChange={(e) => {
        setForm((p) => ({ ...p, aadharNo: e.target.value }));
        if (errors.aadharNo) clearError("aadharNo");
      }}
      className={errors.aadharNo ? "border-destructive" : ""}
    />
    {errors.aadharNo && <p className="text-xs text-destructive">{errors.aadharNo}</p>}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
        <Input
          id="city"
          placeholder="City"
          value={form.city}
          onChange={(e) => {
            setForm((p) => ({ ...p, city: e.target.value }));
            if (errors.city) clearError("city");
          }}
          className={errors.city ? "border-destructive" : ""}
        />
        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
        <Input
          id="state"
          placeholder="State"
          value={form.state}
          onChange={(e) => {
            setForm((p) => ({ ...p, state: e.target.value }));
            if (errors.state) clearError("state");
          }}
          className={errors.state ? "border-destructive" : ""}
        />
        {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
      </div>
    </div>

    <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
    <Input
      id="address"
      placeholder="Street, Apt, etc."
      value={form.address}
      onChange={(e) => {
        setForm((p) => ({ ...p, address: e.target.value }));
        if (errors.address) clearError("address");
      }}
      className={errors.address ? "border-destructive" : ""}
    />
    {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}

    <Label htmlFor="mobileNo">Mobile No <span className="text-destructive">*</span></Label>
    <Input
      id="mobileNo"
      placeholder="10-digit mobile number"
      value={form.mobileNo}
      onChange={(e) => {
        setForm((p) => ({ ...p, mobileNo: e.target.value }));
        if (errors.mobileNo) clearError("mobileNo");
      }}
      className={errors.mobileNo ? "border-destructive" : ""}
    />
    {errors.mobileNo && <p className="text-xs text-destructive">{errors.mobileNo}</p>}

    <Label>Student ID Proof <span className="text-destructive">*</span></Label>
    {!studentIdFile ? (
      <div className={`border-2 border-dashed ${errors.studentIdFile ? "border-destructive bg-destructive/5" : "border-border"} rounded-lg p-5 text-center`}> 
        <input
          id="id-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setStudentIdFile(file);
              if (errors.studentIdFile) clearError("studentIdFile");
            }
          }}
        />
        <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center gap-2">
          <Paperclip className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to attach identity proof (PNG, JPG)</p>
        </label>
      </div>
    ) : (
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
        <span className="text-sm truncate flex-1">{studentIdFile.name}</span>
        <Button type="button" variant="ghost" size="icon" onClick={() => setStudentIdFile(null)} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>
    )}
    {errors.studentIdFile && <p className="text-xs text-destructive">{errors.studentIdFile}</p>}
  </div>
)}
{form.role === "faculty" && (
  <div className="space-y-1.5">
    <Label htmlFor="mobileNo">Mobile No <span className="text-destructive">*</span></Label>
    <Input
      id="mobileNo"
      placeholder="10-digit mobile no"
      value={form.mobileNo}
      onChange={(e) => {
        setForm((p) => ({ ...p, mobileNo: e.target.value }));
        if (errors.mobileNo) clearError("mobileNo");
      }}
      className={errors.mobileNo ? "border-destructive" : ""}
    />
    {errors.mobileNo && <p className="text-xs text-destructive">{errors.mobileNo}</p>}

    <Label htmlFor="aadharNo">Aadhar No <span className="text-destructive">*</span></Label>
    <Input
      id="aadharNo"
      placeholder="XXXX XXXX XXXX"
      value={form.aadharNo}
      onChange={(e) => {
        setForm((p) => ({ ...p, aadharNo: e.target.value }));
        if (errors.aadharNo) clearError("aadharNo");
      }}
      className={errors.aadharNo ? "border-destructive" : ""}
    />
    {errors.aadharNo && <p className="text-xs text-destructive">{errors.aadharNo}</p>}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
        <Input
          id="city"
          placeholder="City"
          value={form.city}
          onChange={(e) => {
            setForm((p) => ({ ...p, city: e.target.value }));
            if (errors.city) clearError("city");
          }}
          className={errors.city ? "border-destructive" : ""}
        />
        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
        <Input
          id="state"
          placeholder="State"
          value={form.state}
          onChange={(e) => {
            setForm((p) => ({ ...p, state: e.target.value }));
            if (errors.state) clearError("state");
          }}
          className={errors.state ? "border-destructive" : ""}
        />
        {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
      </div>
    </div>

    <Label>College ID Proof <span className="text-destructive">*</span></Label>
    {!collegeIdFile ? (
      <div className={`border-2 border-dashed ${errors.collegeIdFile ? "border-destructive bg-destructive/5" : "border-border"} rounded-lg p-5 text-center`}> 
        <input
          id="college-id-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCollegeIdFile(file);
              if (errors.collegeIdFile) clearError("collegeIdFile");
            }
          }}
        />
        <label htmlFor="college-id-upload" className="cursor-pointer flex flex-col items-center gap-2">
          <Paperclip className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to attach College ID proof (PNG, JPG)</p>
        </label>
      </div>
    ) : (
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
        <span className="text-sm truncate flex-1">{collegeIdFile.name}</span>
        <Button type="button" variant="ghost" size="icon" onClick={() => setCollegeIdFile(null)} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>
    )}
    {errors.collegeIdFile && <p className="text-xs text-destructive">{errors.collegeIdFile}</p>}
  </div>
)}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={form.email}
                onChange={(e) => {
                  setForm((p) => ({ ...p, email: e.target.value }));
                  if (errors.email) clearError("email");
                }}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* 9 & 10. Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                    if (errors.password) clearError("password");
                  }}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, confirmPassword: e.target.value }));
                    if (errors.confirmPassword) clearError("confirmPassword");
                  }}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-4 font-semibold text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="text-primary font-medium underline underline-offset-2 hover:opacity-80">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}