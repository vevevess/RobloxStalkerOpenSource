import { Users, UserPlus, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsGridProps {
  friends?: number;
  followers?: number;
  following?: number;
  badges?: number;
}

export function StatsGrid({ friends, followers, following, badges }: StatsGridProps) {
  const stats = [
    {
      label: "Friends",
      value: friends ?? 0,
      icon: Users,
      testId: "stat-friends",
    },
    {
      label: "Followers",
      value: followers ?? 0,
      icon: UserPlus,
      testId: "stat-followers",
    },
    {
      label: "Following",
      value: following ?? 0,
      icon: Users,
      testId: "stat-following",
    },
    {
      label: "Badges",
      value: badges ?? 0,
      icon: Trophy,
      testId: "stat-badges",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} data-testid={stat.testId}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xl font-semibold mt-1" data-testid={`text-${stat.label.toLowerCase()}-count`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
