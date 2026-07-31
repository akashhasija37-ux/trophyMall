"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Download, Edit, Trash2, X, Save } from "lucide-react";

type CustomerMasterRecord = {
  id: string;
  code: string;
  customerName: string;
  mobile: string;
  category: string;
  type: string;
  city: string;
  creditLimit: number;
  status: "Active" | "Inactive";
};

const initialCustomerMasters: CustomerMasterRecord[] = [
  {
    id: "1",
    code: "CUST-001",
    customerName: "Delhi Sports Club",
    mobile: "+91 98765 43210",
    category: "Sports",
    type: "B2B",
    city: "New Delhi",
    creditLimit: 100000,
    status: "Active",
  },
  {
    id: "2",
    code: "CUST-002",
    customerName: "Maharashtra Cricket Assoc",
    mobile: "+91 91234 56789",
    category: "Association",
    type: "B2B",
    city: "Mumbai",
    creditLimit: 250000,
    status: "Active",
  },
  {
    id: "3",
    code: "CUST-003",
    customerName: "St. Xavier School",
    mobile: "+91 99887 76655",
    category: "School",
    type: "B2B",
    city: "Pune",
    creditLimit: 50000,
    status: "Active",
  },
  {
    id: "4",
    code: "CUST-004",
    customerName: "Rahul Sharma",
    mobile: "+91 95544 33221",
    category: "Individual",
    type: "B2C",
    city: "Nagpur",
    creditLimit: 10000,
    status: "Active",
  },
  {
    id: "5",
    code: "CUST-005",
    customerName: "Apex Wholesalers",
    mobile: "+91 93322 11445",
    category: "Wholesale",
    type: "Wholesaler",
    city: "Nashik",
    creditLimit: 500000,
    status: "Inactive",
  },
];

