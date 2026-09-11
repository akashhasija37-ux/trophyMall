"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { Plus, Search, Calendar, Download, Eye, Edit, ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type BankPaymentRecord = {
  id: string;
  refNo: string;
  party: string;
  date: string;
  amount: number;
  status: "Transferred" | "Pending";
};

export default function BankPaymentPage() {
  const [records, setRecords] = useState<BankPaymentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Form states for New Bank Payment
  const [voucherNo, setVoucherNo] = useState(`BPY-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [vendorParty, setVendorParty] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Supplier Payment");
  const [bankAccount, setBankAccount] = useState("HDFC Bank");
  const [transactionNo, setTransactionNo] = useState("");
  const [narration, setNarration] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBankPayments();
  }, []);

  const fetchBankPayments = async () => {
    try {
      const res = await fetch("/api/receipts?method=Bank");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecords(
          data.map((item: any) => ({
            id: String(item.id),
            refNo: item.receipt_no || item.refNo,
            party: item.party_name || item.party,
            date: item.receipt_date ? item.receipt_date.split("T")[0] : "",
            amount: Number(item.amount || 0),
            status: item.status || "Transferred",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch bank payments", err);
    }
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredRecords = records.filter((item) => {
    const matchesSearch =
      item.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? item.date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  const handleSaveBankPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorParty || !amount) {
      toast.error("Please fill in Vendor/Party and Amount");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        invoice_id: voucherNo,
        party_name: vendorParty,
        payment_method: "Bank",
        amount: Number(amount),
        receipt_date: paymentDate,
        status: "Transferred",
      };

      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save bank payment");

      toast.success("Bank Payment saved successfully! ✅");
      fetchBankPayments();
      setIsCreating(false);
      setVendorParty("");
      setAmount("");
      setTransactionNo("");
      setNarration("");
      setVoucherNo(`BPY-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    } catch (err: any) {
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
          
          <div className="px-6 py-4 flex justify-between items-start border-b border-zinc-800/60">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                Billing Management / <span className="text-zinc-300">Bank Payment</span>
              </p>
              <h1 className="text-xl font-bold text-white">Bank Payment</h1>
            </div>
            <Link href="/dashboard/create-invoice">
              <button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium shadow-sm">
                <Plus size={16} /> New Invoice
              </button>
            </Link>
          </div>

          <div className="p-6 max-w-[1400px] mx-auto flex flex-col space-y-6">
            
            {isCreating ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <button onClick={() => setIsCreating(false)} className="hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} /> Bank Payment
                  </button>
                  <span>›</span>
                  <span className="text-white font-medium">New Bank Payment</span>
                </div>

                <form onSubmit={handleSaveBankPayment} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-6 shadow-xl flex flex-col gap-5">
                    <h2 className="text-base font-bold text-white border-b border-zinc-800 pb-3">Payment Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Voucher No</label>
                        <input
                          type="text"
                          value={voucherNo}
                          onChange={(e) => setVoucherNo(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Payment Date *</label>
                        <input
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-400">Vendor / Party *</label>
                      <input
                        type="text"
                        placeholder="Search vendor..."
                        value={vendorParty}
                        onChange={(e) => setVendorParty(e.target.value)}
                        className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Amount (₹) *</label>
                        <input
                          type="number"
                          placeholder="₹ 0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Purpose / Category</label>
                        <select
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none cursor-pointer"
                        >
                          <option>Supplier Payment</option>
                          <option>Courier & Freight</option>
                          <option>Office Supplies</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Bank Account</label>
                        <select
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none cursor-pointer"
                        >
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>State Bank of India</option>
                          <option>Indian Bank</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400">Transaction No / UTR</label>
                        <input
                          type="text"
                          placeholder="UTR/NEFT/IMPS Ref"
                          value={transactionNo}
                          onChange={(e) => setTransactionNo(e.target.value)}
                          className="w-full bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3 border-t border-zinc-800 pt-4">
                      <button type="button" onClick={() => setIsCreating(false)} className="bg-zinc-800 text-zinc-300 text-sm px-5 py-2.5 rounded-lg">Cancel</button>
                      <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-600 text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2">
                        <Save size={16} /> {loading ? "Saving..." : "Save Bank Payment"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-[#121212] border border-zinc-800/80 rounded-xl p-6 shadow-xl flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white leading-none mb-2">Bank Payment Records</h2>
                    <p className="text-zinc-400 text-sm">{filteredRecords.length} records</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <input 
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-[#1a1a1c] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none"
                    />
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none"
                    />
                    <button onClick={() => setIsCreating(true)} className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2">
                      <Plus size={16} /> New Payment
                    </button>
                  </div>
                </div>

                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-[#0f0f0f]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#18181a] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
                        <th className="py-3.5 px-6 font-semibold">Ref No</th>
                        <th className="py-3.5 px-6 font-semibold">Party</th>
                        <th className="py-3.5 px-6 font-semibold">Date</th>
                        <th className="py-3.5 px-6 font-semibold">Amount</th>
                        <th className="py-3.5 px-6 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-sm">
                      {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-[#121212]">
                            <td className="py-4 px-6 font-semibold text-white">{record.refNo}</td>
                            <td className="py-4 px-6 text-zinc-300">{record.party}</td>
                            <td className="py-4 px-6 text-zinc-400">{record.date}</td>
                            <td className="py-4 px-6 font-bold text-white">{formatCurrency(record.amount)}</td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/40">
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-zinc-500">
                            No bank payment records found from database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}