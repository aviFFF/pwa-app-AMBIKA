"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/types/user";

export default function Products() {
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
              <div className="w-[50px] h-[50px] flex items-center justify-center bg-white text-[#34495e] rounded-full text-xs font-bold mr-3">
                <span>AMBIKA</span>
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
            <Link href="/dashboard" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Dashboard</Link>
            <Link href="/dashboard/vendors" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Vendors</Link>
            <Link href="/dashboard/products" className="border-b-2 border-[#34495e] text-[#34495e] px-3 py-4 text-sm font-medium">Products</Link>
            <Link href="/dashboard/orders" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Orders</Link>
            <Link href="/dashboard/inventory" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Inventory</Link>
            <Link href="/dashboard/reports" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Reports</Link>
            <Link href="/dashboard/settings" className="border-b-2 border-transparent hover:border-[#34495e]/30 text-gray-600 hover:text-[#34495e] px-3 py-4 text-sm font-medium transition-colors">Settings</Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Product Catalog</h3>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Product
            </button>
          </div>
          <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Category:</span>
              <select className="border border-gray-300 rounded-md p-1 text-sm">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Home Goods</option>
                <option>Groceries</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="border border-gray-300 rounded-md p-1 pl-8 text-sm w-64"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-2 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Smartphone X1</div>
                        <div className="text-sm text-gray-500">Flagship Model</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PRD-001-EL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Electronics</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹49,999</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock (45)</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Laptop Pro</div>
                        <div className="text-sm text-gray-500">15-inch Display</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PRD-002-EL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Electronics</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹89,999</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock (12)</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Cotton T-Shirt</div>
                        <div className="text-sm text-gray-500">Round Neck, Black</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PRD-010-CL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Clothing</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹799</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Stock (3)</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Smart Watch</div>
                        <div className="text-sm text-gray-500">Fitness Tracker</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PRD-005-EL</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Electronics</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹4,999</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <div className="text-sm text-gray-600">Showing 4 of 120 products</div>
            <div className="flex">
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-l-md">Previous</button>
              <button className="px-3 py-1 bg-red-600 text-white">1</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700">2</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700">3</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-r-md">Next</button>
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