import { Card } from "../ui/card";
import { Button } from "../ui/button";

type ImagePreviewProps = {
  channel: string;
  mediaUrl?: string;
  caption?: string;
  button?: { title: string; action: string } | undefined;
};

export function ImagePreview({
  channel,
  mediaUrl,
  caption,
  button,
}: ImagePreviewProps) {
  return (
    <Card className="w-150 max-w-sm bg-[var(--popover)] text-[var(--foreground)] shadow-md rounded-xl p-4 flex flex-col items-center">
      {mediaUrl ? (
        <img
          src={mediaUrl}
          alt="Preview"
          className="w-full h-full object-cover rounded-md border border-[var(--border)]"
        />
      ) : (
        <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center rounded-md">
          <span className="text-sm text-[var(--muted-foreground)]">
            Image Preview
          </span>
        </div>
      )}

      {caption && (
        <p className="mt-3 text-sm text-left leading-snug w-full">{caption}</p>
      )}

      {channel.toLowerCase() === "viber" && button && (
        <Button
          className="mt-3 w-full bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md"
          onClick={() => window.open(button.action, "_blank")}
        >
          {button.title}
        </Button>
      )}
    </Card>
  );
}
