"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/user";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
              <h1 className="text-xl font-semibold text-white">Ambika Empire</h1>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4">
              <p className="text-sm text-white">Welcome, {user.name || user.username}</p>
              <p className="text-xs text-[#34495e]/80">{user.role}</p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-white text-[#34495e] hover:bg-[#34495e]/10 py-1 px-3 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <Link href="/dashboard" className="border-b-2 border-[#34495e] text-[#34495e] px-3 py-4 text-sm font-medium">Dashboard</Link>
            <Link href="/dashboard/vendors" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Vendors</Link>
            <Link href="/dashboard/products" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Products</Link>
            <Link href="/dashboard/orders" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Orders</Link>
            <Link href="/dashboard/inventory" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Inventory</Link>
            <Link href="/dashboard/reports" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Reports</Link>
            <Link href="/dashboard/settings" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Settings</Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Management Dashboard</h2>
          <p className="text-gray-600">Welcome to your vendor management portal</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Vendors</div>
                <div className="text-2xl font-bold text-gray-800">24</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Contracts</div>
                <div className="text-2xl font-bold text-gray-800">18</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Pending Orders</div>
                <div className="text-2xl font-bold text-gray-800">5</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-md lg:col-span-3">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Recent Vendor Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold">
                          AC
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Acme Corporation</div>
                          <div className="text-sm text-gray-500">ID: VEN-2023-001</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IT Services</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, 9:41 AM</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                          GI
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Globex Industries</div>
                          <div className="text-sm text-gray-500">ID: VEN-2023-008</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Manufacturing</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday, 2:30 PM</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                          UC
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Umbrella Corp</div>
                          <div className="text-sm text-gray-500">ID: VEN-2023-015</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Pharmaceuticals</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jul 15, 2023</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <Link href="/dashboard/vendors" className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center">
                View all vendors
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md lg:col-span-2">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-6">
              <Link href="/dashboard/vendors" className="w-full flex items-center justify-between bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-lg transition-colors">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Vendor
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link href="/dashboard/vendors" className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Create New Contract
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link href="/dashboard/reports" className="w-full flex items-center justify-between bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg transition-colors">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              
              <Link href="/dashboard/vendors" className="w-full flex items-center justify-between bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg transition-colors">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Review
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Ambika Empire Vendor Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 