export default function CustomerMasterPage() {
  const [records, setRecords] = useState<CustomerMasterRecord[]>(initialCustomerMasters);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gstin, setGstin] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [referenceSource, setReferenceSource] = useState("");
  const [creditLimit, setCreditLimit] = useState("50000");

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSaveNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobileNumber) return;

    const newRecord: CustomerMasterRecord = {
      id: Date.now().toString(),
      code: `CUST-00${records.length + 1}`,
      customerName,
      mobile: mobileNumber,
      category: category || "General",
      type: customerType || "B2C",
      city: city || "Unknown",
      creditLimit: Number(creditLimit) || 0,
      status: "Active",
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);

    // Reset Form
    setCustomerName("");
    setMobileNumber("");
    setAlternateMobile("");
    setEmail("");
    setDob("");
    setGstin("");
    setState("");
    setCity("");
    setAddress("");
    setCategory("");
    setCustomerType("");
    setReferenceSource("");
    setCreditLimit("50000");
  };

  const filteredRecords = records.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar relative">
          
          {/* TOP BREADCRUMB HEADER */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Masters / <span className="text-zinc-300">Customer Master</span>
              </p>
              <h1 className="text-xl font-bold text-white">Customer Master</h1>
            </div>
            <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
              <Plus size={16} /> New Invoice
            </button>
          </div>

          <div className="p-6 max-w-[1600px] mx-auto flex flex-col space-y-6">
            
            {/* ACTION HEADER & EXPORT ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-2">Customer Master</h2>
                <p className="text-zinc-400 text-sm">Manage all customers — B2B, B2C, wholesalers and walk-in clients</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                  <Download size={16} /> Export
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
                >
                  <Plus size={16} /> Add New
                </button>
              </div>
            </div>

            {/* FILTERS & SEARCH CONTAINER */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
              <div className="flex items-center gap-2 w-full md:w-auto">
                {(["All", "Active", "Inactive"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === tab
                        ? "bg-green-700 text-white"
                        : "bg-[#1a1a1c] text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search Customer Master..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-200 outline-none transition-colors placeholder:text-zinc-500"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-[#121212] border border-zinc-800/80 rounded-xl overflow-hidden shadow-xl mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                      <th className="py-3.5 px-6 font-semibold">Code</th>
                      <th className="py-3.5 px-6 font-semibold">Customer Name</th>
                      <th className="py-3.5 px-6 font-semibold">Mobile</th>
                      <th className="py-3.5 px-6 font-semibold">Category</th>
                      <th className="py-3.5 px-6 font-semibold">Type</th>
                      <th className="py-3.5 px-6 font-semibold">City</th>
                      <th className="py-3.5 px-6 font-semibold">Credit Limit</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                      <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-sm">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-[#1a1a1c] transition-colors">
                          <td className="py-4 px-6 text-zinc-400 font-mono text-xs">{record.code}</td>
                          <td className="py-4 px-6 font-semibold text-white">{record.customerName}</td>
                          <td className="py-4 px-6 text-zinc-300">{record.mobile}</td>
                          <td className="py-4 px-6 text-zinc-400">{record.category}</td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold text-xs">
                              {record.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-zinc-300">{record.city}</td>
                          <td className="py-4 px-6 font-semibold text-white">{formatCurrency(record.creditLimit)}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className={`w-8 h-4 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                                record.status === "Active" ? "bg-green-700" : "bg-zinc-700"
                              }`}>
                                <span className={`w-3 h-3 bg-white rounded-full transition-transform ${
                                  record.status === "Active" ? "translate-x-4" : "translate-x-0"
                                }`} />
                              </span>
                              <span className={`text-xs font-semibold ${
                                record.status === "Active" ? "text-green-400" : "text-zinc-500"
                              }`}>
                                {record.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-3 text-zinc-400">
                              <button title="Edit Record" className="hover:text-white transition-colors">
                                <Edit size={16} />
                              </button>
                              <button title="Delete Record" className="hover:text-red-400 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-zinc-500">
                          No customer records found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="h-8 bg-[#0a0a0a] border-t border-zinc-900 flex justify-between items-center px-4 text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div> Open Invoices: 0</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Draft Invoices: 0</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Pending Printing: 5</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Pending Dispatch: 8</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Outstanding Collection: <span className="text-red-400 font-medium">₹2,10,000</span></span>
          </div>
          <div className="flex items-center gap-4 opacity-75">
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">F5</kbd> Save</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">F6</kbd> Print</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">Ctrl+W</kbd> WhatsApp</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-[10px]">Esc</kbd> Cancel</span>
          </div>
        </div>
      </div>

      {/* ADD NEW CUSTOMER MASTER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800/85 shrink-0">
              <h3 className="text-base font-bold text-white">Add New — Customer Master</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveNewCustomer} className="p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Customer Name *</label>
                <input
                  type="text"
                  placeholder="Full customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Mobile Number *</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Alternate Mobile</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={alternateMobile}
                  onChange={(e) => setAlternateMobile(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Date of Birth</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">GSTIN</label>
                <input
                  type="text"
                  placeholder="22XXXXX1234X1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select...</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Address</label>
                <textarea
                  rows={2}
                  placeholder="Full billing address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg p-3.5 text-sm text-zinc-200 outline-none transition-colors resize-none placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select...</option>
                  <option value="Sports">Sports</option>
                  <option value="Association">Association</option>
                  <option value="School">School</option>
                  <option value="Individual">Individual</option>
                  <option value="Wholesale">Wholesale</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Customer Type</label>
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select...</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="Wholesaler">Wholesaler</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Reference Source</label>
                <select
                  value={referenceSource}
                  onChange={(e) => setReferenceSource(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select...</option>
                  <option value="Website">Website</option>
                  <option value="Direct Walk-in">Direct Walk-in</option>
                  <option value="Reference">Reference</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400">Credit Limit (₹)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  className="w-full bg-[#1e1e22] border border-zinc-700 focus:border-green-600 rounded-lg px-3.5 py-2.5 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-600"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/85 mt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#222226] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm px-6 py-2.5 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-600 text-white text-sm px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-green-900/30"
                >
                  <Save size={16} /> Save
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}