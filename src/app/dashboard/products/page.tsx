"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { generatePDF } from '@/utils/pdf-fix';

// Create dynamic component that only loads on client side
const PDFExporter = dynamic(
  () => import('@/utils/pdfConfig').then(mod => ({ default: mod.createPDF })),
  { ssr: false }
);

interface Product {
  id: number;
  code: string;
  name: string;
  size?: string;
  category: string;
  supplierId?: number;
  price: number;
  quantity?: number;
}

interface Supplier {
  id: number;
  name: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    code: "",
    name: "",
    size: "",
    category: "",
    price: 0,
  });
  const [supplierName, setSupplierName] = useState("");
  const [supplierSuggestions, setSupplierSuggestions] = useState<Supplier[]>([]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchTerm, categoryFilter, sortBy]);

  const loadProducts = async () => {
    try {
      // In a real app, this would be an API call
      const productsData = JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    }
  };

  const loadSuppliers = async () => {
    try {
      // In a real app, this would be an API call
      const suppliersData = JSON.parse(localStorage.getItem("vendors") || "[]");
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      setSuppliers([]);
    }
  };

  const filterProducts = () => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === "" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        return a.price - b.price;
      } else if (sortBy === "code") {
        return a.code.localeCompare(b.code);
      }
      return 0;
    });

    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setModalMode("add");
    setFormData({
      code: "",
      name: "",
      size: "",
      category: "",
      price: 0,
    });
    setSupplierName("");
    setCodeError("");
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    
    // Find supplier name
    let currentSupplierName = "";
    if (product.supplierId) {
      const supplier = suppliers.find(s => s.id === product.supplierId);
      if (supplier) {
        currentSupplierName = supplier.name;
      }
    }
    
    setFormData({
      code: product.code,
      name: product.name,
      size: product.size || "",
      category: product.category,
      price: product.price,
    });
    setSupplierName(currentSupplierName);
    setCodeError("");
    setIsModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        // In a real app, this would be an API call
        const updatedProducts = products.filter(p => p.id !== product.id);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        
        // Store update timestamp for cross-page updates
        sessionStorage.setItem("product-update-timestamp", new Date().getTime().toString());
        
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "code") {
      // Check for duplicate code
      const isDuplicate = products.some(
        p => p.code === value && (!selectedProduct || p.id !== selectedProduct.id)
      );
      
      if (isDuplicate) {
        setCodeError("This product code already exists. Please use a unique code.");
      } else {
        setCodeError("");
      }
    }
    
    setFormData({
      ...formData,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSupplierInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSupplierName(value);
    
    if (value.trim() !== "") {
      // Filter suppliers that start with the input value
      const filtered = suppliers.filter(supplier => 
        supplier.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSupplierSuggestions(filtered);
      setShowSupplierDropdown(filtered.length > 0);
    } else {
      setSupplierSuggestions([]);
      setShowSupplierDropdown(false);
    }
  };

  const selectSupplier = (supplier: Supplier) => {
    setSupplierName(supplier.name);
    setShowSupplierDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (codeError) {
      alert("Please fix the errors before submitting.");
      return;
    }
    
    try {
      // Find supplier ID from name
      let supplierId = 0;
      const supplier = suppliers.find(s => s.name === supplierName);
      if (supplier) {
        supplierId = supplier.id;
      }
      
      const productData = {
        ...formData,
        supplierId,
      };
      
      if (modalMode === "add") {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { ...productData, id: newId } as Product;
        
        const updatedProducts = [...products, newProduct];
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        
        // Reset form for next entry
        setFormData({
          code: "",
          name: "",
          size: "",
          category: "",
          price: 0,
        });
        setSupplierName("");
        
        // Show success message
        alert(`Product ${productData.name} added successfully!`);
      } else {
        // Update existing product
        if (!selectedProduct) return;
        
        const updatedProducts = products.map(p => {
          if (p.id === selectedProduct.id) {
            return { ...p, ...productData, supplierId };
          }
          return p;
        });
        
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        closeModal();
      }
      
      // Store update timestamp for cross-page updates
      sessionStorage.setItem("product-update-timestamp", new Date().getTime().toString());
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleGeneratePDF = async () => {
    // Convert products data for PDF
    const data = products.map((product, index) => {
      // Get supplier name from supplierId
      let supplierName = '-';
      if (product.supplierId) {
        const supplier = suppliers.find(s => s.id === product.supplierId);
        if (supplier) {
          supplierName = supplier.name;
        }
      }
      
      return [
        index + 1,
        product.code || '-',
        product.name,
        product.size || '-',
        product.category || '-',
        supplierName,
        product.price ? `₹${product.price.toFixed(2)}` : '₹0.00'
      ];
    });
    
    // Generate PDF
    const success = await generatePDF(
      'Products List',
      ['Serial No.', 'Product Code', 'Product Name', 'Size', 'Category', 'Supplier', 'Rate'],
      data,
      'products_list.pdf'
    );
    
    if (!success) {
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const getSupplierName = (supplierId?: number) => {
    if (!supplierId) return '-';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : '-';
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Product Management</h1>
        <div className="space-x-3">
          <button
            onClick={handleGeneratePDF}
            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-sm"
          >
            Download PDF
          </button>
          <button
            onClick={handleAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Sack">Sack</option>
            <option value="Kg sack">Kg sack</option>
            <option value="School bag">School bag</option>
            <option value="Teddy sack">Teddy sack</option>
            <option value="Tiffin bag">Tiffin bag</option>
            <option value="Custom">Custom</option>
          </select>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="code">Sort by Product Code</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No products found</td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.size || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSupplierName(product.supplierId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Product Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Product Code:</span>
                  <span className="text-gray-800">{selectedProduct.code || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Product Name:</span>
                  <span className="text-gray-800">{selectedProduct.name || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Product Size:</span>
                  <span className="text-gray-800">{selectedProduct.size || '-'}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-3">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Category:</span>
                  <span className="text-gray-800">{selectedProduct.category || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Supplier:</span>
                  <span className="text-gray-800">{getSupplierName(selectedProduct.supplierId)}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Rate:</span>
                  <span className="text-gray-800">₹{selectedProduct.price || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalMode === "add" ? "Add New Product" : "Edit Product"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="product-code" className="block text-gray-700 mb-2">Product Code</label>
                <input
                  type="text"
                  id="product-code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`w-full border ${codeError ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded px-3 py-2`}
                  required
                />
                {codeError && <p className="text-red-500 text-sm mt-1">{codeError}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="product-name" className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  id="product-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="product-size" className="block text-gray-700 mb-2">Product Size</label>
                <input
                  type="text"
                  id="product-size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="product-category" className="block text-gray-700 mb-2">Category</label>
                <select
                  id="product-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Sack">Sack</option>
                  <option value="Kg sack">Kg sack</option>
                  <option value="School bag">School bag</option>
                  <option value="Teddy sack">Teddy sack</option>
                  <option value="Tiffin bag">Tiffin bag</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="product-supplier" className="block text-gray-700 mb-2">Supplier</label>
                <div className="relative">
                  <input
                    type="text"
                    id="product-supplier"
                    value={supplierName}
                    onChange={handleSupplierInputChange}
                    placeholder="Enter supplier name"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                    autoComplete="off"
                  />
                  {showSupplierDropdown && (
                    <div className="absolute w-full mt-1 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-10">
                      {supplierSuggestions.map(supplier => (
                        <div
                          key={supplier.id}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => selectSupplier(supplier)}
                        >
                          {supplier.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="product-price" className="block text-gray-700 mb-2">Rate (₹)</label>
                <input
                  type="number"
                  id="product-price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={!!codeError}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 