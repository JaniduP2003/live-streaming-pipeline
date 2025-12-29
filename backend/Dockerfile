FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["StreamingApi/StreamingApi.csproj", "StreamingApi/"]
RUN dotnet restore "StreamingApi/StreamingApi.csproj"
COPY . . 
WORKDIR "/src/StreamingApi"
RUN dotnet build "StreamingApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "StreamingApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StreamingApi.dll"]