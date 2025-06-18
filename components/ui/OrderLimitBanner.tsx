import { Megaphone } from "lucide-react";

export function OrderLimitBanner() {
  return (
    <div className="mb-8 rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-4 text-center backdrop-blur-sm">
      <div className="flex items-center justify-center gap-3">
        <Megaphone className="h-6 w-6 text-yellow-300" />
        <p className="font-display text-lg font-semibold text-yellow-200">
          First Drop: Limited to 100 total orders!
        </p>
      </div>
    </div>
  );
}
