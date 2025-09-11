import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";

type CarouselItem = {
  title: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  buttons?: { title: string; action: string }[];
};

type CarouselPreviewProps = {
  channel: string;
  items: CarouselItem[];
};

export function CarouselPreview({ channel, items }: CarouselPreviewProps) {
  const ch = channel.toLowerCase();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = items[activeIndex];

  const nextItem = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prevItem = () =>
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <Card className="w-150 max-w-sm bg-[var(--popover)] text-[var(--foreground)] shadow-md rounded-xl p-4 flex flex-col items-center">
      <div className="relative w-full h-150 rounded-md border border-[var(--border)] overflow-hidden bg-[var(--muted)] flex items-center justify-center">
        {activeItem.mediaUrl ? (
          <img
            src={activeItem.mediaUrl}
            alt={activeItem.title}
            className="w-full h-full object-cover rounded-md border border-[var(--border)]"
          />
        ) : (
          <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center rounded-md">
            <span className="text-sm text-[var(--muted-foreground)]">
              Carousel Preview
            </span>
          </div>
        )}
        {items.length > 1 && (
          <>
            <button
              onClick={prevItem}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center text-white"
            >
              ◀
            </button>
            <button
              onClick={nextItem}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center text-white"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <h3 className="mt-2 text-sm font-semibold text-left w-full">
        {activeItem.title}
      </h3>

      {ch === "viber" &&
        activeItem.buttons?.map((btn, i) => (
          <Button
            key={i}
            className={`
        mt-2 w-full rounded-md
        ${
          i === 0
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "bg-transparent text-[var(--primary)] border-none"
        }
      `}
            onClick={() => window.open(btn.action, "_blank")}
          >
            {btn.title}
          </Button>
        ))}
    </Card>
  );
}
