import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

type VideoPreviewProps = {
  channel: string;
  mediaUrl?: string;
  caption?: string;
  thumbnailUrl?: string;
  duration?: number | string;
  button?: { title: string; action: string } | undefined;
};

function formatDurationRaw(val?: number | string) {
  if (val == null || val === "") return "";
  const sec = typeof val === "string" ? Number(val) : val;
  if (Number.isNaN(sec) || sec <= 0) return String(val);
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function VideoPreview({
  channel,
  mediaUrl,
  caption,
  thumbnailUrl,
  duration,
  button,
}: VideoPreviewProps) {
  const ch = channel?.toLowerCase() ?? "";

  return (
    <Card className="w-150 max-w-sm bg-[var(--popover)] text-[var(--foreground)] shadow-md rounded-xl p-4 flex flex-col items-center">
      <div className="w-full h-full rounded-md border border-[var(--border)] overflow-hidden bg-[var(--muted)] flex items-center justify-center">
        {mediaUrl ? (
          <video
            src={mediaUrl}
            poster={thumbnailUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : thumbnailUrl ? (
          <div className="relative w-full h-full">
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm text-[var(--muted-foreground)]">
              Video Preview
            </span>
          </div>
        )}
      </div>

      {caption && (
        <p className="mt-3 text-sm text-left leading-snug w-full">{caption}</p>
      )}

      {duration !== 0 && (
        <p className="mt-1 text-xs text-[var(--muted-foreground)] w-full text-left">
          ⏱ {formatDurationRaw(duration)}
        </p>
      )}

      {ch === "viber" && button && (
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
