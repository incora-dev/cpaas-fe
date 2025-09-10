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

const schema = z.object({
  to: z.array(z.string().min(1)).min(1, "At least one recipient is required"),
  text: z.string().min(1, "Text is required"),
  actionTitle: z.string().min(1, "Action title is required"),
  options: z.array(z.string().min(1, "Option cannot be empty")),
});

type ListFormProps = {
  channel: string;
};

export function ListForm({ channel }: ListFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      to: [],
      text: "",
      actionTitle: "",
      options: [""],
    },
  });

  const { control, handleSubmit } = form;

  const {
    fields: options,
    append: addOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options" as never,
  });

const onSubmit = async (values: z.infer<typeof schema>) => {
  try {
    const payload: any = {
      type: "list",
      text: values.text,
      actionTitle: values.actionTitle,
      options: values.options,
    };

    const res = await sendMessage(channel, values.to, payload);

    toast.success("List message sent successfully!");
    console.log("Server response:", res);
  } catch (error: any) {
    toast.error("Failed to send list message");
    console.error("Error sending message:", error);
  }
};

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
            <RecipientField control={form.control} />
            <FormField
              control={control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Message Text
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Message text"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="actionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Action Title (Button name)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Button text"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            {options.map((field, index) => (
              <FormField
                key={field.id}
                control={control}
                name={`options.${index}` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--foreground)] font-medium">
                      Option {index + 1}
                    </FormLabel>
                    <div className="flex gap-2 mt-2">
                      <FormControl>
                        <Input
                          placeholder="Enter option"
                          {...field}
                          className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeOption(index)}
                      >
                        X
                      </Button>
                    </div>
                    <FormMessage className="text-[var(--error)]" />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              onClick={() => addOption("")}
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] transition-colors rounded-md border-none"
            >
              + Add Option
            </Button>
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