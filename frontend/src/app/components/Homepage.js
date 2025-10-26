"use client";
import Image from "next/image";

export default function Homepage() {
  return (
    <div className="fixed inset-0 z-0">
      <video
        className="absolute inset-0 h-full w-full object-fill"
        src="/background.mp4"
        autoPlay
        loop
        muted
      />
    </div>
  );
}
