import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-8">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
