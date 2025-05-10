"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Customer {
  id: number;
  name: string;
  contact: string;
  customer_ref_id?: string;
  agent?: string;
  address?: string;
  email?: string;
}

interface Agent {
  id: number;
  name: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: "",
    contact: "",
    customer_ref_id: "",
    agent: "",
    address: "",
  });
  const [currentSortField, setCurrentSortField] = useState<string | null>("name");
  const [currentSortDirection, setCurrentSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadCustomers();
    loadAgents();
  }, []);

  useEffect(() => {
    filterCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, searchTerm, currentSortField, currentSortDirection]);

  const loadCustomers = async () => {
    try {
      // In a real app, this would be an API call
      const customersData = JSON.parse(localStorage.getItem("customers") || "[]");
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
    }
  };

  const loadAgents = async () => {
    try {
      // In a real app, this would be an API call
      const agentsData = JSON.parse(localStorage.getItem("agents") || "[]");
      setAgents(agentsData);
    } catch (error) {
      console.error("Error loading agents:", error);
      setAgents([]);
    }
  };

  const filterCustomers = () => {
    const filtered = customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.contact && customer.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.agent && customer.agent.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    // Sort customers if a sort field is selected
    if (currentSortField) {
      filtered.sort((a, b) => {
        const valueA = (a[currentSortField as keyof Customer] || "").toString().toLowerCase();
        const valueB = (b[currentSortField as keyof Customer] || "").toString().toLowerCase();
        
        if (valueA < valueB) {
          return currentSortDirection === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return currentSortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = () => {
    setModalMode("add");
    setFormData({
      name: "",
      contact: "",
      customer_ref_id: "",
      agent: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setModalMode("edit");
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      contact: customer.contact || "",
      customer_ref_id: customer.customer_ref_id || "",
      agent: customer.agent || "",
      address: customer.address || "",
    });
    setIsModalOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      try {
        // In a real app, this would be an API call
        const updatedCustomers = customers.filter((c) => c.id !== customer.id);
        localStorage.setItem("customers", JSON.stringify(updatedCustomers));
        setCustomers(updatedCustomers);
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer. Please try again.");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === "add") {
        // Add new customer
        const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        const newCustomer = { ...formData, id: newId } as Customer;
        
        const updatedCustomers = [...customers, newCustomer];
        localStorage.setItem("customers", JSON.stringify(updatedCustomers));
        setCustomers(updatedCustomers);
        
        // Reset form for next entry
        setFormData({
          name: "",
          contact: "",
          customer_ref_id: "",
          agent: "",
          address: "",
        });
        
        // Show success message
        alert(`Customer ${formData.name} added successfully!`);
      } else {
        // Update existing customer
        if (!selectedCustomer) return;
        
        const updatedCustomers = customers.map(c => {
          if (c.id === selectedCustomer.id) {
            return { ...c, ...formData };
          }
          return c;
        });
        
        localStorage.setItem("customers", JSON.stringify(updatedCustomers));
        setCustomers(updatedCustomers);
        closeModal();
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Failed to save customer. Please try again.");
    }
  };

  const handleSort = (field: string) => {
    if (currentSortField === field) {
      // Toggle sort direction if clicking the same field
      setCurrentSortDirection(currentSortDirection === "asc" ? "desc" : "asc");
    } else {
      setCurrentSortField(field);
      setCurrentSortDirection("asc");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Customers List', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Convert customers data for autotable
    const data = customers.map((customer, index) => {
      return {
        id: index + 1,
        customer_ref_id: customer.customer_ref_id || '-',
        name: customer.name,
        contact: customer.contact || '-',
        email: customer.email || '-',
        agent: customer.agent || '-',
        address: customer.address || '-'
      };
    });
    
    // @ts-expect-error - jsPDF-AutoTable extends jsPDF with the autoTable method
    doc.autoTable({
      startY: 40,
      head: [['Serial No.', 'Customer ID', 'Customer Name', 'Contact Number', 'Email', 'Agent', 'Address/City']],
      body: data.map(item => [
        item.id,
        item.customer_ref_id,
        item.name,
        item.contact,
        item.email,
        item.agent,
        item.address
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [74, 108, 247],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 244, 255]
      }
    });
    
    // Save the PDF
    doc.save('customers_list.pdf');
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Customer Management</h1>
        <div className="space-x-3">
          <button
            onClick={generatePDF}
            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-sm"
          >
            Download PDF
          </button>
          <button
            onClick={handleAddCustomer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Add New Customer
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search customers..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Customer Name 
                  <span className="ml-1">
                    {currentSortField === "name" && (currentSortDirection === "asc" ? "↑" : "↓")}
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address/City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.customer_ref_id || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.contact || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.agent || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer)}
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

      {/* View Customer Modal */}
      {isViewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customer Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Customer Name:</span>
                  <span className="text-gray-800">{selectedCustomer.name || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Contact Number:</span>
                  <span className="text-gray-800">{selectedCustomer.contact || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Customer ID:</span>
                  <span className="text-gray-800">{selectedCustomer.customer_ref_id || '-'}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-3">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Agent:</span>
                  <span className="text-gray-800">{selectedCustomer.agent || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Address/City:</span>
                  <span className="text-gray-800">{selectedCustomer.address || '-'}</span>
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

      {/* Add/Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalMode === "add" ? "Add New Customer" : "Edit Customer"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="customer-name" className="block text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  id="customer-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="customer-contact" className="block text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  id="customer-contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="customer-agent" className="block text-gray-700 mb-2">Agent</label>
                <select
                  id="customer-agent"
                  name="agent"
                  value={formData.agent}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select Agent</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.name}>{agent.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="customer-address" className="block text-gray-700 mb-2">Address/City</label>
                <input
                  type="text"
                  id="customer-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="customer-id" className="block text-gray-700 mb-2">Customer ID</label>
                <input
                  type="text"
                  id="customer-id"
                  name="customer_ref_id"
                  value={formData.customer_ref_id}
                  onChange={handleInputChange}
                  placeholder="Enter manual customer ID"
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
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 