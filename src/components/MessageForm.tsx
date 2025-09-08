import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TextForm } from "./forms/TextForm";
import { ImageForm } from "./forms/ImageForm";
import { AudioForm } from "./forms/AudioForm";
import { VideoForm } from "./forms/VideoForm";
import { FileForm } from "./forms/FileForm";
import { StickerForm } from "./forms/StickerForm";
import { LocationForm } from "./forms/LocationForm";
import { ListForm } from "./forms/ListForm";
import { OtpForm } from "./forms/OtpForm";
import { ContactForm } from "./forms/ContactForm";
import { CardForm } from "./forms/CardForm";
import { CarouselForm } from "./forms/CarouselForm";

type MessageFormProps = {
  messageType:
    | "Text"
    | "Image"
    | "Audio"
    | "Video"
    | "File"
    | "List"
    | "Location"
    | "Sticker"
    | "Otp"
    | "Contact"
    | "Card"
    | "Carousel";
};

const forms = {
  Text: TextForm,
  Image: ImageForm,
  Audio: AudioForm,
  Video: VideoForm,
  File: FileForm,
  Sticker: StickerForm,
  Location: LocationForm,
  List: ListForm,
  Otp: OtpForm,
  Contact: ContactForm,
  Card: CardForm,
  Carousel: CarouselForm
};

const channelMap: Record<MessageFormProps["messageType"], string[]> = {
  Text: ["SMS", "Viber", "Whatsapp", "RCS"],
  Image: ["Viber", "Whatsapp", "RCS"],
  Audio: ["Whatsapp"],
  Video: ["Viber", "Whatsapp", "RCS"],
  File: ["Viber", "Whatsapp", "RCS"],
  List: ["Viber", "Whatsapp"],
  Location: ["Whatsapp"],
  Sticker: ["Whatsapp"],
  Otp: ["Viber"],
  Contact: ["Whatsapp"],
  Card: ["RCS"],
  Carousel: ["Viber", "RCS"],
};

export function MessageForm({ messageType }: MessageFormProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const SpecificForm = forms[messageType as keyof typeof forms] ?? null;

  const availableChannels = useMemo(() => {
    return channelMap[messageType] || [];
  }, [messageType]);

  useEffect(() => {
    if (availableChannels.length > 0 && !selectedChannel) {
      setSelectedChannel(availableChannels[0]);
    }
  }, [availableChannels, selectedChannel]);

  if (!SpecificForm) {
    return (
      <div className="text-[var(--foreground)]">
        Form not found for {messageType}
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full shadow-lg rounded-xl p-6 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-6 text-[var(--primary)] text-center">
          Choose a Channel
        </h1>

        <Select
          value={selectedChannel ?? ""}
          onValueChange={setSelectedChannel}
        >
          <SelectTrigger className="w-60 bg-[var(--popover)] text-[var(--foreground)] border border-[var(--border)] rounded-md hover:border-[var(--primary)] transition-colors duration-200">
            <SelectValue placeholder="Select channel" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--popover)] text-[var(--foreground)]">
            {availableChannels.map((channel) => (
              <SelectItem
                key={channel}
                value={channel}
                className="hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] rounded-md transition-colors"
              >
                {channel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedChannel && SpecificForm && (
          <div className="mt-8 w-full max-w-md bg-[var(--background)] rounded-lg p-6 shadow-md flex justify-center">
            <SpecificForm channel={selectedChannel} />
          </div>
        )}
      </div>
    </div>
  );
}
