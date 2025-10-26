"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GraduateDuckButtton() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/listen");
  };

  return (
    <div className="relative z-10">
      <button
        onClick={handleButtonClick}
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
      >
        <Image
          src="/graduate_duck2.png"
          alt="Graduate Duck"
          width={300}
          height={300}
          priority
        />
      </button>
    </div>
  );
}
