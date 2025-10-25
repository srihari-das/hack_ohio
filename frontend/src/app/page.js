import Homepage from "./components/Homepage";
import GraduateDuckButton from "./components/GraduateDuckButton";
import Link from "next/link";
import ChildDuckButton from "./components/ChildDuckButton";
import AdultDuckButton from "./components/AdultDuckButton";
import CodeDuckButton from "./components/CodeDuckButton";
import Title from "./components/Title";

export default async function Home() {
  const response = await fetch('http://localhost:8000/', {
    cache: 'no-store'
  });
  const data = await response.json();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <Title />
        <Link href="/quacking">
          <GraduateDuckButton />
        </Link>
        <Link href="/quacking">
          <Homepage />
        </Link>
        <Link href="/quacking">
          <ChildDuckButton />
        </Link>
        <Link href="/quacking">
          <AdultDuckButton />
        </Link>
        <Link href="/quacking">
          <CodeDuckButton />
        </Link>
      </main>
    </div>
  );
}