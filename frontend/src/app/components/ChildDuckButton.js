'use client';

import Image from 'next/image';

export default function ChildDuckButtton() {
    const handleButtonClick = () => {
    console.log('Button clicked');
    };

    return (
        <button onClick={handleButtonClick}
        className="fixed left-[53%] top-[31%] z-10 cursor-pointer hover:scale-110 transition-transform">
            <Image 
            src = "/child_duck.png"
            alt="Child Duck"
            width={300}
            height={300}
            priority
            />
        </button>
    )
}