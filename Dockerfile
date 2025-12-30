FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget curl ca-certificates supervisor \
    software-properties-common gnupg2 \
    && rm -rf /var/lib/apt/lists/*

# Install .NET 8 Runtime
RUN wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    rm packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y aspnetcore-runtime-8.0 && \
    rm -rf /var/lib/apt/lists/*

# Install SRS Media Server
WORKDIR /opt
RUN wget https://github.com/ossrs/srs/releases/download/v6.0-b3/srs-server-v6.0-b3-ubuntu22.tar.gz && \
    tar -xf srs-server-v6.0-b3-ubuntu22.tar.gz && \
    rm srs-server-v6.0-b3-ubuntu22.tar.gz && \
    mv srs-server srs

# Create directories
RUN mkdir -p /var/hls /app

# Copy .NET API (build output)
WORKDIR /app
COPY backend/bin/Debug/net8.0/ ./

# Copy SRS config
COPY srs.conf /opt/srs/conf/docker.conf

# Copy supervisor config
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
# 1935 - RTMP ingest
# 8080 - SRS HTTP/HLS server
# 5000 - .NET API
# 10000 - Main external port (for Render)
EXPOSE 1935 8080 5000 10000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
