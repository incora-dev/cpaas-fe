import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Users } from "lucide-react";

type RecipientFieldProps = {
  control: any;
};

export function RecipientField({ control }: RecipientFieldProps) {
  return (
    <FormField
      control={control}
      name="to"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[var(--primary)] font-medium">
            Recipients
          </FormLabel>
          <FormControl className="mt-2">
            <div className="flex items-center gap-2 bg-[var(--accent)]/20 border-1 border-[var(--primary)] rounded-md px-3 focus-within:border-[var(--primary)]">
              <Users className="w-4 h-4 text-[var(--primary)]" />
              <Input
                placeholder="Enter recipients separated by commas"
                {...field}
                className="flex-1 bg-transparent text-[var(--foreground)] border-none outline-none focus:ring-0 focus:border-none focus:outline-none !ring-0"
              />
            </div>
          </FormControl>
          <FormMessage className="text-[var(--error)]" />
        </FormItem>
      )}
    />
  );
}
