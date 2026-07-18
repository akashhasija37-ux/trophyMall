"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { message } from "antd";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import { 
  FileText, Save, Printer, MessageSquare, Plus, 
  ChevronDown, Search, CheckCircle2, Check
} from "lucide-react";

type ProformaItem = {
  id: string;
  barcode: string;
  tmCode: string;
  prodCode: string;
  product: string;
  hsn: string;
  qty: number;
  unit: string;
  price: number;
  discount: number;
  gstPercent: number;
  total: number;
};

type ProformaTab = {
  id: string;
  customerName: string;
  customerCode: string;
  mobile: string;
  email: string;
  dob: string;
  state: string;
  city: string;
  category: string;
  customerType: string;
  refSource: string;
  referralCode: string;
  
  proformaNo: string;
  proformaDate: string;
  dueDate: string;
  salesperson: string;
  billedBy: string;
  branch: string;
  paymentType: string;
  orderType: string;
  deliveryMethod: string;

  items: ProformaItem[];
};

const createNewProforma = (index: number): ProformaTab => ({
  id: crypto.randomUUID(),
  customerName: "",
  customerCode: "CUST-1279",
  mobile: "9876543210",
  email: "email@example.com",
  dob: "",
  state: "Maharashtra",
  city: "",
  category: "Cricket",
  customerType: "First Time",
  refSource: "Friend",
  referralCode: "REF-XXXX",

  proformaNo: `PRF-2026-${String(962 + index).padStart(4, '0')}`,
  proformaDate: "2026-06-12",
  dueDate: "",
  salesperson: "Rajesh Kumar",
  billedBy: "Online Team",
  branch: "Mumbai HQ",
  paymentType: "Final Payment",
  orderType: "Spot Delivery",
  deliveryMethod: "Self Pickup",

  items: [
    {
      id: crypto.randomUUID(),
      barcode: "",
      tmCode: "",
      prodCode: "",
      product: "",
      hsn: "",
      qty: 1,
      unit: "PCS",
      price: 0,
      discount: 0,
      gstPercent: 5,
      total: 0,
    },
  ],
});

