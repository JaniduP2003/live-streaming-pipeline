# StreamHub - Frontend Documentation

## Overview

This is a modern, responsive frontend for the live-streaming pipeline built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Project Structure

```
frontend/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Stream creation page
│   ├── watch/
│   │   └── [streamId]/
│   │       └── page.tsx      # Stream viewing page
│   ├── page.tsx              # Homepage - browse live streams
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── StreamCard.tsx        # Stream card component
│   ├── VideoPlayer.tsx       # HLS video player
│   └── LiveBadge.tsx         # Live indicator badge
└── public/                   # Static assets
```

## Features

### 1. Homepage (`/`)

- **Browse Live Streams**: Grid view of all currently active streams
- **Stream Cards**: Show title, viewer count, live duration, and thumbnail
- **Real-time Data**: Fetches latest stream data on each page load
- **Empty State**: Encourages users to create first stream

### 2. Admin Dashboard (`/admin`)

- **Create Streams**: Simple form to create new streaming sessions
- **RTMP Credentials**: Displays server URL and stream key
- **Copy to Clipboard**: Easy copying of credentials
- **Setup Instructions**: Step-by-step guide for OBS configuration
- **Watch Link**: Direct link to newly created stream

### 3. Watch Page (`/watch/[streamId]`)

- **HLS Video Player**: Uses hls.js for smooth playback
- **Stream Information**: Title, status, viewer count, timestamps
- **Responsive Layout**: Video player + sidebar with details
- **Status Indicators**: Live badge and offline warnings
- **Stream Details**: Creation time, HLS URL, current status

## Components

### StreamCard Component

```tsx
<StreamCard
  id="stream123"
  title="My Live Stream"
  viewers={42}
  liveSince="2025-12-29T10:00:00Z"
/>
```

**Features:**

- Clickable card linking to watch page
- Live badge indicator
- Viewer count with pulsing dot
- Time since stream started
- Hover effects and animations

### VideoPlayer Component

```tsx
<VideoPlayer hlsUrl="http://localhost:8080/live/stream123.m3u8" />
```

**Features:**

- HLS.js integration for cross-browser support
- Automatic playback on load
- Native Safari HLS support fallback
- Low latency mode enabled
- Error handling and logging

### LiveBadge Component

```tsx
<LiveBadge />
```

**Features:**

- Pulsing red indicator
- "LIVE" text label
- Animated effects

## API Integration

The frontend communicates with the backend API running on `http://localhost:5000`.

### Endpoints Used

#### Get Live Streams

```typescript
GET / api / streaming / live;

Response: [
  {
    id: "abc123",
    title: "My Stream",
    liveSince: "2025-12-29T10:00:00Z",
    viewers: 42,
  },
];
```

#### Get Stream Info

```typescript
GET /api/streaming/stream/{streamId}

Response: {
  streamId: "abc123",
  title: "My Stream",
  isLive: true,
  createdAt: "2025-12-29T09:00:00Z",
  liveSince: "2025-12-29T10:00:00Z",
  hlsUrl: "http://localhost:8080/live/abc123.m3u8",
  viewers: 42
}
```

#### Create Stream

```typescript
POST /api/streaming/create
Body: { title: "My Stream" }

Response: {
  success: true,
  streamId: "abc123",
  rtmpUrl: "rtmp://localhost:1935/live",
  streamKey: "abc123?key=xxx",
  watchUrl: "http://localhost:3000/watch/abc123",
  hlsUrl: "http://localhost:8080/live/abc123.m3u8",
  deleteKey: "xxx"
}
```

## Styling

### Tailwind CSS Configuration

The project uses Tailwind CSS v4 with the following design system:

**Colors:**

- Primary gradient: Purple (500) to Pink (500)
- Background: Slate (900) with Purple (900) gradient
- Text: White primary, Gray (400) secondary
- Accents: Purple, Pink, Red (for live), Green (for success)

**Key Design Patterns:**

- Glass morphism effects (`backdrop-blur-sm`, `bg-white/5`)
- Rounded corners (`rounded-lg`, `rounded-2xl`)
- Smooth transitions (`transition-all duration-200`)
- Hover effects with shadows (`hover:shadow-purple-500/50`)
- Responsive grid layouts

## Development

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Video Streaming

### HLS (HTTP Live Streaming)

The frontend uses HLS.js to play video streams. HLS is a streaming protocol that breaks video into small chunks and delivers them over HTTP.

**How it works:**

1. SRS media server receives RTMP stream from broadcaster
2. SRS transcodes stream to HLS format (.m3u8 playlist + .ts segments)
3. Frontend fetches HLS playlist and segments
4. HLS.js handles playback in the browser

**Browser Support:**

- Chrome/Edge: Via hls.js
- Firefox: Via hls.js
- Safari: Native HLS support
- Mobile browsers: Native/hls.js

### Low Latency Configuration

The video player is configured for low latency:

```typescript
{
  enableWorker: true,      // Use web worker for better performance
  lowLatencyMode: true,    // Enable low latency mode
  backBufferLength: 90,    // Keep 90s of back buffer
}
```

## Troubleshooting

### Common Issues

**Problem: Streams not loading on homepage**

- Solution: Ensure backend is running on port 5000
- Check CORS configuration in backend

**Problem: Video not playing**

- Solution: Verify SRS media server is running on port 8080
- Check that stream is actually live (broadcaster connected)
- Check browser console for HLS errors

**Problem: CORS errors**

- Solution: Backend must allow `http://localhost:3000` origin
- Check `Program.cs` CORS policy

**Problem: Build errors**

- Solution: Run `npm install` to ensure all dependencies installed
- Check that TypeScript version is compatible

## Performance

### Optimization Techniques

1. **Server Components**: Homepage uses React Server Components for faster initial load
2. **No-Store Cache**: Stream data uses `cache: 'no-store'` for real-time updates
3. **Dynamic Routes**: Watch pages use Next.js dynamic routing
4. **Image Optimization**: Future enhancement - could use Next.js Image component
5. **Code Splitting**: Automatic with Next.js App Router

### Lighthouse Scores Target

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## Future Enhancements

- [ ] Add user authentication
- [ ] Chat functionality for viewers
- [ ] Stream analytics dashboard
- [ ] Stream recording playback
- [ ] Social sharing features
- [ ] Push notifications for new streams
- [ ] Dark/light mode toggle
- [ ] Multi-language support
- [ ] Stream categories and tags
- [ ] Search and filter functionality

## Contributing

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Maintain Tailwind CSS styling conventions
4. Test on multiple browsers
5. Ensure responsive design works on mobile

## License

MIT
