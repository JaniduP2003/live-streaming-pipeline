export default function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 rounded-md shadow-lg">
      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <span className="text-white text-xs font-bold uppercase tracking-wide">
        Live
      </span>
    </div>
  );
}
