"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <button
        className="mt-4 rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
