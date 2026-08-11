const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig = {
  /**
   * Next blocks its dev-only resources when the page is opened from anything
   * other than localhost. Reaching the site over the LAN then loads the HTML
   * but not the JavaScript, so the page renders and nothing is clickable.
   * Private LAN ranges are allowed here so sharing over Wi-Fi works; this
   * affects the dev server only, never a production build.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],

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
