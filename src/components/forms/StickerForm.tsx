import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
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
  mediaUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (val) => val.toLowerCase().endsWith(".webp"),
      "Sticker must be a .webp file"
    ),
});

type StickerFormProps = {
  channel: string;
};

export function StickerForm({ channel }: StickerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: [],
      mediaUrl: "",
    },
  });

function onSubmit(values: z.infer<typeof formSchema>) {
  const payload: any = {
    type: "sticker",
    mediaUrl: values.mediaUrl,
  };

  sendMessage(channel, values.to, payload)
    .then((res) => {
      toast.success("Sticker message sent successfully!");
      console.log("Server response:", res);
    })
    .catch((error) => {
      toast.error("Failed to send sticker message");
      console.error("Error sending sticker:", error);
    });
}

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} Sticker
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RecipientField control={form.control} />
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Media URL
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Sticker URL"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] 
                 transition-colors rounded-md border-none"
            >
              Send
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
