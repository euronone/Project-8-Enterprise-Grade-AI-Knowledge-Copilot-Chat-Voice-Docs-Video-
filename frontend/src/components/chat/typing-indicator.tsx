export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#374151] bg-[#1F2937] px-3 py-2 text-xs text-[#9CA3AF] shadow-sm">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6366F1] [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6366F1] [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6366F1]" />
      <span className="ml-1">AI is typing...</span>
    </div>
  );
}
