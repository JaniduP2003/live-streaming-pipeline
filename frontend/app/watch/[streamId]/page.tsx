import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import LiveBadge from "@/components/LiveBadge";

interface StreamInfo {
  streamId: string;
  title: string;
  isLive: boolean;
  createdAt: string;
  liveSince: string | null;
  hlsUrl: string;
  viewers: number;
}

async function getStreamInfo(streamId: string): Promise<StreamInfo | null> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/streaming/stream/${streamId}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch stream info:", error);
    return null;
  }
}

export default async function WatchPage({
  params,
}: {
  params: { streamId: string };
}) {
  const streamInfo = await getStreamInfo(params.streamId);

  if (!streamInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">StreamHub</h1>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Stream Not Found
            </h2>
            <p className="text-gray-400 mb-8">
              This stream does not exist or has been deleted.
            </p>
            <Link
              href="/"
              className="inline-flex px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">StreamHub</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer hlsUrl={streamInfo.hlsUrl} />

            {/* Stream Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {streamInfo.title}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Stream ID: {streamInfo.streamId}
                  </p>
                </div>
                {streamInfo.isLive && (
                  <div className="flex-shrink-0">
                    <LiveBadge />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{streamInfo.viewers} viewers</span>
                </div>

                {streamInfo.liveSince && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Started{" "}
                      {new Date(streamInfo.liveSince).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stream Status */}
            {!streamInfo.isLive && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-yellow-400 font-semibold">
                      Stream Offline
                    </h3>
                    <p className="text-yellow-300/80 text-sm">
                      This stream is not currently live. Check back later!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Stream Details
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        streamInfo.isLive
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    <p className="text-white font-medium">
                      {streamInfo.isLive ? "Live" : "Offline"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mb-1">Created</p>
                  <p className="text-white">
                    {new Date(streamInfo.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 mb-1">Stream URL</p>
                  <p className="text-white font-mono text-xs break-all bg-black/30 p-2 rounded">
                    {streamInfo.hlsUrl}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/"
                  className="block w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-center font-medium rounded-lg transition-all duration-200"
                >
                  Browse More Streams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
