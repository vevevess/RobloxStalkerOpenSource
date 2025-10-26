import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const searchFormSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .trim()
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchInterfaceProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
}

export function SearchInterface({ onSearch, isLoading }: SearchInterfaceProps) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleSubmit = (values: SearchFormValues) => {
    onSearch(values.username);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Roblox Profile Stalker</h1>
        <p className="text-muted-foreground">
          Enter a username to view detailed profile information
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Roblox username"
                    className="h-12 text-base"
                    disabled={isLoading}
                    data-testid="input-username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-12 px-8"
            data-testid="button-search"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </form>
      </Form>
    </div>
  );
}
