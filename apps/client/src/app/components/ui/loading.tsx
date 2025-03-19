export default function Loading() {
  return (
    <div className="flex flex-row gap-1 w-20 h-5 items-center justify-center animate-spin">
      <div className="w-1 h-1 bg-primary animate-pulse"></div>
      <div className="w-1 h-1 bg-secondary animate-pulse"></div>
      <div className="w-1 h-1 bg-primary animate-pulse"></div>
    </div>
  );
}
