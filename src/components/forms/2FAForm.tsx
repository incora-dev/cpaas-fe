import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { sendMessage } from "../../services/api";
import { RecipientField } from "../RecipientField";

const twoFASchema = z.object({
  to: z
    .string()
    .min(1, "At least one recipient is required")
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
    .refine((arr) => arr.length > 0, "At least one recipient is required"),
  placeholders: z.array(
    z.object({ key: z.string().min(1), value: z.string().min(1) })
  ),
});

type TwoFAFormProps = {
  channel: string;
};

export function TwoFAForm({ channel }: TwoFAFormProps) {
  const form = useForm<z.infer<typeof twoFASchema>>({
    resolver: zodResolver(twoFASchema),
    defaultValues: {
      to: [],
      placeholders: [],
    },
  });

  const {
    fields: params,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "placeholders" as never,
  });

  async function onSubmit(values: z.infer<typeof twoFASchema>) {
    const paramsObj = values.placeholders.reduce(
      (acc, p) => ({ ...acc, [p.key]: p.value }),
      {}
    );

    try {
      const payload = {
        type: "2fa",
        placeholders: paramsObj,
      };

      const res = await sendMessage(channel, values.to, payload);

      toast.success("2FA pin message sent successfully!");
      console.log("Server response:", res);
    } catch (error: any) {
      toast.error("Failed to send 2FA pin message");
      console.error("Error sending message:", error);
    }
  }

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} 2FA PIN Message
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RecipientField control={form.control} />
            <FormItem>
              <FormLabel className="text-[var(--foreground)] font-medium">
                Placeholders
              </FormLabel>
              {params.map((field, index) => (
                <div key={field.id} className="flex gap-2 mt-2">
                  <FormField
                    control={form.control}
                    name={`placeholders.${index}.key`}
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          placeholder="Key"
                          {...field}
                          className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                        />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`placeholders.${index}.value`}
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          placeholder="Value"
                          {...field}
                          className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                        />
                      </FormControl>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
              <div className="mt-2">
                <Button
                  type="button"
                  onClick={() => append({ key: "", value: "" })}
                  className="bg-[var(--primary)] text-[var(--primary-foreground)]"
                >
                  + Add Placeholder
                </Button>
              </div>
              <FormMessage className="text-[var(--error)]" />
            </FormItem>
            <Button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] transition-colors rounded-md border-none"
            >
              Send
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
