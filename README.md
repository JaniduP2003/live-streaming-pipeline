# 🎥 Free Live Streaming Platform

A **100% FREE** end-to-end live streaming platform using OBS, RTMP, SRS Media Server, .NET 8, and Next.js. Deploy to free tiers of Render.com and Vercel for $0/month hosting.

## ✨ Features

- 🔴 **Live RTMP streaming** with OBS Studio
- 📱 **HLS playback** in browser (works on all devices)
- 🎬 **Multiple concurrent streams**
- 🔐 **Secure stream keys** with authentication
- 📊 **Live viewer tracking**
- 🎨 **Modern, responsive UI** with Next.js + Tailwind
- 🚀 **Low latency** (3-6 second delay)
- 💰 **100% FREE** deployment (Render + Vercel)

## 🚀 Quick Start

### 1. Start Backend

```bash
cd backend
dotnet restore
dotnet run
```

Backend runs on: http://localhost:5000

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

### 3. Create Stream & Get OBS Settings

```bash
./quick-start.sh
```

### 4. Configure OBS

- **Server:** `rtmp://localhost:1935/live`
- **Stream Key:** (from quick-start.sh output)
- Click **Start Streaming**

### 5. Watch

Open: http://localhost:3000

## 📚 Complete Guides

- **[OBS Setup Guide](OBS_SETUP_GUIDE.md)** - Configure OBS Studio step-by-step
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy to Render + Vercel (FREE)

## 🏗️ Architecture

```
OBS Studio (RTMP) → SRS Media Server (HLS) → .NET API → Next.js Frontend → 👥 Viewers
```

## 💰 Cost: $0/month

| Service    | Free Tier             |
| ---------- | --------------------- |
| Render.com | 750 hours/month       |
| Vercel     | 100GB bandwidth/month |
| **TOTAL**  | **$0**                |

Perfect for 5-50 concurrent viewers!

## 📁 Project Structure

```
backend/          # .NET 8 API
frontend/         # Next.js App
Dockerfile        # Production container
srs.conf          # SRS Media Server config
supervisord.conf  # Process manager
```

## 🔑 API Endpoints

- `POST /api/streaming/create` - Create new stream
- `GET /api/streaming/live` - List live streams
- `GET /api/streaming/stream/{id}` - Get stream info
- `DELETE /api/streaming/stream/{id}` - Delete stream

## 🐳 Docker Deployment

```bash
# Build
docker build -t streaming-platform .

# Run
docker run -p 1935:1935 -p 8080:8080 -p 5000:5000 -p 10000:10000 streaming-platform
```

## 🌐 Production Deployment

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete instructions.

**Quick version:**

1. Push to GitHub
2. Deploy backend to Render.com (Docker)
3. Deploy frontend to Vercel
4. Done! 🎉

## 🐛 Troubleshooting

### OBS can't connect

- Check backend: `curl http://localhost:5000/health`
- Verify stream key matches exactly
- Allow port 1935 in firewall

### Video won't play

- Check stream is live: `curl http://localhost:5000/api/streaming/live`
- Try different browser (Safari has best HLS support)
- Check browser console for errors

## 📈 Tech Stack

- **.NET 8** - Backend API
- **SRS Media Server** - RTMP → HLS transcoding
- **Next.js 14** - Frontend
- **HLS.js** - Video player
- **Tailwind CSS** - Styling
- **Docker** - Containerization

## 🤝 Contributing

Contributions welcome! Fork, make changes, and submit a PR.

## 📝 License

MIT License - free to use for personal or commercial projects!

---

**Ready to stream? Run `./quick-start.sh` and go live!** 🚀

**Made with ❤️ in Sri Lanka 🇱🇰**
