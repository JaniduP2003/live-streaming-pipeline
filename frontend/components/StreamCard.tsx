import Link from "next/link";
import LiveBadge from "./LiveBadge";

interface StreamCardProps {
  id: string;
  title: string;
  viewers: number;
  liveSince: string;
}

export default function StreamCard({
  id,
  title,
  viewers,
  liveSince,
}: StreamCardProps) {
  const getTimeSince = (date: string) => {
    const now = new Date();
    const liveDate = new Date(date);
    const diffMs = now.getTime() - liveDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Link href={`/watch/${id}`}>
      <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-purple-900 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Live Badge */}
          <div className="absolute top-3 left-3">
            <LiveBadge />
          </div>

          {/* Viewers Count */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-md flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">
              {viewers} viewers
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Stream ID: {id}</span>
            <span>{getTimeSince(liveSince)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
