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
import { sendMessage } from "../../services/api";
import { toast } from "sonner";
import { RecipientField } from "../RecipientField";

const filenameRegex = /.+\.[a-zA-Z0-9]+$/;

const schema = z.object({
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
  mediaUrl: z.string().url("Must be a valid URL"),
  filename: z
    .string()
    .min(1, "Filename is required")
    .regex(filenameRegex, "Filename must include an extension"),
});

type FileFormProps = {
  channel: string;
};

export function FileForm({ channel }: FileFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      to: [],
      mediaUrl: "",
      filename: ""
    },
  });

const onSubmit = async (values: z.infer<typeof schema>) => {
  try {
    const payload: any = {
      type: "file",
      mediaUrl: values.mediaUrl,
      filename: values.filename,
    };

    const res = await sendMessage(channel, values.to, payload);

    toast.success("File message sent successfully!");
    console.log("Server response:", res);
  } catch (error: any) {
    toast.error("Failed to send file message");
    console.error("Error sending message:", error);
  }
};

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} File
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
                    File URL
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="File URL"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    File Name
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Filename"
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
