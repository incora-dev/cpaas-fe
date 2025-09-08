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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { sendMessage } from "../../services/api";

const contactSchema = z.object({
  to: z.string().min(1, "Recipient is required"),
  name: z.object({
    firstName: z.string().min(1, "First name is required"),
    formattedName: z.string().min(1, "Formatted name is required"),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    namePrefix: z.string().optional(),
    nameSuffix: z.string().optional(),
  }),
  birthday: z.string().optional(),
  emails: z
    .array(
      z.object({
        email: z.string().email("Invalid email"),
        type: z.enum(["HOME", "WORK"]).optional(),
      })
    )
    .optional(),
  phones: z
    .array(
      z.object({
        phone: z.string().min(1),
        type: z.enum(["CELL", "MAIN", "IPHONE", "HOME", "WORK"]).optional(),
        waId: z.string().optional(),
      })
    )
    .optional(),
  addresses: z
    .array(
      z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
        countryCode: z.string().optional(),
        type: z.enum(["HOME", "WORK"]).optional(),
      })
    )
    .optional(),
  urls: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.enum(["HOME", "WORK"]).optional(),
      })
    )
    .optional(),
  org: z
    .object({
      company: z.string().optional(),
      department: z.string().optional(),
      title: z.string().optional(),
    })
    .optional()
});

function formatLabel(fieldName: string) {
  return fieldName
    .replace(/([A-Z])/g, " $1") 
    .replace(/^./, (str) => str.toUpperCase());
}

type ContactFormProps = {
  channel: string;
};

export function ContactForm({ channel }: ContactFormProps) {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      to: "",
      name: { firstName: "", formattedName: "" },
      emails: [],
      phones: [],
      addresses: [],
      urls: [],
      org: {},
    },
  });

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({ control: form.control, name: "emails" });
  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control: form.control, name: "phones" });
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({ control: form.control, name: "addresses" });
  const {
    fields: urlFields,
    append: appendUrl,
    remove: removeUrl,
  } = useFieldArray({ control: form.control, name: "urls" });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    try {
      const payload = {
        type: "contact",
        contacts: [values],
      };
      const res = await sendMessage(channel, values.to, payload);
      toast.success("Contact message sent successfully!");
      console.log("Server response:", res);
    } catch (error: any) {
      toast.error("Failed to send contact message");
      console.error("Error sending message:", error);
    }
  }

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} Contact Message
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
                      {...field}
                      placeholder="Recipient phone number"
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Name fields */}
            {[
              "firstName",
              "formattedName",
              "lastName",
              "middleName",
              "namePrefix",
              "nameSuffix",
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`name.${fieldName}` as const}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--foreground)] font-medium">
                      {formatLabel(fieldName)}{" "}
                      {[
                        "lastName",
                        "middleName",
                        "namePrefix",
                        "nameSuffix",
                      ].includes(fieldName)
                        ? "(Optional)"
                        : ""}
                    </FormLabel>
                    <FormControl className="mt-2">
                      <Input
                        {...field}
                        placeholder={formatLabel(fieldName)}
                        className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage className="text-[var(--error)]" />
                  </FormItem>
                )}
              />
            ))}

            {/* Birthday */}
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Birthday (Optional)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      {...field}
                      type="date"
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            {/* Emails */}
            <div className="space-y-2">
              <h4 className="text-[var(--foreground)] font-medium">
                Emails (Optional)
              </h4>
              {emailFields.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`emails.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Email"
                            className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                          />
                        </FormControl>
                        <FormMessage className="text-[var(--error)]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emails.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HOME">HOME</SelectItem>
                              <SelectItem value="WORK">WORK</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-[var(--error)]" />
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={() => removeEmail(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendEmail({ email: "", type: "HOME" })}
              >
                Add Email
              </Button>
            </div>

            {/* Phones */}
            <div className="space-y-2">
              <h4 className="text-[var(--foreground)] font-medium">
                Phones (Optional)
              </h4>
              {phoneFields.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`phones.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Phone"
                            className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                          />
                        </FormControl>
                        <FormMessage className="text-[var(--error)]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`phones.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {["CELL", "MAIN", "IPHONE", "HOME", "WORK"].map(
                                (t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-[var(--error)]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`phones.${index}.waId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="WA ID (Optional)"
                            className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={() => removePhone(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendPhone({ phone: "", type: "CELL", waId: "" })
                }
              >
                Add Phone
              </Button>
            </div>

            {/* Addresses */}
            <div className="space-y-2">
              <h4 className="text-[var(--foreground)] font-medium">
                Addresses (Optional)
              </h4>
              {addressFields.map((item, index) => (
                <div key={item.id} className="space-y-1 border p-2 rounded-md">
                  {[
                    "street",
                    "city",
                    "state",
                    "zip",
                    "country",
                    "countryCode",
                  ].map((fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={`addresses.${index}.${fieldName}`}
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel className="text-[var(--foreground)] font-medium">
                            {formatLabel(fieldName)} (Optional)
                          </FormLabel>
                          <FormControl className="mt-2">
                            <Input
                              {...field}
                              placeholder={formatLabel(fieldName)}
                              className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormField
                    control={form.control}
                    name={`addresses.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel className="text-[var(--foreground)] font-medium">
                          Type (Optional)
                        </FormLabel>
                        <div className="mt-1 mb-2">
                          <FormControl>
                            <Select {...field}>
                              <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="HOME">HOME</SelectItem>
                                <SelectItem value="WORK">WORK</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={() => removeAddress(index)}>
                    Remove Address
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={() => appendAddress({})}>
                Add Address
              </Button>
            </div>

            {/* URLs */}
            <div className="space-y-2">
              <h4 className="text-[var(--foreground)] font-medium">
                URLs (Optional)
              </h4>
              {urlFields.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`urls.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="URL"
                            className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                          />
                        </FormControl>
                        <FormMessage className="text-[var(--error)]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`urls.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Select {...field}>
                            <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HOME">HOME</SelectItem>
                              <SelectItem value="WORK">WORK</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={() => removeUrl(index)}>
                    Remove URL
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => appendUrl({ url: "", type: "HOME" })}
              >
                Add URL
              </Button>
            </div>

            {/* Org */}
            <div className="space-y-2">
              <h4 className="text-[var(--foreground)] font-medium">
                Organization (Optional)
              </h4>
              {["company", "department", "title"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={`org.${fieldName}`}
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel className="text-[var(--foreground)] font-medium">
                        {formatLabel(fieldName)} (Optional)
                      </FormLabel>
                      <FormControl className="mt-2">
                        <Input
                          {...field}
                          placeholder={formatLabel(fieldName)}
                          className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md border-none"
            >
              Send
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