export default function ProformaPage() {
  const [tabs, setTabs] = useState<ProformaTab[]>([createNewProforma(0)]);
  const [activeTab, setActiveTab] = useState("");
  const [showEwayBill, setShowEwayBill] = useState(false);
  const [isRoundOff, setIsRoundOff] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault();
        saveCurrentProforma();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  const convertToInvoice = async () => {
    // API call logic here
    message.success("Converted Successfully");
  };

  const saveCurrentProforma = async () => {
    message.success("Proforma Invoice Saved Successfully");
  };

  useEffect(() => {
    const draft = localStorage.getItem("proforma-draft");
    if (draft) {
      try {
        setTabs(JSON.parse(draft));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("proforma-draft", JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    if (!activeTab && tabs.length) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const current = tabs.find((t) => t.id === activeTab) || tabs[0];

  const subtotal = current.items.reduce((sum, item) => sum + item.total, 0);
  const invoiceDiscount = 0;
  const additionalDiscount = 0;
  const netAmount = subtotal - invoiceDiscount - additionalDiscount;

  // Split GST assuming Intra-state (CGST + SGST) based on 5% aggregate from the screenshot
  const cgst = netAmount > 0 ? (netAmount * 2.5) / 100 : 0;
  const sgst = netAmount > 0 ? (netAmount * 2.5) / 100 : 0;
  
  const freight = 0;
  const otherCharges = 0;

  const totalBeforeRoundOff = netAmount + cgst + sgst + freight + otherCharges;
  const roundOff = isRoundOff ? Math.round(totalBeforeRoundOff) - totalBeforeRoundOff : 0;
  const finalAmount = totalBeforeRoundOff + roundOff;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-200 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />

        {/* TOP HEADER CONTROLS */}
        <div className="px-4 py-3 flex justify-between items-center border-b border-zinc-800 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Proforma Invoice</h1>
            <span className="text-sm text-gray-500">{current.proformaNo}</span>
            <div className="flex items-center bg-zinc-900 rounded-full p-1 border border-zinc-800 ml-4">
              <button className="px-3 py-1 text-xs text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> GST Invoice
              </button>
              <button className="px-3 py-1 text-xs text-gray-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-gray-500"></div> Non-GST Invoice
              </button>
            </div>
            <select className="bg-zinc-900 border border-zinc-800 text-xs px-2 py-1.5 rounded text-gray-300">
              <option>Taxable Exclusive</option>
            </select>
            <span className="text-xs bg-green-900/30 text-green-500 border border-green-900 px-2 py-1 rounded">
              CGST + SGST
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={convertToInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 size={16} /> Convert to Invoice
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-1.5 rounded border border-zinc-700 flex items-center gap-2 transition-colors">
              <FileText size={16} /> E-Way Bill
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-1.5 rounded border border-zinc-700 flex items-center gap-2 transition-colors">
              <MessageSquare size={16} /> WhatsApp
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-1.5 rounded border border-zinc-700 flex items-center gap-2 transition-colors">
              <Printer size={16} /> Print
            </button>
            <button 
              onClick={saveCurrentProforma}
              className="bg-[#005f2f] hover:bg-[#007a3d] text-white text-sm px-4 py-1.5 rounded flex items-center gap-2 transition-colors"
            >
              <Save size={16} /> Save Proforma Invoice
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden flex flex-row">
          {/* LEFT COLUMN - FORMS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 custom-scrollbar">
            
            {/* 1. CUSTOMER DETAILS */}
            <div className="bg-[#161618] border border-zinc-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 bg-[#1c1c1f] border-b border-zinc-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="bg-[#005f2f] text-white text-xs w-5 h-5 flex items-center justify-center rounded">1</span>
                  <h3 className="text-sm font-semibold text-white">Customer Details</h3>
                </div>
                <ChevronDown size={18} className="text-gray-500" />
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">GST Number — Auto Verify & Fetch</label>
                  <div className="flex gap-2">
                    <input 
                      placeholder="27AABCD1234E1Z5 - Enter & press Verify"
                      className="flex-1 bg-[#1e1e22] border border-zinc-700 focus:border-zinc-500 rounded px-3 py-2 text-sm outline-none placeholder-zinc-600"
                    />
                    <button className="bg-green-900/20 text-green-500 border border-green-900 px-6 py-2 rounded text-sm hover:bg-green-900/40 transition-colors flex items-center gap-2">
                      <CheckCircle2 size={16} /> Verify
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Customer Name *</label>
                    <div className="relative">
                      <input 
                        placeholder="Search customer..." 
                        className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none"
                      />
                      <Search size={14} className="absolute right-3 top-2.5 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Customer Code</label>
                    <div className="flex">
                      <input 
                        value={current.customerCode}
                        readOnly
                        className="flex-1 bg-[#1e1e22] border border-zinc-700 rounded-l px-3 py-2 text-sm outline-none"
                      />
                      <span className="bg-zinc-800 border-y border-r border-zinc-700 px-3 py-2 text-xs flex items-center rounded-r text-gray-400">Auto</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Mobile</label>
                    <input 
                      value={current.mobile}
                      className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Email</label>
                    <input 
                      value={current.email}
                      className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">DOB</label>
                    <input 
                      type="date"
                      value={current.dob}
                      className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none text-gray-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex justify-between">State <span className="text-[10px] text-green-500 bg-green-900/30 px-1 rounded">CGST+SGST</span></label>
                    <select className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none">
                      <option>{current.state}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">City</label>
                    <input 
                      placeholder="City"
                      value={current.city}
                      className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Category</label>
                    <select className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none">
                      <option>{current.category}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Customer Type</label>
                    <select className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none">
                      <option>{current.customerType}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Ref Source</label>
                    <select className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none">
                      <option>{current.refSource}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Referral Code</label>
                    <input 
                      value={current.referralCode}
                      className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2 text-sm items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 border border-zinc-600 rounded bg-[#1e1e22]"></div>
                    <span className="text-gray-300">New Arrivals</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 border border-zinc-600 rounded bg-[#1e1e22]"></div>
                    <span className="text-gray-300">Dead Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="w-4 h-4 border-none rounded bg-green-600 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-300">WhatsApp Updates</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. INVOICE DETAILS */}
            <div className="bg-[#161618] border border-zinc-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 bg-[#1c1c1f] border-b border-zinc-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="bg-[#005f2f] text-white text-xs w-5 h-5 flex items-center justify-center rounded">2</span>
                  <h3 className="text-sm font-semibold text-white">Invoice Details</h3>
                </div>
                <ChevronDown size={18} className="text-gray-500" />
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Invoice No</label>
                    <input value={current.proformaNo} readOnly className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Invoice Date</label>
                    <input type="date" value={current.proformaDate} className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Due Date</label>
                    <input type="date" className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none text-gray-500" placeholder="dd-mm-yyyy" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Salesperson</label>
                    <select className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none">
                      <option>{current.salesperson}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Billed By</label>
                    <select className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none">
                      <option>{current.billedBy}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Branch</label>
                    <select className="w-full bg-[#1e1e22] border border-zinc-700 rounded px-3 py-2 text-sm outline-none">
                      <option>{current.branch}</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs text-gray-400">Payment Type *</label>
                    <div className="flex gap-2">
                      <button className={`flex-1 py-1.5 px-3 rounded text-sm border ${current.paymentType === 'Advance Payment' ? 'bg-[#005f2f] border-[#005f2f] text-white' : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'}`}>Advance Payment</button>
                      <button className={`flex-1 py-1.5 px-3 rounded text-sm border ${current.paymentType === 'Final Payment' ? 'bg-[#005f2f] border-[#005f2f] text-white' : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'}`}>Final Payment</button>
                      <button className={`flex-1 py-1.5 px-3 rounded text-sm border ${current.paymentType === 'Credit Customer' ? 'bg-[#005f2f] border-[#005f2f] text-white' : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'}`}>Credit Customer</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Order Type</label>
                    <div className="flex gap-2">
                      {['Spot Delivery', 'Booked Order', 'Customised', 'Printing'].map(type => (
                        <button key={type} className={`px-3 py-1.5 rounded text-sm border ${current.orderType === type ? 'bg-[#005f2f] border-[#005f2f] text-white' : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Delivery Method</label>
                    <div className="flex flex-wrap gap-2">
                      {['Self Pickup', 'Self Delivery', 'Porter', 'Transportation', 'Courier'].map(type => (
                        <button key={type} className={`px-3 py-1.5 rounded text-sm border ${current.deliveryMethod === type ? 'bg-[#005f2f] border-[#005f2f] text-white' : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. PRODUCT ENTRY */}
            <div className="bg-[#161618] border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
              <div className="flex justify-between items-center px-4 py-3 bg-[#1c1c1f] border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="bg-[#005f2f] text-white text-xs w-5 h-5 flex items-center justify-center rounded">3</span>
                  <h3 className="text-sm font-semibold text-white">Product Entry - <span className="text-gray-400 font-normal">Taxable Exclusive</span></h3>
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-2 text-gray-500" />
                    <input 
                      placeholder="Scan barcode..." 
                      className="bg-[#1e1e22] border border-zinc-700 rounded pl-8 pr-3 py-1 text-sm outline-none w-48 focus:border-zinc-500"
                    />
                  </div>
                  <button className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1 text-sm rounded transition-colors flex items-center gap-1">
                    <Plus size={14} /> F3 New
                  </button>
                  <button className="bg-[#005f2f] hover:bg-[#007a3d] px-3 py-1 text-sm rounded transition-colors flex items-center gap-1">
                    <Plus size={14} /> Add Row
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto min-h-[200px]">
                <table className="w-full text-xs text-left">
                  <thead className="text-gray-400 border-b border-zinc-800 bg-[#161618]">
                    <tr>
                      <th className="font-medium p-3 w-10">Sr</th>
                      <th className="font-medium p-3">Barcode</th>
                      <th className="font-medium p-3">TM Code</th>
                      <th className="font-medium p-3">Prod Code</th>
                      <th className="font-medium p-3 min-w-[200px]">Product Name</th>
                      <th className="font-medium p-3">HSN</th>
                      <th className="font-medium p-3 w-16">Qty</th>
                      <th className="font-medium p-3 w-16">Unit</th>
                      <th className="font-medium p-3 w-20">MRP</th>
                      <th className="font-medium p-3 w-16">Disc%</th>
                      <th className="font-medium p-3 w-16">GST%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {current.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#1c1c1f]">
                        <td className="p-3 text-gray-500">{index + 1}</td>
                        <td className="p-2"><input className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none" /></td>
                        <td className="p-2"><input className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none" /></td>
                        <td className="p-2"><input className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none" /></td>
                        <td className="p-2">
                          <div className="relative">
                            <input placeholder="Search..." className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none text-gray-400" />
                          </div>
                        </td>
                        <td className="p-2"><input className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none" /></td>
                        <td className="p-2"><input type="number" defaultValue={item.qty} className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none" /></td>
                        <td className="p-2">
                           <select className="w-full bg-transparent outline-none appearance-none">
                             <option>{item.unit}</option>
                           </select>
                        </td>
                        <td className="p-2"><input type="number" placeholder="0" className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none" /></td>
                        <td className="p-2"><input type="number" defaultValue={item.discount} className="w-full bg-transparent border-b border-transparent focus:border-zinc-700 outline-none" /></td>
                        <td className="p-2">
                           <select className="w-full bg-transparent outline-none appearance-none">
                             <option>{item.gstPercent}%</option>
                           </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center gap-4 text-xs text-gray-500 p-3 bg-[#111111] border-t border-zinc-800">
                  <span className="flex items-center gap-1 text-green-500"><Plus size={12}/> Add Row</span>
                  <span>Press <kbd className="bg-zinc-800 px-1 rounded text-gray-300">Enter</kbd> to move to next field</span>
                  <span>Press <kbd className="bg-zinc-800 px-1 rounded text-gray-300">F3</kbd> to create new product</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - INVOICE CALCULATION */}
          <div className="w-[360px] bg-[#161618] border-l border-zinc-800 flex flex-col p-4 overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-semibold text-white mb-4">Invoice Calculation</h3>

            <div className="space-y-3 text-sm flex-1">
              <div className="flex justify-between items-center text-gray-300">
                <span>Subtotal (Before Discount)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-red-400">
                <span>Less: Invoice Discount</span>
                <div className="flex items-center gap-1">
                  <span>- ₹</span>
                  <input type="number" defaultValue="0" className="w-16 bg-[#1e1e22] border border-zinc-700 rounded px-2 py-1 text-right outline-none focus:border-zinc-500 text-white" />
                </div>
              </div>

              <div className="flex justify-between items-center text-red-400">
                <span>Less: Additional Discount</span>
                <div className="flex items-center gap-1">
                  <span>- ₹</span>
                  <input type="number" defaultValue="0" className="w-16 bg-[#1e1e22] border border-zinc-700 rounded px-2 py-1 text-right outline-none focus:border-zinc-500 text-white" />
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-y border-zinc-800 font-medium">
                <span>Net Amount Before GST</span>
                <span>₹{netAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-green-500">
                <span>CGST (2.5%)</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-green-500">
                <span>SGST (2.5%)</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span>Add: Freight</span>
                <div className="flex items-center gap-1">
                  <span>+ ₹</span>
                  <input type="number" defaultValue="0" className="w-16 bg-[#1e1e22] border border-zinc-700 rounded px-2 py-1 text-right outline-none focus:border-zinc-500 text-white" />
                </div>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span>Add: Other Charges</span>
                <div className="flex items-center gap-1">
                  <span>+ ₹</span>
                  <input type="number" defaultValue="0" className="w-16 bg-[#1e1e22] border border-zinc-700 rounded px-2 py-1 text-right outline-none focus:border-zinc-500 text-white" />
                </div>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span>Round Off</span>
                <span className={roundOff > 0 ? "text-green-500" : (roundOff < 0 ? "text-red-400" : "")}>
                  {roundOff > 0 ? "+" : ""}₹{roundOff.toFixed(2)}
                </span>
              </div>

              <div className="pt-4 mt-2 border-t border-zinc-800 flex justify-between items-end">
                <div>
                  <h3 className="font-bold text-white mb-1">Final Invoice Amount</h3>
                  <p className="text-[10px] text-gray-500">incl. GST ₹{(cgst + sgst).toFixed(2)}</p>
                </div>
                <span className="text-3xl font-bold text-green-500">₹{finalAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400">
                  <div 
                    onClick={() => setIsRoundOff(!isRoundOff)}
                    className={`w-4 h-4 rounded flex items-center justify-center ${isRoundOff ? 'bg-green-600' : 'border border-zinc-600 bg-[#1e1e22]'}`}
                  >
                    {isRoundOff && <Check size={12} className="text-white" />}
                  </div>
                  Round Off
                </label>
              </div>
              
              <div className="mt-4 bg-green-900/20 border border-green-900/50 rounded-lg p-3 flex items-center gap-3">
                 <CheckCircle2 size={20} className="text-green-500" />
                 <span className="text-green-500 font-medium text-sm">Marked as Fully Paid</span>
              </div>

              <div className="mt-6">
                <label className="block text-xs text-gray-400 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cash', 'UPI', 'Bank Transfer', 'Cheque'].map(method => (
                    <button 
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 text-sm rounded border ${paymentMethod === method ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-[#1a1a1c] border-zinc-800 text-gray-400 hover:bg-zinc-800'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={saveCurrentProforma}
              className="w-full mt-6 bg-[#005f2f] hover:bg-[#007a3d] text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors"
            >
              <Save size={18} /> Save Proforma Invoice
            </button>
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="h-8 bg-[#0a0a0a] border-t border-zinc-800 flex justify-between items-center px-4 text-[11px] text-gray-400 shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Open Invoices: 4</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> Draft Invoices: 4</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Pending Printing: 5</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Pending Dispatch: 8</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Outstanding Collection: <span className="text-red-400 font-medium">₹2,10,000</span></span>
          </div>
          <div className="flex items-center gap-4 opacity-75">
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">F5</kbd> Save</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">F6</kbd> Print</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">Ctrl+W</kbd> WhatsApp</span>
            <span className="flex gap-1"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">Esc</kbd> Cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
}