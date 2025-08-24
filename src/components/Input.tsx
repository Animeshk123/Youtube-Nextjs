"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import router
import { Input } from "./ui/input";

const SearchBar = () => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = input.trim();
    if (!query) return; // ❌ ignore empty strings

    router.push(`/search/${encodeURIComponent(query)}`); // ✅ navigate
  };

  return (
    <div className="flex-1 max-w-md mx-4">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            className="w-full rounded-full font-sans pl-10 pr-4 py-2 bg-white/10 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none border border-white/20 backdrop-blur-md"
            placeholder="Search..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
            />
          </svg>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
