'use client'

import Image from "next/image";

export default function Title() {
    return (
        <Image className="fixed left-[35%] top-[5%] z-10"
        src = "/what_the_duck.png"
        alt="Title"
        width = {600}
        height = {150}
        priority
        ></Image>
    )
}