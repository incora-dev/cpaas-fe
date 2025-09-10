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
import { RecipientField } from "../RecipientField";

const schema = z.object({
  to: z.array(z.string().min(1)).min(1, "At least one recipient is required"),
  cardWidth: z.enum(["SMALL", "MEDIUM"]),
  text: z.string().min(1, "Text is required"),
  items: z.array(
    z.object({
      title: z.string().min(2, "Title must be at least 2 characters long"),
      description: z.string().min(1, "Description is required"),
      mediaUrl: z.string().url("Must be a valid URL"),
      thumbnailUrl: z
        .string()
        .url("Must be a valid URL")
        .or(z.literal("")) 
        .optional(),
      height: z.enum(["SHORT", "MEDIUM", "TALL"]),
      buttons: z
        .array(
          z.object({
            title: z.string().min(1, "Button title required"),
            action: z.string().min(1, "Button action required"),
          })
        )
        .max(2, "Maximum 2 buttons allowed"),
    })
  ),
});

type CarouselFormProps = {
  channel: string;
};

function CarouselItemFields({
  control,
  index,
  removeItem,
}: {
  control: any;
  index: number;
  removeItem: (index: number) => void;
}) {
  const {
    fields: buttons,
    append: addButton,
    remove: removeButton,
  } = useFieldArray({
    control,
    name: `items.${index}.buttons` as const,
  });

  return (
    <Card className="bg-[var(--popover)] border border-[var(--border)] p-4 rounded-lg space-y-4">
      <FormField
        control={control}
        name={`items.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[var(--foreground)] font-medium">
              Item Title
            </FormLabel>
            <FormControl className="mt-2">
              <Input
                placeholder="Item title"
                {...field}
                className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
              />
            </FormControl>
            <FormMessage className="text-[var(--error)]" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`items.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[var(--foreground)] font-medium">
              Item Description
            </FormLabel>
            <FormControl className="mt-2">
              <Input
                placeholder="Item description"
                {...field}
                className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
              />
            </FormControl>
            <FormMessage className="text-[var(--error)]" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`items.${index}.mediaUrl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[var(--foreground)] font-medium">
              Media URL
            </FormLabel>
            <FormControl className="mt-2">
              <Input
                placeholder="https://example.com/image.jpg"
                {...field}
                className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
              />
            </FormControl>
            <FormMessage className="text-[var(--error)]" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`items.${index}.thumbnailUrl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[var(--foreground)] font-medium">
              Thumbnail URL (Optional)
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
        control={control}
        name={`items.${index}.height`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[var(--foreground)] font-medium">
              Height
            </FormLabel>
            <div className="mt-2">
              <FormControl className="mt-2">
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)]">
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
      {buttons.map((btn, btnIndex) => (
        <div key={btn.id} className="flex gap-2 items-end">
          <FormField
            control={control}
            name={`items.${index}.buttons.${btnIndex}.title`}
            render={({ field }) => (
              <FormItem className="flex-1">
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
            control={control}
            name={`items.${index}.buttons.${btnIndex}.action`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-[var(--foreground)] font-medium">
                  Button Action
                </FormLabel>
                <FormControl className="mt-2">
                  <Input
                    placeholder="Button action"
                    {...field}
                    className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0"
                  />
                </FormControl>
                <FormMessage className="text-[var(--error)]" />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => removeButton(btnIndex)}
          >
            X
          </Button>
        </div>
      ))}
      {buttons.length < 2 && (
        <Button
          type="button"
          onClick={() => addButton({ title: "", action: "" })}
          className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
        >
          + Add Button
        </Button>
      )}
      <Button
        type="button"
        variant="destructive"
        onClick={() => removeItem(index)}
        className="w-full"
      >
        Remove Item
      </Button>
    </Card>
  );
}

export function CarouselForm({ channel }: CarouselFormProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      to: [],
      cardWidth: "SMALL",
      text: "",
      items: [
        {
          title: "",
          description: "",
          mediaUrl: "",
          thumbnailUrl: "",
          height: "SHORT",
          buttons: [{ title: "", action: "" }],
        },
      ],
    },
  });

  const { control, handleSubmit } = form;

  const {
    fields: items,
    append: addItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items" as const,
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const payload: any = {
        type: "carousel",
        cardWidth: values.cardWidth,
        text: values.text,
        items: values.items,
      };

      const res = await sendMessage(channel, values.to, payload);

      toast.success("Carousel message sent successfully!");
      console.log("Server response:", res);
    } catch (error: any) {
      toast.error("Failed to send carousel message");
      console.error("Error sending message:", error);
    }
  };

  return (
    <Card className="w-200 max-w-2xl bg-[var(--card)] shadow-xl rounded-xl border border-[var(--border)]">
      <CardHeader className="bg-[var(--popover)] rounded-t-xl border-b border-[var(--border)]">
        <CardTitle className="text-[var(--primary)] text-lg font-bold">
          Send {channel} Carousel
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
            <RecipientField control={form.control} />
            <FormField
              control={control}
              name="cardWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Card Width
                  </FormLabel>
                  <div className="mt-2">
                    <FormControl className="mt-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[var(--input)] text-[var(--foreground)]">
                          <SelectValue placeholder="Select width" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SMALL">SMALL</SelectItem>
                          <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--foreground)] font-medium">
                    Text
                  </FormLabel>
                  <FormControl className="mt-2">
                    <Input
                      placeholder="Text"
                      {...field}
                      className="bg-[var(--input)] text-[var(--foreground)] rounded-md border-none focus:ring-0 focus:border-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[var(--error)]" />
                </FormItem>
              )}
            />
            {items.map((item, index) => (
              <CarouselItemFields
                key={item.id}
                control={control}
                index={index}
                removeItem={removeItem}
              />
            ))}
            <Button
              type="button"
              onClick={() =>
                addItem({
                  title: "",
                  description: "",
                  mediaUrl: "",
                  height: "SHORT",
                  buttons: [{ title: "", action: "" }],
                })
              }
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              + Add Item
            </Button>

            <Button
              type="submit"
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              Send
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
