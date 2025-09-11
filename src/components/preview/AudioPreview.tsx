import { Card } from "../ui/card";

type AudioPreviewProps = {
  mediaUrl: string;
};

export function AudioPreview({
  mediaUrl,
}: AudioPreviewProps) {

  return (
    <Card className="w-150 max-w-sm bg-[var(--popover)] text-[var(--foreground)] shadow-md rounded-xl p-4 flex flex-col items-center justify-center">
      <div className="w-full h-full rounded-md border border-[var(--border)] overflow-hidden bg-[var(--muted)] p-3 flex items-center justify-center">
        {mediaUrl ? (
          <audio src={mediaUrl} controls className="w-full">
            Your browser does not support the audio element.
          </audio>
        ) : (
          <span className="text-sm text-[var(--muted-foreground)]">
            Audio Preview
          </span>
        )}
      </div>
    </Card>
  );
}
