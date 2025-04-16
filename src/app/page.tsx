import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto mt-4 text-center px-4">
      {/* Logo Placeholder */}
      <div 
        className="mx-auto w-[180px] h-[180px] rounded-full bg-white flex items-center justify-center border-2 border-red-600 shadow-lg mb-5"
      >
<Image
              width={200}
              height={100}
              alt="ambikaempire"
              src="/logo.png"
              />
      </div>

      <h1 className="text-4xl font-bold mb-2">
        Welcome to Ambika Empire
      </h1>
      
      <div className="my-8">
        <img
          src="/supply-chain-image.svg"
          alt="Supply Chain Management"
          className="max-w-full h-auto mb-8 rounded-lg shadow-lg mx-auto"
        />
      </div>

      <div className="mt-12 flex gap-6 justify-center">
        <Link 
          href="/login"
          className="bg-[#e74c3c] text-white py-3 px-8 rounded-lg text-lg font-bold hover:bg-[#c0392b] transition-colors"
        >
          Login
        </Link>
        <Link 
          href="/dashboard"
          className="border border-[#e74c3c] text-[#e74c3c] py-3 px-8 rounded-lg text-lg font-bold hover:bg-red-50 transition-colors"
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
