import type { StockState } from "@/lib/catalog";

const dotColour: Record<StockState["status"], string> = {
  "in-stock": "bg-success",
  "low-stock": "bg-warning",
  "sold-out": "bg-subtle",
};

const textColour: Record<StockState["status"], string> = {
  "in-stock": "text-ink-soft",
  "low-stock": "text-warning",
  "sold-out": "text-muted",
};

export function StockStatus({ stock }: { stock: StockState }) {
  return (
    <p className={`flex items-center gap-2 text-caption ${textColour[stock.status]}`}>
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${dotColour[stock.status]}`}
      />
      {stock.label}
    </p>
  );
}
