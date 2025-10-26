"use client";
import Image from "next/image";

export default function Homepage() {
  return (
    <div className="fixed inset-0 z-0">
      <Image
        src="/ddb_home_background.jpg"
        alt="Background Image"
        fill
        className="object-fill"
      />
    </div>
  );
}
