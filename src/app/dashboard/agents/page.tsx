"use client";

import { useState, useEffect } from "react";
import { generatePDF } from "@/utils/pdf-fix";

interface Agent {
  id: number;
  name: string;
  contact: string;
  email?: string;
  city: string;
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: "",
    contact: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    filterAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agents, searchTerm]);

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

  const filterAgents = () => {
    const filtered = agents.filter((agent) => {
      return (
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.contact && agent.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (agent.city && agent.city.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredAgents(filtered);
  };

  const handleAddAgent = () => {
    setModalMode("add");
    setFormData({
      name: "",
      contact: "",
      email: "",
      city: "",
    });
    setIsModalOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setModalMode("edit");
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      contact: agent.contact || "",
      email: agent.email || "",
      city: agent.city || "",
    });
    setIsModalOpen(true);
  };

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsViewModalOpen(true);
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (window.confirm("Are you sure you want to delete this agent? This action cannot be undone.")) {
      try {
        // In a real app, this would be an API call
        const updatedAgents = agents.filter((a) => a.id !== agent.id);
        localStorage.setItem("agents", JSON.stringify(updatedAgents));
        setAgents(updatedAgents);
      } catch (error) {
        console.error("Error deleting agent:", error);
        alert("Failed to delete agent. Please try again.");
      }
    }
  };

  const handleGeneratePDF = async () => {
    // Convert agents data for PDF
    const data = agents.map((agent, index) => {
      return [
        index + 1,
        agent.name,
        agent.contact || '-',
        agent.email || '-',
        agent.city || '-'
      ];
    });
    
    // Generate PDF using our utility
    const success = await generatePDF(
      'Agents List',
      ['Serial Number', 'Agent Name', 'Contact Number', 'Email', 'City'],
      data,
      'agents_list.pdf'
    );
    
    if (!success) {
      console.error("Failed to generate agents PDF");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        // Add new agent
        const newId = agents.length > 0 ? Math.max(...agents.map(a => a.id)) + 1 : 1;
        const newAgent = { ...formData, id: newId } as Agent;
        
        const updatedAgents = [...agents, newAgent];
        localStorage.setItem("agents", JSON.stringify(updatedAgents));
        setAgents(updatedAgents);
        
        // Reset form for next entry
        setFormData({
          name: "",
          contact: "",
          email: "",
          city: "",
        });
        
        // Show success message
        alert(`Agent ${formData.name} added successfully!`);
      } else {
        // Update existing agent
        if (!selectedAgent) return;
        
        const updatedAgents = agents.map(a => {
          if (a.id === selectedAgent.id) {
            return { ...a, ...formData };
          }
          return a;
        });
        
        localStorage.setItem("agents", JSON.stringify(updatedAgents));
        setAgents(updatedAgents);
        closeModal();
      }
    } catch (error) {
      console.error("Error saving agent:", error);
      alert("Failed to save agent. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Agent Management</h1>
        <div className="space-x-3">
          <button
            onClick={handleGeneratePDF}
            className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded text-sm"
          >
            Download PDF
          </button>
          <button
            onClick={handleAddAgent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Add New Agent
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search agents..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No agents found</td>
                </tr>
              ) : (
                filteredAgents.map((agent, index) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.contact || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.city || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewAgent(agent)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditAgent(agent)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAgent(agent)}
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

      {/* View Agent Modal */}
      {isViewModalOpen && selectedAgent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Agent Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Agent Name:</span>
                  <span className="text-gray-800">{selectedAgent.name || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Contact Number:</span>
                  <span className="text-gray-800">{selectedAgent.contact || '-'}</span>
                </div>
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">Email:</span>
                  <span className="text-gray-800">{selectedAgent.email || '-'}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-3">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600 w-1/3">City:</span>
                  <span className="text-gray-800">{selectedAgent.city || '-'}</span>
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

      {/* Add/Edit Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalMode === "add" ? "Add New Agent" : "Edit Agent"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="agent-name" className="block text-gray-700 mb-2">Agent Name</label>
                <input
                  type="text"
                  id="agent-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="agent-contact" className="block text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  id="agent-contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="agent-city" className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  id="agent-city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="agent-email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="agent-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
                  Save Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 