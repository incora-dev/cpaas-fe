import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button as UIButton } from "../ui/button";
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
import { useState } from "react";
import { RecipientField } from "../RecipientField";

const schema = z.object({
  to: z.array(z.string().min(1)).min(1, "At least one recipient is required"),
  mediaUrl: z.string().url("Must be a valid URL"),
  caption: z.string(),
  thumbnailUrl: z.string().url("Must be a valid URL"),
  duration: z
    .union([z.number().min(1, "Duration must be positive"), z.string()])
    .refine(
      (val) => {
        const num = typeof val === "string" ? Number(val) : val;
        return !isNaN(num) && num > 0;
      },
      {
        message: "Duration must be a positive number",
      }
    ),
  button: z
    .object({
      title: z.string().min(1, "Button title required"),
      action: z.string().min(1, "Button action required"),
    })
    .optional(),
});

type VideoFormProps = {
  channel: string;
};

export function VideoForm({ channel }: VideoFormProps) {
  const [showButtonFields, setShowButtonFields] = useState(false);
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      to: [],
      mediaUrl: "",
      caption: "",
      thumbnailUrl: "",
      duration: 0,
      button: undefined,
    },
  });

const onSubmit = async (values: z.infer<typeof schema>) => {
  try {
    const payload: any = {
      type: "video",
      mediaUrl: values.mediaUrl,
      caption: values.caption,
      thumbnailUrl: values.thumbnailUrl,
      duration: `PT${values.duration}S`,
      button: values.button || undefined,
    };

    const res = await sendMessage(channel, values.to, payload);

   toast.success("Video message sent successfully!");
   console.log("Server response:", res);
  } catch (error: any) {
    toast.error("Failed to send video message");
    console.error("Error sending message:", error);
  }
};

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} Video
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
                    Video URL
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Video URL"
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
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Caption
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Video caption"
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
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Thumbnail URL
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Thumbnail URL"
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
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Duration (seconds)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      type="number"
                      placeholder="Duration"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            {!showButtonFields ? (
              <UIButton
                type="button"
                onClick={() => setShowButtonFields(true)}
                className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                + Add Button
              </UIButton>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="button.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--foreground)] font-medium">
                        Button Title
                      </FormLabel>
                      <FormControl className="mt-2">
                        <Input
                          placeholder="Button title"
                          {...field}
                          className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="text-[var(--error)]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="button.action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--foreground)] font-medium">
                        Button Action
                      </FormLabel>
                      <FormControl className="mt-2">
                        <Input
                          placeholder="Button action (URL)"
                          {...field}
                          className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                        />
                      </FormControl>
                      <FormMessage className="text-[var(--error)]" />
                    </FormItem>
                  )}
                />
                <UIButton
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    form.setValue("button", undefined);
                    setShowButtonFields(false);
                  }}
                >
                  Remove Button
                </UIButton>
              </>
            )}
            <UIButton
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] transition-colors rounded-md border-none"
            >
              Send
            </UIButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
