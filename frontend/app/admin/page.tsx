"use client";

import { useState } from "react";
import Link from "next/link";

interface StreamResponse {
  success: boolean;
  streamId: string;
  rtmpUrl: string;
  streamKey: string;
  watchUrl: string;
  hlsUrl: string;
  deleteKey: string;
}

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState<StreamResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const createStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStreamData(null);

    try {
      const res = await fetch("http://localhost:5000/api/streaming/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title || "Live Stream" }),
      });

      if (!res.ok) {
        throw new Error("Failed to create stream");
      }

      const data = await res.json();
      setStreamData(data);
      setTitle("");
    } catch (err) {
      setError("Failed to create stream. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
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
            <Link
              href="/"
              className="px-6 py-2.5 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Create New Stream
          </h2>
          <p className="text-gray-400">Set up your live streaming session</p>
        </div>

        {/* Create Stream Form */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
          <form onSubmit={createStream} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Stream Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter stream title..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Stream..." : "Create Stream"}
            </button>
          </form>
        </div>

        {/* Stream Details */}
        {streamData && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Stream Created Successfully!
                </h3>
                <p className="text-gray-400 text-sm">
                  Use the details below to start streaming
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* RTMP URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  RTMP URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={streamData.rtmpUrl}
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(streamData.rtmpUrl, "rtmp")}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                  >
                    {copied === "rtmp" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Stream Key */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stream Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={streamData.streamKey}
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(streamData.streamKey, "key")}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                  >
                    {copied === "key" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Watch URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Watch URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={streamData.watchUrl}
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm font-mono"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(streamData.watchUrl, "watch")
                    }
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                  >
                    {copied === "watch" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Delete Key */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Delete Key (Keep this safe!)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={streamData.deleteKey}
                    className="flex-1 px-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm font-mono"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(streamData.deleteKey, "delete")
                    }
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                  >
                    {copied === "delete" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                Streaming Software Setup (OBS, Streamlabs, etc.):
              </h4>
              <ol className="space-y-2 text-sm text-gray-400">
                <li>1. Open your streaming software</li>
                <li>2. Go to Settings → Stream</li>
                <li>3. Select &quot;Custom&quot; as service</li>
                <li>4. Paste the RTMP URL in the &quot;Server&quot; field</li>
                <li>
                  5. Paste the Stream Key in the &quot;Stream Key&quot; field
                </li>
                <li>6. Click &quot;Start Streaming&quot;</li>
              </ol>
            </div>

            <Link
              href={`/watch/${streamData.streamId}`}
              className="block w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-center"
            >
              Go to Watch Page
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
