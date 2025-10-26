'use client';

import Image from 'next/image';

export default function CodeDuckButtton() {
    const handleButtonClick = () => {
    console.log('Button clicked');
    };

    return (
        <button onClick={handleButtonClick}
        className="fixed left-[15%] top-[42%] z-20 cursor-pointer hover:scale-110 transition-transform">
            <Image 
            src = "/code_duck.png"
            alt="Code Duck"
            width={300}
            height={300}
            priority
            />
        </button>
    )
}