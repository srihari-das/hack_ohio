'use client';

import Image from 'next/image';

export default function AdultDuckButtton() {
    const handleButtonClick = () => {
    console.log('Button clicked');
    };

    return (
        <button onClick={handleButtonClick}
        className="fixed left-[35%] top-[60%] z-10 cursor-pointer hover:scale-110 transition-transform">
            <Image 
            src = "/adult_duck.png"
            alt="Adult Duck"
            width={300}
            height={300}
            priority
            />
        </button>
    )
}