import Image from "next/image";
import Homepage from "./components/Homepage";
import GraduateDuckButton from "./components/GraduateDuckButton";

export default async function Home() {
  const response = await fetch('http://localhost:8000/', {
    cache: 'no-store'
  });
  const data = await response.json();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Homepage />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <GraduateDuckButton />
      </main>
    </div>
  );
}
