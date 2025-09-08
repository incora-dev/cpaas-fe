import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver } from "react-hook-form";
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

const locationSchema = z.object({
  to: z.string().min(1, "Recipient is required"),
  latitude: z.coerce
    .number()
    .refine(
      (val) => Math.abs(val) <= 90,
      "Latitude must be between -90 and 90"
    ),
  longitude: z.coerce
    .number()
    .refine(
      (val) => Math.abs(val) <= 180,
      "Longitude must be between -180 and 180"
    ),
  name: z.string().optional(),
  address: z.string().optional(),
});

type LocationFormProps = {
  channel: string;
};

export function LocationForm({ channel }: LocationFormProps) {
  type LocationFormValues = z.infer<typeof locationSchema>;

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema) as Resolver<LocationFormValues>,
    defaultValues: {
      to: "",
      latitude: 0,
      longitude: 0,
      name: "",
      address: "",
    },
  });


function onSubmit(values: z.infer<typeof locationSchema>) {
  const payload = {
    type: "location",
    latitude: values.latitude,
    longitude: values.longitude,
    name: values.name,
    address: values.address,
  };

  sendMessage(channel, values.to, payload)
    .then((res) => {
      toast.success("Location message sent successfully!");
      console.log("Server response:", res);
    })
    .catch((error) => {
      toast.error("Failed to send location message");
      console.error("Error sending location:", error);
    });
}

  return (
    <Card className="w-200 max-w-sm bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Latitude
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Enter latitude"
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
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Longitude
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Enter longitude"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Name (Optional)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Location name"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Address (Optional)
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Location address"
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
