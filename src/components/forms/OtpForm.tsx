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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { sendMessage } from "../../services/api";
import { RecipientField } from "../RecipientField";

const otpSchema = z.object({
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
  templateId: z.string().min(1, "Template ID is required"),
  parameters: z
    .array(z.object({ key: z.string().min(1), value: z.string().min(1) }))
    .min(1, "At least one parameter is required"),
  language: z.enum([
    "ENGLISH",
    "ARABIC",
    "BULGARIAN",
    "CROATIAN",
    "CZECH",
    "DANISH",
    "GERMAN",
    "GREEK",
    "SPANISH",
    "FINNISH",
    "FRENCH",
    "HEBREW",
    "BURMESE",
    "HUNGARIAN",
    "INDONESIAN",
    "ITALIAN",
    "JAPANESE",
    "NORWEGIAN",
    "DUTCH",
    "POLISH",
    "PORTUGUESE_PORTUGAL",
    "PORTUGUESE_BRAZIL",
    "ROMANIAN",
    "RUSSIAN",
    "SLOVAK",
    "SERBIAN",
    "SWEDISH",
    "THAI",
    "TURKISH",
    "UKRAINIAN",
    "VIETNAMESE",
    "PERSIAN",
    "BELARUSIAN",
  ]),
});

type OtpFormProps = {
  channel: string;
};

export function OtpForm({ channel }: OtpFormProps) {
  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      to: [],
      templateId: "",
      parameters: [{ key: "", value: "" }],
      language: "ENGLISH",
    },
  });

  const {
    fields: params,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "parameters" as never,
  });

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    const paramsObj = values.parameters.reduce(
      (acc, p) => ({ ...acc, [p.key]: p.value }),
      {}
    );

    try {
      const payload = {
        type: "otp",
        templateId: values.templateId,
        parameters: paramsObj, 
        language: values.language,
      };

      const res = await sendMessage(channel, values.to, payload);

      toast.success("OTP message sent successfully!");
      console.log("Server response:", res);
    } catch (error: any) {
      toast.error("Failed to send OTP message");
      console.error("Error sending message:", error);
    }
  }

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} OTP Message
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RecipientField control={form.control} />
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Template ID
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Template ID"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel className="text-[var(--foreground)] font-medium">
                Parameters
              </FormLabel>

              {params.map((field, index) => (
                <div key={field.id} className="flex gap-2 mt-2">
                  <FormField
                    control={form.control}
                    name={`parameters.${index}.key`}
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
                    name={`parameters.${index}.value`}
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
                  + Add Parameter
                </Button>
              </div>
              <FormMessage className="text-[var(--error)]" />
            </FormItem>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Language
                  </FormLabel>
                  <div className="mt-2">
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {otpSchema.shape.language.options.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
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
