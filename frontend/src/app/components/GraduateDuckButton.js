'use client';

import Image from 'next/image';

export default function GraduateDuckButtton() {
    const handleButtonClick = () => {
    console.log('Button clicked');
    alert('Quack!');
    };

    return (
        <div className='relative z-10'>
            <button onClick={handleButtonClick}
            className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform">
                <Image 
                src = "/graduate_duck2.png"
                alt="Graduate Duck"
                width={300}
                height={300}
                priority
                />
            </button>
        </div>
    )
}