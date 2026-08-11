const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig = {
  /**
   * Proxy the API through Next so the browser only ever talks to one origin.
   * That lets the backend's httpOnly, sameSite=strict auth cookie work as-is,
   * with no CORS exceptions to open up.
   */
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      // Uploaded catalogue images live on the backend's disk.
      { source: "/uploads/:path*", destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
