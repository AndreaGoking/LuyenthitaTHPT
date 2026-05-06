# ════════════════════════════════════════════════════════════════
# Stage 1: Build
# ════════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy NuGet.config TRƯỚC để clear fallback Windows paths
# (file này sẽ được tạo ở bước dưới)
COPY NuGet.config ./

# Copy .csproj và restore
COPY *.csproj ./
RUN dotnet restore --configfile NuGet.config

# Copy toàn bộ source
COPY . .

# FIX: Bỏ --no-restore → publish tự restore lại với config sạch
# --no-restore gây lỗi vì nó dùng lại cache có Windows path
RUN dotnet publish -c Release -o /app/publish

# ════════════════════════════════════════════════════════════════
# Stage 2: Runtime
# ════════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

# PORT được Render inject tự động (thường là 10000)
# Dùng shell form để $PORT được expand đúng lúc runtime
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

# Dùng shell script để đọc $PORT lúc container start
# ASPNETCORE_URLS="http://+:${PORT:-8080}" dotnet LuyenThiTiengAnh.dll
CMD ["sh", "-c", "ASPNETCORE_URLS=\"http://+:${PORT:-8080}\" dotnet LuyenThiTiengAnh.dll"]