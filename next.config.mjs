/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "hips.hearstapps.com" },
      { protocol: "https", hostname: "media.dreamcargiveaways.co.uk" },
      { protocol: "https", hostname: "www.automoli.com" },
      { protocol: "https", hostname: "www.mad4wheels.com" },
      { protocol: "https", hostname: "images.pistonheads.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "s1.cdn.autoevolution.com" },
      { protocol: "https", hostname: "media.ed.edmunds-media.com" },
      { protocol: "https", hostname: "cdn.motor1.com" },
      { protocol: "https", hostname: "www.abt-america.com" },
      { protocol: "https", hostname: "cdn.elferspot.com" },
    ],
  },
};

export default nextConfig;
