'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors border-2 border-amber-800"
    >
      <span className="text-xl">←</span>
      <span>Back</span>
    </button>
  );
}