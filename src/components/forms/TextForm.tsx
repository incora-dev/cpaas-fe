import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { sendMessage } from "../../services/api";
import { RecipientField } from "../RecipientField";

const formSchema = z.object({
  to: z.array(z.string().min(1)).min(1, "At least one recipient is required"),
  text: z.string().min(1, "Message text is required"),
});

type TextFormProps = {
  channel: string;
};

export function TextForm({ channel }: TextFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: [],
      text: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        type: "text",
        text: values.text,
      };

      const res = await sendMessage(channel, values.to, payload);

      toast.success("Text message sent successfully!");
      console.log("Server response:", res);
    } catch (error: any) {
      toast.error("Failed to send text message");
      console.error("Error sending message:", error);
    }
  }

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} Text Message
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RecipientField control={form.control} />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Text
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Textarea
                      placeholder="Message text"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                      rows={4}
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
