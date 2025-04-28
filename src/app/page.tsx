import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mt-4 text-center px-4">
      {/* Logo */}
      <div 
        className="mx-auto w-[180px] h-[180px] relative flex items-center justify-center rounded-full overflow-hidden shadow-lg mb-5"
      >
        <Image
          src="/logo.png"
          alt="Ambika Empire Logo"
          width={180}
          height={180}
          className="object-cover"
          priority
        />
      </div>

      <h1 className="text-4xl font-bold mb-2 text-[#34495e]">
        Welcome to Ambika Empire
      </h1>

      <div className="mt-12 flex gap-6 justify-center">
        <Link 
          href="/login"
          className="bg-[#34495e] text-white py-3 px-8 rounded-lg text-lg font-bold hover:bg-[#2c3e50] transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/dashboard"
          className="border border-[#34495e] text-[#34495e] py-3 px-8 rounded-lg text-lg font-bold hover:bg-[#34495e]/10 transition-colors"
        >
          Dashboard
        </Link>
      </div>
      
      <div className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Ambika Empire Vendor Management. All rights reserved.
      </div>
    </div>
  );
}
