"use client";

import { useRouter } from "next/navigation";
import { FrankLogo } from "@/components/FrankLogo";

// Replace this with your Google Drive link when recorded
const VIDEO_URL = "";

export default function VideoPage() {
  const router = useRouter();

  if (VIDEO_URL) {
    if (typeof window !== "undefined") window.location.href = VIDEO_URL;
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ backgroundColor: "#FAF9F6" }}>
      <FrankLogo size={36} color="#D42B1E" />
      <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 900, fontSize: 28, color: "#2C1D12", marginTop: 16 }}>
        FRANK
      </h1>
      <p className="text-sm mt-4 text-center" style={{ color: "#5C4D3C", maxWidth: 400 }}>
        Video coming soon. In the meantime, explore the live demo:
      </p>
      <button
        onClick={() => router.push("/beckton")}
        className="mt-6 px-6 py-3 text-sm font-bold"
        style={{ backgroundColor: "#464C72", color: "#FAF9F6", border: "none", borderRadius: "2px", cursor: "pointer" }}
      >
        See Beckton demo →
      </button>
    </div>
  );
}
