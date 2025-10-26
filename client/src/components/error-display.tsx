import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorDisplayProps {
  message?: string;
  suggestion?: string;
}

export function ErrorDisplay({
  message = "User not found",
  suggestion = "Please check the username and try again",
}: ErrorDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <Alert variant="destructive" data-testid="alert-error">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="font-medium" data-testid="text-error-message">{message}</p>
          <p className="text-sm mt-1 opacity-90">{suggestion}</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
