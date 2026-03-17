export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-2 text-xs text-muted-foreground">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
      <span className="ml-1">AI is typing...</span>
    </div>
  );
}
