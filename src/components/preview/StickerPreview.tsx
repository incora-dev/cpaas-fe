import { Card } from "../ui/card";

type StickerPreviewProps = {
  mediaUrl: string;
};

export function StickerPreview({ mediaUrl }: StickerPreviewProps) {
  return (
    <Card className="w-150 max-w-sm bg-[var(--popover)] text-[var(--foreground)] shadow-md rounded-xl p-4 flex flex-col items-center justify-center">
      <div className="w-full h-full rounded-md border border-[var(--border)] overflow-hidden bg-[var(--muted)] p-3 flex items-center justify-center">
        {mediaUrl ? (
          <img
            src={mediaUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-md border border-[var(--border)]"
          />
        ) : (
          <span className="text-sm text-[var(--muted-foreground)]">
            Sticker Preview
          </span>
        )}
      </div>
    </Card>
  );
}
