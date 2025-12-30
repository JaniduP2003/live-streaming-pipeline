#!/bin/bash

# Quick Start Script - Test Streaming Locally

echo "🚀 Starting Local Test..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if backend is running
echo -e "${BLUE}Step 1: Checking backend...${NC}"
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend not running. Start it with: cd backend && dotnet run${NC}"
    exit 1
fi

# Step 2: Create a test stream
echo ""
echo -e "${BLUE}Step 2: Creating test stream...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:5000/api/streaming/create \
    -H "Content-Type: application/json" \
    -d '{"title":"Local Test Stream"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Stream created successfully${NC}"
    echo ""
    echo "$RESPONSE" | jq '.'
    
    # Extract values
    STREAM_ID=$(echo "$RESPONSE" | jq -r '.streamId')
    RTMP_URL=$(echo "$RESPONSE" | jq -r '.rtmpUrl')
    STREAM_KEY=$(echo "$RESPONSE" | jq -r '.streamKey')
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   OBS SETTINGS (Copy these)${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Server:     $RTMP_URL"
    echo "Stream Key: $STREAM_KEY"
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Save to file
    cat > obs-settings.txt << EOF
OBS Stream Settings
===================
Server:     $RTMP_URL
Stream Key: $STREAM_KEY

Watch URL:  http://localhost:3000/watch/$STREAM_ID
Stream ID:  $STREAM_ID

Created: $(date)
EOF
    
    echo ""
    echo -e "${BLUE}Settings saved to: obs-settings.txt${NC}"
    
else
    echo -e "${RED}✗ Failed to create stream${NC}"
    exit 1
fi

# Step 3: Check frontend
echo ""
echo -e "${BLUE}Step 3: Checking frontend...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
    echo ""
    echo -e "${GREEN}Watch your stream at:${NC}"
    echo "http://localhost:3000/watch/$STREAM_ID"
else
    echo -e "${RED}✗ Frontend not running. Start it with: cd frontend && npm run dev${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   NEXT STEPS${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Open OBS Studio"
echo "2. Go to Settings → Stream"
echo "3. Service: Custom..."
echo "4. Enter the Server and Stream Key above"
echo "5. Click 'Start Streaming'"
echo "6. Open: http://localhost:3000/watch/$STREAM_ID"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
