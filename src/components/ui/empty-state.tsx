import { Leaf } from "lucide-react";
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center text-center">
      <Leaf className="mb-3 text-emerald" />
      <h3 className="font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink/60">{body}</p>
    </div>
  );
}
