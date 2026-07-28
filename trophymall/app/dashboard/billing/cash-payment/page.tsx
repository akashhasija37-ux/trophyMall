"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Calendar, Download, Eye, Edit, ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

type CashPaymentRecord = {
  id: string;
  refNo: string;
  party: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
};

const mockRecords: CashPaymentRecord[] = [
  {
    id: "1",
    refNo: "CPY-2026-0041",
    party: "DTDC Courier",
    date: "2026-06-12",
    amount: 1200,
    status: "Paid",
  },
  {
    id: "2",
    refNo: "CPY-2026-0040",
    party: "Office Supplies",
    date: "2026-06-10",
    amount: 3500,
    status: "Paid",
  },
];

export default function CashPaymentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Form states for New Cash Payment
  const [voucherNo, setVoucherNo] = useState("CPY-2026-0042");
  const [paymentDate, setPaymentDate] = useState("");
  const [vendorParty, setVendorParty] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Supplier Payment");
  const [narration, setNarration] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecords = mockRecords.filter((item) => {
    const matchesSearch =
      item.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? item.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  const handleSaveCashPayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cash Payment successfully saved!");
    setIsCreating(false);
  };

  const toggleInvoiceSelection = (invNo: string) => {
    if (selectedInvoices.includes(invNo)) {
      setSelectedInvoices(selectedInvoices.filter((i) => i !== invNo));
    } else {
      setSelectedInvoices([...selectedInvoices, invNo]);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          
          {/* TOP BREADCRUMB HEADER */}
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Cash Payment</span>
              </p>
              <h1 className="text-xl font-bold text-white">Cash Payment</h1>
            </div>
           <Link href="/dashboard/create-invoice">
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm"
              >
                <Plus size={16} /> New Invoice
              </button>
           </Link>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto flex flex-col space-y-6">
            
            {isCreating ? (
              /* NEW CASH PAYMENT FORM VIEW */
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft size={16} /> Cash Payment
                  </button>
                  <span>›</span>
                  <span className="text-white font-medium">New Cash Payment</span>
                </div>

                <form onSubmit={handleSaveCashPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column: Payment Details */}
                  <div className="lg:col-span-2 bg-[#121212] border border-zinc-800/80 rounded-xl p-6 shadow-xl flex flex-col gap-5">
                    <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-3">Payment Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Voucher No</label>
                        <input
                          type="text"
                          value={voucherNo}
                          onChange={(e) => setVoucherNo(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:border-zinc-500 outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Payment Date *</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:border-zinc-500 outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-400">Vendor / Party *</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search vendor..."
                          value={vendorParty}
                          onChange={(e) => setVendorParty(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg pl-3 pr-10 py-2.5 text-sm text-zinc-200 focus:border-zinc-500 outline-none"
                          required
                        />
                        <Search size={16} className="absolute right-3 top-3 text-zinc-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Amount (₹) *</label>
                        <input
                          type="number"
                          placeholder="₹ 0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:border-zinc-500 outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Purpose / Category</label>
                        <select
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 focus:border-zinc-500 outline-none cursor-pointer"
                        >
                          <option>Supplier Payment</option>
                          <option>Courier & Freight</option>
                          <option>Office Supplies</option>
                          <option>Miscellaneous Expense</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-400">Narration / Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Payment details..."
                        value={narration}
                        onChange={(e) => setNarration(e.target.value)}
                        className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:border-zinc-500 outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Column: Against Invoices */}
                  <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-6 shadow-xl flex flex-col gap-4">
                    <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-3">Against Invoices</h2>
                    
                    <div className="flex flex-col gap-3">
                      {[
                        { invNo: "PUR-2026-0041", party: "Raj Metals", due: "Jun 25", amt: "₹34,500" },
                        { invNo: "PUR-2026-0038", party: "Raj Metals", due: "Jun 15", amt: "₹18,200" },
                      ].map((inv) => {
                        const isChecked = selectedInvoices.includes(inv.invNo);
                        return (
                          <div
                            key={inv.invNo}
                            onClick={() => toggleInvoiceSelection(inv.invNo)}
                            className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                              isChecked ? "bg-green-950/20 border-green-800/60" : "bg-[#1a1a1c] border-zinc-800 hover:border-zinc-700"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 rounded border-zinc-700 accent-green-600 cursor-pointer"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">{inv.invNo}</span>
                                <span className="text-xs text-zinc-400">{inv.party} · Due: {inv.due}</span>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-white">{inv.amt}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-end gap-3 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm px-5 py-2.5 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-700 hover:bg-green-600 text-white text-sm px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
                      >
                        <Save size={16} /> Save Cash Payment
                      </button>
                    </div>
                  </div>

                </form>
              </div>
            ) : (
              /* DEFAULT TABLE VIEW */
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-6 shadow-xl flex flex-col gap-6">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white leading-none mb-2">Cash Payment</h2>
                    <p className="text-zinc-400 text-sm">{filteredRecords.length} records</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <div className="relative flex-1 md:w-64">
                      <input 
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1a1c] border border-zinc-700 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 outline-none transition-colors placeholder:text-zinc-500"
                      />
                      <Search size={16} className="absolute left-3 top-2.5 text-zinc-500" />
                    </div>

                    <div className="relative">
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-[#1a1a1c] border border-zinc-700 focus:border-zinc-500 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none transition-colors"
                      />
                    </div>

                    <button className="bg-[#1a1a1c] hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
                      <Download size={16} /> Export
                    </button>

                    <button 
                      onClick={() => setIsCreating(true)}
                      className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    >
                      <Plus size={16} /> New
                    </button>
                  </div>
                </div>

                {/* DATA TABLE */}
                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-[#0f0f0f]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                          <th className="py-3.5 px-6 font-semibold">Ref No</th>
                          <th className="py-3.5 px-6 font-semibold">Party</th>
                          <th className="py-3.5 px-6 font-semibold">Date</th>
                          <th className="py-3.5 px-6 font-semibold">Amount</th>
                          <th className="py-3.5 px-6 font-semibold">Status</th>
                          <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-sm">
                        {filteredRecords.length > 0 ? (
                          filteredRecords.map((record) => (
                            <tr key={record.id} className="hover:bg-[#121212] transition-colors">
                              <td className="py-4 px-6 font-semibold text-white">{record.refNo}</td>
                              <td className="py-4 px-6 text-zinc-300">{record.party}</td>
                              <td className="py-4 px-6 text-zinc-400">{record.date}</td>
                              <td className="py-4 px-6 font-bold text-white">{formatCurrency(record.amount)}</td>
                              <td className="py-4 px-6">
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-950/60 text-green-400 border border-green-800/40">
                                  {record.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-3 text-zinc-400">
                                  <button title="View Details" className="hover:text-white transition-colors">
                                    <Eye size={16} />
                                  </button>
                                  <button title="Edit Record" className="hover:text-white transition-colors">
                                    <Edit size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-zinc-500">
                              No cash payment records found matching your filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

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
    </div>
  );
}