export function HomePage() {
  return (
    <div className="flex h-full flex-col items-start justify-center px-10">
      <h1 className="text-3xl font-semibold text-[var(--sidebar)]">Your boards</h1>
      <p className="mt-2 max-w-lg text-[var(--muted)]">
        Pick a board from the sidebar, or create a workspace and board to start
        tracking work like Monday.com.
      </p>
    </div>
  );
}
