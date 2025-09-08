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
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { sendMessage } from "../../services/api";

const cardSchema = z.object({
  to: z.string().min(1, "Recipient is required"),
  orientation: z.enum(["HORIZONTAL", "VERTICAL"]),
  alignment: z.enum(["LEFT", "RIGHT"]),
  height: z.enum(["SHORT", "MEDIUM", "TALL"]),
  title: z.string().optional(),
  description: z.string().optional(),
  mediaUrl: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url("Must be a valid URL").optional(),
});

type CardFormProps = {
  channel: string;
};

export function CardForm({ channel }: CardFormProps) {
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      to: "",
      orientation: "HORIZONTAL",
      alignment: "LEFT",
      height: "MEDIUM",
      title: "",
      description: "",
      mediaUrl: "",
      thumbnailUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof cardSchema>) {
    try {
      const payload = {
        type: "card",
        ...values,
      };

      const res = await sendMessage(channel, values.to, payload);

      toast.success("Card message sent successfully!");
      console.log("Server response:", res);
    } catch (error: any) {
      toast.error("Failed to send card message");
      console.error("Error sending message:", error);
    }
  }

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} Card Message
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Recipient */}
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Recipient
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Recipient phone number"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Orientation */}
            <FormField
              control={form.control}
              name="orientation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Orientation
                  </FormLabel>
                  <div className="mt-2">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                          <SelectValue placeholder="Select orientation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HORIZONTAL">HORIZONTAL</SelectItem>
                          <SelectItem value="VERTICAL">VERTICAL</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Alignment */}
            <FormField
              control={form.control}
              name="alignment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Alignment
                  </FormLabel>
                  <div className="mt-2">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                          <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEFT">LEFT</SelectItem>
                          <SelectItem value="RIGHT">RIGHT</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Height */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Height
                  </FormLabel>
                  <div className="mt-2">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                          <SelectValue placeholder="Select height" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SHORT">SHORT</SelectItem>
                          <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                          <SelectItem value="TALL">TALL</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Title (Optional)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Card title"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Description (Optional)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Textarea
                      placeholder="Card description"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                      rows={3}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Media URL */}
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
                      placeholder="Media URL"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Thumbnail URL */}
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Thumbnail URL (Optional)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Thumbnail URL"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Submit */}
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
