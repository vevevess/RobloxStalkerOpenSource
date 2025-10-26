import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchInterface } from "@/components/search-interface";
import { ProfileDisplay } from "@/components/profile-display";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { ErrorDisplay } from "@/components/error-display";
import { EmptyState } from "@/components/empty-state";
import type { RobloxApiResponse } from "@shared/schema";

export default function Home() {
  const [searchedUsername, setSearchedUsername] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery<RobloxApiResponse>({
    queryKey: ['/api/roblox', searchedUsername],
    enabled: !!searchedUsername,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleSearch = (username: string) => {
    setSearchedUsername(username);
    if (username === searchedUsername) {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto py-8 md:py-12 space-y-12">
        <SearchInterface onSearch={handleSearch} isLoading={isLoading} />

        {!searchedUsername && <EmptyState />}

        {isLoading && <LoadingSkeleton />}

        {error && !isLoading && (
          <ErrorDisplay
            message="Failed to fetch user profile"
            suggestion="Please check the username and try again. The user might not exist or the service is temporarily unavailable."
          />
        )}

        {data && !isLoading && !error && data.status && (
          <ProfileDisplay user={data.result} />
        )}

        {data && !isLoading && !error && !data.status && (
          <ErrorDisplay
            message="User not found"
            suggestion="Please verify the username is correct and try again."
          />
        )}
      </div>
    </div>
  );
}
