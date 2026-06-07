export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img
            src="/favicon.png"
            alt="Suggestify Logo"
            className="w-5 h-5 object-contain rounded"
          />
          <span className="text-sm font-medium text-foreground font-display">
            Suggestify
          </span>
          <span className="text-xs text-muted-foreground">
            — Smart Campus Feedback
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {currentYear}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}