import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Users, X } from "lucide-react";

type RecipientFieldProps = {
  control: any;
};

export function RecipientField({ control }: RecipientFieldProps) {
  return (
    <FormField
      control={control}
      name="to"
      render={({ field }) => {
        const recipients: string[] = field.value || [];

        const addRecipient = (value: string) => {
          const trimmed = value.trim();
          if (trimmed) {
            field.onChange([...recipients, trimmed]);
          }
        };

        const removeRecipient = (index: number) => {
          const updated = recipients.filter((_, i) => i !== index);
          field.onChange(updated);
        };

        return (
          <FormItem>
            <FormLabel className="text-[var(--primary)] font-medium">
              Recipients
            </FormLabel>
            <FormControl className="mt-2">
              <div className="flex flex-wrap items-center gap-2 bg-[var(--accent)]/20 border-1 border-[var(--primary)] rounded-md px-3 py-1 focus-within:border-[var(--primary)]">
                <Users className="w-4 h-4 text-[var(--primary)]" />
                {recipients.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-[var(--primary)]/20 text-[var(--foreground)] px-2 py-1 rounded-md"
                  >
                    <p className="text-[14px] font-light m-0">{r}</p>
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeRecipient(i)}
                    />
                  </div>
                ))}
                <Input
                  placeholder="Type recipient and press space"
                  className="flex-1 bg-transparent text-[var(--foreground)] border-none outline-none focus:ouline-none focus:ring-0 focus:border-none !ring-0"
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      addRecipient(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                    if (e.key === "Backspace" && e.currentTarget.value === "") {
                      removeRecipient(recipients.length - 1);
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage className="text-[var(--error)]" />
          </FormItem>
        );
      }}
    />
  );
}
