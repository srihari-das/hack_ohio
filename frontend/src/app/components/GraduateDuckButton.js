"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function GraduateDuckButtton() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/listen");
  };

  return (
    <button onClick={handleButtonClick}
        className="fixed left-[29%] top-[23%] z-20 cursor-pointer hover:scale-110 transition-transform">
            <Image 
            src = "/graduate_duck2.png"
            alt="Graduate Duck"
            width={300}
            height={300}
            priority
            />
        </button>
  );
}
