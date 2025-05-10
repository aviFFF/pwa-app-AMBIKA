"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/user";
import { registerServiceWorker } from "../sw-register";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Register service worker for PWA functionality
    registerServiceWorker();
    
    // Check if user is logged in
    const userStr = sessionStorage.getItem("user");
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr) as User;
        setUser(userData);
      } catch {
        // Invalid user data, redirect to login
        router.push("/login");
      }
    } else {
      // No user data, redirect to login
      router.push("/login");
    }
    
    setLoading(false);
  }, [router]);
  
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/login");
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-[#34495e] to-[#2c3e50] text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-[50px] h-[50px] relative flex items-center justify-center rounded-full overflow-hidden border-2 border-white shadow-lg mr-3">
                <Image
                  src="/logo.png"
                  alt="Ambika Empire Logo"
                  width={50}
                  height={50}
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-xl font-semibold text-white hidden sm:block">Ambika Empire</h1>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 hidden sm:block">
              <p className="text-sm text-white">Welcome, {user.name || user.username}</p>
              <p className="text-xs text-[#34495e]/80">{user.role}</p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-white text-[#34495e] hover:bg-[#34495e]/10 py-1 px-3 rounded text-sm transition-colors"
            >
              Logout
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="ml-4 text-white block sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="bg-white shadow-md p-4 sm:hidden">
          <div className="mb-4 border-b pb-2">
            <p className="text-sm text-gray-800 font-medium">Welcome, {user.name || user.username}</p>
            <p className="text-xs text-gray-600">{user.role}</p>
          </div>
          <nav className="flex flex-col space-y-2">
            <Link 
              href="/dashboard" 
              className={`px-4 py-2 rounded-md ${pathname === '/dashboard' ? 'bg-[#34495e] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/sales" 
              className={`px-4 py-2 rounded-md ${pathname === '/dashboard/sales' ? 'bg-[#34495e] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Sales
            </Link>
            <Link 
              href="/dashboard/customers" 
              className={`px-4 py-2 rounded-md ${pathname === '/dashboard/customers' ? 'bg-[#34495e] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Customers
            </Link>
            <Link 
              href="/dashboard/products" 
              className={`px-4 py-2 rounded-md ${pathname === '/dashboard/products' ? 'bg-[#34495e] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              href="/dashboard/suppliers" 
              className={`px-4 py-2 rounded-md ${pathname === '/dashboard/suppliers' ? 'bg-[#34495e] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Suppliers
            </Link>
            <Link 
              href="/dashboard/agents" 
              className={`px-4 py-2 rounded-md ${pathname === '/dashboard/agents' ? 'bg-[#34495e] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Agents
            </Link>
            <Link 
              href="/dashboard/inventory" 
              className={`px-4 py-2 rounded-md ${pathname === '/dashboard/inventory' ? 'bg-[#34495e] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Inventory
            </Link>
          </nav>
        </div>
      )}
      
      {/* Desktop navigation */}
      <nav className="bg-white shadow-sm hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link 
              href="/dashboard" 
              className={`border-b-2 ${pathname === '/dashboard' ? 'border-[#34495e] text-[#34495e]' : 'border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e]'} px-3 py-4 text-sm font-medium transition-colors`}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/sales" 
              className={`border-b-2 ${pathname === '/dashboard/sales' ? 'border-[#34495e] text-[#34495e]' : 'border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e]'} px-3 py-4 text-sm font-medium transition-colors`}
            >
              Sales
            </Link>
            <Link 
              href="/dashboard/customers" 
              className={`border-b-2 ${pathname === '/dashboard/customers' ? 'border-[#34495e] text-[#34495e]' : 'border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e]'} px-3 py-4 text-sm font-medium transition-colors`}
            >
              Customers
            </Link>
            <Link 
              href="/dashboard/products" 
              className={`border-b-2 ${pathname === '/dashboard/products' ? 'border-[#34495e] text-[#34495e]' : 'border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e]'} px-3 py-4 text-sm font-medium transition-colors`}
            >
              Products
            </Link>
            <Link 
              href="/dashboard/suppliers" 
              className={`border-b-2 ${pathname === '/dashboard/suppliers' ? 'border-[#34495e] text-[#34495e]' : 'border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e]'} px-3 py-4 text-sm font-medium transition-colors`}
            >
              Suppliers
            </Link>
            <Link 
              href="/dashboard/agents" 
              className={`border-b-2 ${pathname === '/dashboard/agents' ? 'border-[#34495e] text-[#34495e]' : 'border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e]'} px-3 py-4 text-sm font-medium transition-colors`}
            >
              Agents
            </Link>
            <Link 
              href="/dashboard/inventory" 
              className={`border-b-2 ${pathname === '/dashboard/inventory' ? 'border-[#34495e] text-[#34495e]' : 'border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e]'} px-3 py-4 text-sm font-medium transition-colors`}
            >
              Inventory
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      
      <footer className="bg-white py-4 sm:py-6 border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} Ambika Empire. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 