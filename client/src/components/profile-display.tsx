import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle2, Calendar } from "lucide-react";
import { StatsGrid } from "./stats-grid";
import type { RobloxUser } from "@shared/schema";
import { format } from "date-fns";

interface ProfileDisplayProps {
  user: RobloxUser;
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
  const createdDate = user.created ? new Date(user.created) : null;
  const formattedDate = createdDate
    ? format(createdDate, "MMMM d, yyyy")
    : "Unknown";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-8">
      <Card data-testid="card-profile-header">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32 border-4 border-border" data-testid="img-avatar">
              <AvatarImage
                src={user.profilePicture}
                alt={`${user.displayName}'s avatar`}
              />
              <AvatarFallback className="text-4xl">
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-3xl font-bold" data-testid="text-display-name">
                    {user.displayName}
                  </h2>
                  {user.hasVerifiedBadge && (
                    <CheckCircle2 className="h-6 w-6 text-primary" data-testid="icon-verified" />
                  )}
                </div>
                <p className="text-muted-foreground mt-1" data-testid="text-username">
                  @{user.name}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="text-join-date">Member since {formattedDate}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs"
                  data-testid="badge-user-id"
                >
                  ID: {user.id}
                </Badge>
                {user.isBanned && (
                  <Badge variant="destructive" data-testid="badge-banned">
                    Banned
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatsGrid
        friends={user.friends}
        followers={user.followers}
        following={user.following}
        badges={user.badges}
      />

      <Card data-testid="card-about">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          {user.description ? (
            <p className="text-base leading-relaxed max-w-prose" data-testid="text-description">
              {user.description}
            </p>
          ) : (
            <p className="text-base text-muted-foreground" data-testid="text-no-description">
              No description provided
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
