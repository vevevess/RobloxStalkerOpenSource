import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 text-center py-16" data-testid="empty-state">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Search for a Roblox user to get started</h3>
      <p className="text-muted-foreground text-sm">
        Enter a username in the search box above to view their profile
      </p>
    </div>
  );
}
