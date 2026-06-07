import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Check, Moon, Palette, Sun, Type } from "lucide-react";
import type { AccentColor, FontSize, ThemeMode } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

// ============================================================
// ACCENT SWATCH OPTIONS
// ============================================================

const ACCENT_OPTIONS: {
  value: AccentColor;
  label: string;
  bgClass: string;
}[] = [
  { value: "indigo", label: "Indigo", bgClass: "bg-[oklch(0.38_0.13_265)]" },
  { value: "emerald", label: "Emerald", bgClass: "bg-[oklch(0.52_0.14_155)]" },
  { value: "rose", label: "Rose", bgClass: "bg-[oklch(0.55_0.2_355)]" },
  { value: "amber", label: "Amber", bgClass: "bg-[oklch(0.62_0.16_60)]" },
];

const FONT_SIZE_OPTIONS: { value: FontSize; label: string; desc: string }[] = [
  { value: "sm", label: "Small", desc: "13px" },
  { value: "md", label: "Medium", desc: "15px" },
  { value: "lg", label: "Large", desc: "17px" },
];

// ============================================================
// PAGE
// ============================================================

export function AppearancePage() {
  const {
    theme,
    accentColor,
    fontSize,
    setTheme,
    setAccentColor,
    setFontSize,
  } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Appearance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize how Suggestify looks on your device.
          </p>
        </div>

        {/* ── DARK MODE ─────────────────────────────────────── */}
        <Card data-ocid="appearance.theme_card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-primary" />
              ) : (
                <Sun className="w-4 h-4 text-primary" />
              )}
              Color Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode tiles */}
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as ThemeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                  data-ocid={`appearance.${mode}_mode_button`}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all duration-150 ${
                    theme === mode
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  {/* Mini preview */}
                  <div
                    className={`w-full h-16 rounded-lg overflow-hidden border border-border/60 flex flex-col gap-1 p-2 ${
                      mode === "dark" ? "bg-[oklch(0.13_0.02_260)]" : "bg-white"
                    }`}
                  >
                    <div
                      className={`h-2 rounded w-3/4 ${
                        mode === "dark"
                          ? "bg-[oklch(0.4_0.06_255)]"
                          : "bg-[oklch(0.85_0.01_255)]"
                      }`}
                    />
                    <div
                      className={`h-2 rounded w-1/2 ${
                        mode === "dark"
                          ? "bg-[oklch(0.3_0.04_255)]"
                          : "bg-[oklch(0.92_0.01_255)]"
                      }`}
                    />
                    <div
                      className={`h-4 rounded-md mt-1 ${
                        mode === "dark"
                          ? "bg-[oklch(0.38_0.13_265)]"
                          : "bg-[oklch(0.38_0.13_265)]"
                      }`}
                    />
                  </div>

                  <span className="text-sm font-medium capitalize text-foreground">
                    {mode}
                  </span>

                  {theme === mode && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <Label className="text-sm font-medium" htmlFor="dark-switch">
                  Dark mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark appearance
                </p>
              </div>
              <Switch
                id="dark-switch"
                checked={theme === "dark"}
                onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                data-ocid="appearance.dark_mode_switch"
              />
            </div>
          </CardContent>
        </Card>

        {/* ── ACCENT COLOR ──────────────────────────────────── */}
        <Card data-ocid="appearance.accent_card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="w-4 h-4 text-primary" />
              Accent Color
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACCENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAccentColor(opt.value)}
                  data-ocid={`appearance.accent_${opt.value}_button`}
                  className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-all duration-150 ${
                    accentColor === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${opt.bgClass} shadow-sm`}
                  />
                  <span className="text-xs font-medium text-foreground">
                    {opt.label}
                  </span>
                  {accentColor === opt.value && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── FONT SIZE ─────────────────────────────────────── */}
        <Card data-ocid="appearance.fontsize_card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Type className="w-4 h-4 text-primary" />
              Font Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={fontSize}
              onValueChange={(v) => setFontSize(v as FontSize)}
              className="space-y-2"
              data-ocid="appearance.fontsize_radio"
            >
              {FONT_SIZE_OPTIONS.map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={`font-${opt.value}`}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                    fontSize === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`font-${opt.value}`}
                    data-ocid={`appearance.fontsize_${opt.value}_radio`}
                  />
                  <span className="flex-1">
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {opt.desc}
                    </span>
                  </span>
                  {opt.value === "md" && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* ── LIVE PREVIEW ──────────────────────────────────── */}
        <Card data-ocid="appearance.preview_card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              This is how your interface looks with the current settings.
            </p>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary text-primary-foreground">
                  Primary Badge
                </Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" data-ocid="appearance.preview_primary_button">
                  Primary
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  data-ocid="appearance.preview_secondary_button"
                >
                  Secondary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid="appearance.preview_outline_button"
                >
                  Outline
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  data-ocid="appearance.preview_destructive_button"
                >
                  Danger
                </Button>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium text-foreground">
                  Sample card content
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Secondary text appears here in your chosen font size.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
