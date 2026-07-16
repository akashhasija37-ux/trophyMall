"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { message } from "antd";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import {
  Search,
  CheckCircle2,
  Printer,
  MessageSquare,
  FileText,
  Save,
  Plus,
  ChevronDown,
  RotateCcw,
  X,
} from "lucide-react";

/* ==============================
   TYPES
================================= */

type InvoiceItem = {
  product: string;
  product_id?: number;
  hsn?: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
  discount: number;
  gstPercent: number;
};

type InvoiceTab = {
  id: string;

  customer?: number;
  customerName?: string;
  customerMobile?: string;
  customerCode?: string;

  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;

  paymentStatus: string;
  paymentType: string;
  orderType: string;
  deliveryMethod: string;
  paymentMethod: string;

  salesperson_id?: number;
  assigned_to?: number;

  notes: string;
  items: InvoiceItem[];

  discount: number;
  additionalDiscount: number;
  gst: number;
  freight: number;
  otherCharges: number;
  deposit: number;
  roundOff: number;
};

/* ==============================
   HELPERS
================================= */

const createNewInvoiceTab = (index: number): InvoiceTab => ({
  id: crypto.randomUUID(),

  customer: undefined,
  customerName: "",
  customerMobile: "",
  customerCode: "Auto",

  invoiceNo: `INV-2026-09${30 + index}`,
  invoiceDate: dayjs().format("YYYY-MM-DD"),
  dueDate: dayjs().format("YYYY-MM-DD"),

  paymentStatus: "Pending",
  paymentType: "Final Payment",
  orderType: "Spot Delivery",
  deliveryMethod: "Self Pickup",
  paymentMethod: "Cash",

  salesperson_id: undefined,
  assigned_to: undefined,

  notes: "",
  items: [
    {
      product: "",
      qty: 1,
      unit: "Pcs",
      price: 0,
      total: 0,
      discount: 0,
      gstPercent: 5,
    },
  ],

  discount: 0,
  additionalDiscount: 0,
  gst: 5,
  freight: 0,
  otherCharges: 0,
  deposit: 0,
  roundOff: 0,
});

/* ==============================
   COMPONENT
================================= */

export default function SalesVoucherPage({ refresh }: any) {
  /* ==============================
     MASTER DATA
  ================================= */
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [invoiceType, setInvoiceType] = useState("GST Invoice");
  const [showEwayBill, setShowEwayBill] = useState(false);

  /* ==============================
     MULTI TAB STATE
  ================================= */
  const [invoiceTabs, setInvoiceTabs] = useState<InvoiceTab[]>([
    createNewInvoiceTab(0),
  ]);
  const [activeTab, setActiveTab] = useState<string>("");

  /* ==============================
     INIT ACTIVE TAB
  ================================= */
  useEffect(() => {
    if (!activeTab && invoiceTabs.length) {
      setActiveTab(invoiceTabs[0].id);
    }
  }, [invoiceTabs, activeTab]);

  /* ==============================
     CURRENT TAB
  ================================= */
  const currentInvoice =
    invoiceTabs.find((tab) => tab.id === activeTab) || invoiceTabs[0];

  /* ==============================
     DATA LOADING
  ================================= */
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchEmployees();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ==============================
     UPDATE TAB
  ================================= */
  const updateInvoiceTab = (updates: Partial<InvoiceTab>) => {
    setInvoiceTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              ...updates,
            }
          : tab,
      ),
    );
  };

  /* ==============================
     TAB OPERATIONS
  ================================= */
  const addInvoiceTab = () => {
    const newTab = createNewInvoiceTab(invoiceTabs.length);
    setInvoiceTabs((prev) => [...prev, newTab]);
    setActiveTab(newTab.id);
  };

  const closeInvoiceTab = (tabId: string) => {
    if (invoiceTabs.length === 1) {
      message.warning("At least one invoice tab is required.");
      return;
    }
    const updatedTabs = invoiceTabs.filter((tab) => tab.id !== tabId);
    setInvoiceTabs(updatedTabs);
    if (activeTab === tabId) {
      setActiveTab(updatedTabs[0].id);
    }
  };

  /* ==============================
     CUSTOMER CHANGE
  ================================= */
  const updateCustomer = (customerId: number) => {
    const selectedCustomer = customers.find((c) => c.id === customerId);
    updateInvoiceTab({
      customer: customerId,
      customerName: selectedCustomer?.name || "",
      customerMobile: selectedCustomer?.phone || "",
    });
  };

  /* ==============================
     ITEM UPDATE
  ================================= */
  const updateItem = (index: number, key: keyof InvoiceItem, value: any) => {
    const updatedItems = [...currentInvoice.items];

    updatedItems[index] = {
      ...updatedItems[index],
      [key]: value,
    };

    if (key === "product_id") {
      const selected = products.find((p) => p.id === value);
      if (selected) {
        updatedItems[index].product = selected.name;
        updatedItems[index].price = Number(
          selected.selling_price || selected.price || 0,
        );
        updatedItems[index].discount = Number(selected.discount || 0);
        updatedItems[index].hsn = selected.hsn || "9506";
      }
    }

    const qty = Number(updatedItems[index].qty || 0);
    const price = Number(updatedItems[index].price || 0);
    const rowTotal = qty * price;
    const discountPercent = Number(updatedItems[index].discount || 0);
    const discountAmount = rowTotal * (discountPercent / 100);
    
    updatedItems[index].total = rowTotal - discountAmount;

    updateInvoiceTab({
      items: updatedItems,
    });
  };

  const addItem = () => {
    updateInvoiceTab({
      items: [
        ...currentInvoice.items,
        {
          product: "",
          qty: 1,
          unit: "Pcs",
          price: 0,
          total: 0,
          discount: 0,
          gstPercent: 5,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (currentInvoice.items.length === 1) return;
    const updated = [...currentInvoice.items];
    updated.splice(index, 1);
    updateInvoiceTab({ items: updated });
  };

  /* ==============================
     CALCULATIONS
  ================================= */
  const subtotal = currentInvoice.items.reduce((sum, item) => sum + item.total, 0);
  const totalDiscount = currentInvoice.discount + currentInvoice.additionalDiscount;
  const netAmountBeforeGst = subtotal - totalDiscount;

  const avgGstPercent = currentInvoice.items[0]?.gstPercent || 5; 
  const cgstAmount = (netAmountBeforeGst * (avgGstPercent / 2)) / 100;
  const sgstAmount = (netAmountBeforeGst * (avgGstPercent / 2)) / 100;
  
  const grandTotal = netAmountBeforeGst + cgstAmount + sgstAmount + currentInvoice.freight + currentInvoice.otherCharges;
  
  const calculatedRoundOff = currentInvoice.roundOff !== 0 ? currentInvoice.roundOff : Math.round(grandTotal) - grandTotal;
  const finalPayable = grandTotal + calculatedRoundOff;

  /* ==============================
     SAVE ACTIONS
  ================================= */
  const saveCurrentInvoice = async () => {
    try {
      const payload = {
        customer_id: currentInvoice.customer,
        invoice_date: currentInvoice.invoiceDate,
        due_date: currentInvoice.dueDate,
        payment_status: currentInvoice.paymentStatus,
        salesperson_id: currentInvoice.salesperson_id,
        assigned_to: currentInvoice.assigned_to,
        notes: currentInvoice.notes,
        discount: currentInvoice.discount,
        gst: avgGstPercent,
        deposit: currentInvoice.deposit,
        roundOff: calculatedRoundOff,
        items: currentInvoice.items,
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      message.success("Invoice saved successfully");
      refresh?.();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const saveAllInvoices = async () => {
    try {
      for (const invoice of invoiceTabs) {
        const payload = {
          customer_id: invoice.customer,
          invoice_date: invoice.invoiceDate,
          due_date: invoice.dueDate,
          payment_status: invoice.paymentStatus,
          salesperson_id: invoice.salesperson_id,
          assigned_to: invoice.assigned_to,
          notes: invoice.notes,
          discount: invoice.discount,
          gst: invoice.gst,
          deposit: invoice.deposit,
          roundOff: invoice.roundOff,
          items: invoice.items,
        };
        await fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      message.success(`${invoiceTabs.length} invoices saved`);
      refresh?.();
    } catch (err) {
      message.error("Failed saving invoices");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-300 font-sans">
      <Sidebar />

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pb-12">
          <div className="px-6 py-4 space-y-4">
            
            {/* BREADCRUMBS & HEADER */}
            <div>
              <p className="text-gray-500 text-xs mb-1">
                Billing Management / <span className="text-gray-300">Sales Voucher</span>
              </p>
              <h1 className="text-2xl font-bold text-white">Sales Voucher</h1>
            </div>

            {/* TABS & TOP ACTIONS */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <div className="flex gap-2">
                {invoiceTabs.map((tab, index) => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`px-4 py-1.5 rounded-t-md text-sm flex items-center gap-2 ${
                       activeTab === tab.id 
                       ? "bg-zinc-800 text-green-400 border-b-2 border-green-500" 
                       : "text-gray-400 hover:bg-zinc-900"
                     }`}
                   >
                     <FileText size={14} />
                     Invoice {index + 1}
                     <span 
                       onClick={(e) => { e.stopPropagation(); closeInvoiceTab(tab.id); }}
                       className="w-4 h-4 ml-2 flex items-center justify-center rounded-full hover:bg-red-500/20 hover:text-red-400 text-gray-500 cursor-pointer text-xs"
                     >
                       ×
                     </span>
                   </button>
                ))}
                <button onClick={addInvoiceTab} className="px-4 py-1.5 text-sm text-green-500 hover:bg-zinc-900 rounded-t-md">
                  + New
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={saveAllInvoices} className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2">
                  <Plus size={16} /> Save All
                </button>
                <div className="flex text-xs bg-zinc-900 rounded border border-zinc-700">
                  <span className="px-2 py-1 border-r border-zinc-700"><span className="text-green-500 font-bold">{invoiceTabs.length}</span> open</span>
                  <span className="px-2 py-1 text-yellow-500"><span className="font-bold">0</span> draft</span>
                </div>
              </div>
            </div>

            {/* DRAFT NOTIFICATION */}
            <div className="bg-blue-900/20 border border-blue-900/50 text-blue-400 text-sm px-4 py-2 rounded flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RotateCcw size={14} />
                Draft restored from previous session
              </div>
              <button className="text-gray-400 hover:text-white">Clear Draft</button>
            </div>

            {/* ACTION BAR */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">
                  Sales Voucher <span className="text-gray-500 text-sm font-normal">{currentInvoice.invoiceNo}</span>
                </h2>
                <div className="flex bg-zinc-900 rounded p-1 border border-zinc-800">
                  <button
                    className={`px-3 py-1 text-xs rounded ${invoiceType === "GST Invoice" ? "bg-green-900/30 text-green-400" : "text-gray-400"}`}
                    onClick={() => setInvoiceType("GST Invoice")}
                  >
                    ● GST Invoice
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded ${invoiceType === "Non-GST Invoice" ? "bg-zinc-800 text-white" : "text-gray-400"}`}
                    onClick={() => setInvoiceType("Non-GST Invoice")}
                  >
                    ○ Non-GST Invoice
                  </button>
                </div>
                <select className="bg-zinc-900 border border-zinc-800 text-xs px-2 py-1.5 rounded outline-none text-white">
                  <option>Taxable Exclusive</option>
                </select>
                <span className="text-xs text-green-500 border border-green-500/30 bg-green-500/10 px-2 py-1 rounded">CGST + SGST</span>
              </div>
              
              <div className="flex items-center gap-2" >
                {/* E-Way Bill Trigger */}
                <button 
                  onClick={() => setShowEwayBill(!showEwayBill)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded border ${showEwayBill ? 'bg-zinc-700 text-white border-zinc-500' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white'}`}
                style={{width:'150px',marginLeft:'3px'}}
                >
                  <FileText size={14} /> E-Way Bill
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-white">
                  <MessageSquare size={14} /> WhatsApp
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-white">
                  <Printer size={14} /> Print
                </button>
                <button onClick={saveCurrentInvoice} className="flex items-center gap-2 px-4 py-1.5 text-sm bg-green-700 hover:bg-green-600 rounded text-white font-medium">
                  <Save size={14} /> Save Sales Voucher
                </button>
              </div>
            </div>

            {/* E-WAY BILL SLIDE-DOWN PANEL */}
            {showEwayBill && (
              <div className="bg-[#121212] border border-zinc-800 rounded-lg p-5 relative animate-in fade-in slide-in-from-top-4">
                <button 
                  onClick={() => setShowEwayBill(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-6">
                  <FileText size={16} className="text-[#ff5722]" />
                  <h3 className="text-white font-semibold text-sm">Generate E-Way Bill</h3>
                  <span className="text-gray-500 text-xs ml-1">Auto-filled from invoice details</span>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-5">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Invoice No</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={currentInvoice.invoiceNo} 
                      className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-gray-400 cursor-not-allowed outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Invoice Value</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={`₹${finalPayable.toFixed(2)}`} 
                      className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-gray-400 cursor-not-allowed outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Transporter ID</label>
                    <input 
                      type="text" 
                      placeholder="12XXXXXXXXXX" 
                      className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-[#ff5722] text-white transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Vehicle No</label>
                    <input 
                      type="text" 
                      placeholder="MH12AB1234" 
                      className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-[#ff5722] text-white transition-colors" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 items-end">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Distance (km)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-[#ff5722] text-white transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">Transport Mode</label>
                    <select className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-[#ff5722] text-white transition-colors appearance-none">
                      <option>Road</option>
                      <option>Rail</option>
                      <option>Air</option>
                      <option>Ship</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <button className="w-full bg-[#ff5722] hover:bg-[#e64a19] text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                      <FileText size={16} /> Generate E-Way Bill
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* LEFT COLUMN (Forms & Table) */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* SECTION 1: CUSTOMER DETAILS */}
                <div className="bg-[#121212] border border-zinc-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-green-500 font-semibold text-sm flex items-center gap-2">
                      <span className="bg-green-900/50 text-green-400 w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                      Customer Details
                    </h3>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">GST Number — Auto Verify & Fetch</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="27AABCD1234E1Z5 — Enter & press Verify" className="flex-1 bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 text-white" />
                        <button className="bg-green-900/20 text-green-500 border border-green-900 px-4 py-1.5 rounded text-sm flex items-center gap-1">
                          <CheckCircle2 size={14} /> Verify
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Customer Name *</label>
                        <div className="relative">
                          <select 
                            value={currentInvoice.customer || ""} 
                            onChange={(e) => updateCustomer(Number(e.target.value))}
                            className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 text-white appearance-none"
                          >
                            <option value="" disabled>Select customer...</option>
                            {customers.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <Search size={14} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Customer Code</label>
                        <div className="flex">
                          <input type="text" value={currentInvoice.customerCode} onChange={(e) => updateInvoiceTab({ customerCode: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 border-r-0 rounded-l px-3 py-1.5 text-sm outline-none focus:border-green-500 text-white" />
                          <span className="bg-zinc-800 border border-zinc-700 rounded-r px-3 py-1.5 text-sm text-gray-400">Auto</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Mobile</label>
                        <input type="text" value={currentInvoice.customerMobile} onChange={(e) => updateInvoiceTab({ customerMobile: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Category</label>
                          <select className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white">
                            <option>Cricket</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Customer Type</label>
                          <select className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white">
                            <option>First Time</option>
                          </select>
                        </div>
                      </div>
                      <div>
                         <label className="text-xs text-gray-400 block mb-1">Referral Code</label>
                         <input type="text" placeholder="REF-XXXX" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: INVOICE DETAILS */}
                <div className="bg-[#121212] border border-zinc-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-green-500 font-semibold text-sm flex items-center gap-2">
                      <span className="bg-green-900/50 text-green-400 w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                      Invoice Details
                    </h3>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Invoice No</label>
                        <input type="text" value={currentInvoice.invoiceNo} onChange={(e) => updateInvoiceTab({ invoiceNo: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Invoice Date</label>
                        <input type="date" value={currentInvoice.invoiceDate} onChange={(e) => updateInvoiceTab({ invoiceDate: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Due Date</label>
                        <input type="date" value={currentInvoice.dueDate} onChange={(e) => updateInvoiceTab({ dueDate: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Salesperson</label>
                        <select 
                          value={currentInvoice.salesperson_id || ""} 
                          onChange={(e) => updateInvoiceTab({ salesperson_id: Number(e.target.value) })}
                          className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white"
                        >
                          <option value="" disabled>Select...</option>
                          {employees.map((e) => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Payment Type *</label>
                          <div className="flex gap-2">
                            {["Advance Payment", "Final Payment", "Credit Customer"].map((type) => (
                              <button
                                key={type}
                                onClick={() => updateInvoiceTab({ paymentType: type })}
                                className={`flex-1 text-xs py-1.5 rounded border ${currentInvoice.paymentType === type ? "bg-green-700 text-white border-green-600" : "bg-transparent border-zinc-700 text-gray-400 hover:text-white"}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Order Type</label>
                          <div className="flex gap-2">
                            {["Spot Delivery", "Booked Order", "Customised", "Printing"].map((type) => (
                              <button
                                key={type}
                                onClick={() => updateInvoiceTab({ orderType: type })}
                                className={`flex-1 text-xs py-1.5 rounded border ${currentInvoice.orderType === type ? "bg-green-900/30 text-green-400 border-green-800" : "bg-transparent border-zinc-700 text-gray-400 hover:text-white"}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Delivery Method</label>
                        <div className="flex flex-wrap gap-2">
                          {["Self Pickup", "Self Delivery", "Porter", "Transportation", "Courier"].map((type) => (
                            <button
                              key={type}
                              onClick={() => updateInvoiceTab({ deliveryMethod: type })}
                              className={`px-3 text-xs py-1.5 rounded border ${currentInvoice.deliveryMethod === type ? "bg-green-900/30 text-green-400 border-green-800" : "bg-transparent border-zinc-700 text-gray-400 hover:text-white"}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PRODUCT ENTRY */}
                <div className="bg-[#121212] border border-zinc-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-green-500 font-semibold text-sm flex items-center gap-2">
                      <span className="bg-green-900/50 text-green-400 w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
                      Product Entry <span className="text-xs font-normal text-gray-500 ml-2">- Taxable Exclusive</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <input type="text" placeholder="||| Scan barcode..." className="bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1 text-xs outline-none w-48 text-white" />
                      <button onClick={addItem} className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded text-xs text-white hover:bg-zinc-700">+ F3 New</button>
                      <button onClick={addItem} className="bg-green-900/30 text-green-400 border border-green-800 px-3 py-1 rounded text-xs hover:bg-green-900/50">+ Add Row</button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="text-gray-400 border-b border-zinc-800">
                        <tr>
                          <th className="pb-2 w-8 font-normal">Sr</th>
                          <th className="pb-2 px-2 font-normal">Barcode</th>
                          <th className="pb-2 px-2 font-normal w-48">Product Name</th>
                          <th className="pb-2 px-2 font-normal">HSN</th>
                          <th className="pb-2 px-2 font-normal w-16">Qty</th>
                          <th className="pb-2 px-2 font-normal">Unit</th>
                          <th className="pb-2 px-2 font-normal w-20">MRP</th>
                          <th className="pb-2 px-2 font-normal w-16">Disc%</th>
                          <th className="pb-2 px-2 font-normal w-16">GST%</th>
                          <th className="pb-2 px-2 font-normal">GST Amt</th>
                          <th className="pb-2 px-2 text-right font-normal">Net Amt</th>
                          <th className="pb-2 pl-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.items.map((item, index) => (
                           <tr key={index} className="border-b border-zinc-800/50">
                             <td className="py-2 text-gray-500">{index + 1}</td>
                             <td className="py-2 px-2"><input type="text" className="w-full bg-transparent outline-none border-b border-zinc-700 focus:border-green-500 text-white" /></td>
                             <td className="py-2 px-2">
                               <select 
                                 value={item.product_id || ""}
                                 onChange={(e) => updateItem(index, "product_id", Number(e.target.value))}
                                 className="w-full bg-transparent outline-none border-b border-zinc-700 focus:border-green-500 text-white"
                               >
                                 <option value="" disabled>Search...</option>
                                 {products.map(p => <option key={p.id} value={p.id} className="bg-zinc-900">{p.name}</option>)}
                               </select>
                             </td>
                             <td className="py-2 px-2"><input type="text" value={item.hsn || ""} onChange={(e) => updateItem(index, "hsn", e.target.value)} className="w-full bg-transparent outline-none border-b border-zinc-700 focus:border-green-500 text-white" /></td>
                             <td className="py-2 px-2"><input type="number" min="1" value={item.qty} onChange={(e) => updateItem(index, "qty", e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded px-1 outline-none text-center text-white" /></td>
                             <td className="py-2 px-2">
                               <select value={item.unit} onChange={(e) => updateItem(index, "unit", e.target.value)} className="bg-transparent outline-none text-gray-400">
                                 <option value="Pcs" className="bg-zinc-900">Pcs</option>
                                 <option value="Kg" className="bg-zinc-900">Kg</option>
                               </select>
                             </td>
                             <td className="py-2 px-2"><input type="number" value={item.price} onChange={(e) => updateItem(index, "price", e.target.value)} className="w-full bg-transparent outline-none border-b border-zinc-700 focus:border-green-500 text-right text-white" /></td>
                             <td className="py-2 px-2"><input type="number" value={item.discount} onChange={(e) => updateItem(index, "discount", e.target.value)} className="w-full bg-transparent outline-none border-b border-zinc-700 focus:border-green-500 text-right text-white" /></td>
                             <td className="py-2 px-2">
                               <select value={item.gstPercent} onChange={(e) => updateItem(index, "gstPercent", Number(e.target.value))} className="bg-transparent outline-none text-gray-400">
                                 <option value={5} className="bg-zinc-900">5%</option>
                                 <option value={12} className="bg-zinc-900">12%</option>
                                 <option value={18} className="bg-zinc-900">18%</option>
                               </select>
                             </td>
                             <td className="py-2 px-2 text-gray-400 text-center">{((item.qty * item.price * item.gstPercent) / 100).toFixed(2)}</td>
                             <td className="py-2 px-2 text-right text-white font-medium">₹{item.total.toFixed(2)}</td>
                             <td className="py-2 pl-2">
                               <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-400 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center border border-red-500/50 hover:border-red-400">×</button>
                             </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex gap-4 text-xs text-gray-500">
                    <span onClick={addItem} className="text-green-500 cursor-pointer">+ Add Row</span>
                    <span>Press <kbd className="bg-zinc-800 px-1 rounded text-white border border-zinc-700">Enter</kbd> to move to next field</span>
                    <span><kbd className="bg-zinc-800 px-1 rounded text-white border border-zinc-700">F3</kbd> to create new product</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (Invoice Calculation) */}
              <div className="bg-[#121212] border border-zinc-800 rounded-lg p-5 flex flex-col">
                <h3 className="text-white font-semibold text-sm mb-4">Invoice Calculation</h3>
                
                <div className="space-y-3 text-sm flex-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal (Before Discount)</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-red-400">
                    <span>Less: Invoice Discount</span>
                    <div className="flex items-center gap-2">
                      <span>-₹</span>
                      <input type="number" value={currentInvoice.discount} onChange={(e) => updateInvoiceTab({ discount: Number(e.target.value) || 0 })} className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-right outline-none text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-red-400">
                    <span>Less: Additional Discount</span>
                    <div className="flex items-center gap-2">
                      <span>-₹</span>
                      <input type="number" value={currentInvoice.additionalDiscount} onChange={(e) => updateInvoiceTab({ additionalDiscount: Number(e.target.value) || 0 })} className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-right outline-none text-white" />
                    </div>
                  </div>

                  <div className="flex justify-between font-semibold border-y border-zinc-800 py-3 mt-2">
                    <span className="text-white">Net Amount Before GST</span>
                    <span className="text-white">₹{netAmountBeforeGst.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-green-500">
                    <span>CGST ({(avgGstPercent / 2).toFixed(1)}%)</span>
                    <span>₹{cgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-500">
                    <span>SGST ({(avgGstPercent / 2).toFixed(1)}%)</span>
                    <span>₹{sgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-400 mt-2">
                    <span>Add: Freight</span>
                    <div className="flex items-center gap-2">
                      <span>+₹</span>
                      <input type="number" value={currentInvoice.freight} onChange={(e) => updateInvoiceTab({ freight: Number(e.target.value) || 0 })} className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-right outline-none text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Add: Other Charges</span>
                    <div className="flex items-center gap-2">
                      <span>+₹</span>
                      <input type="number" value={currentInvoice.otherCharges} onChange={(e) => updateInvoiceTab({ otherCharges: Number(e.target.value) || 0 })} className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-right outline-none text-white" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-green-500">
                    <span>Round Off</span>
                    <div className="flex items-center gap-2">
                      <span>±₹</span>
                      <input type="number" step="0.01" value={calculatedRoundOff.toFixed(2)} onChange={(e) => updateInvoiceTab({ roundOff: Number(e.target.value) })} className="w-20 bg-zinc-900 border border-zinc-700 rounded px-2 py-0.5 text-right outline-none text-white" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-zinc-800 pt-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-white font-semibold">Final Invoice Amount</span>
                    <span className="text-3xl text-green-500 font-bold">₹{finalPayable.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">incl. GST ₹{(cgstAmount + sgstAmount).toFixed(2)}</p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-white">
                    <CheckCircle2 size={16} className="text-green-500" /> Round Off
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-800 rounded px-4 py-2 text-green-400 flex items-center justify-center gap-2 mb-6">
                    <CheckCircle2 size={16} /> Marked as Fully Paid
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-gray-400 block mb-2">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Cash", "UPI", "Bank Transfer", "Cheque"].map((method) => (
                        <button
                          key={method}
                          onClick={() => updateInvoiceTab({ paymentMethod: method })}
                          className={`py-1.5 text-xs rounded border ${currentInvoice.paymentMethod === method ? "bg-zinc-700 text-white border-zinc-600" : "bg-zinc-900 text-gray-400 border-zinc-800 hover:bg-zinc-800"}`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={saveCurrentInvoice} className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <Save size={18} /> Save Sales Voucher
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="bg-black border-t border-zinc-800 px-4 py-1.5 text-[11px] flex justify-between items-center text-gray-500 shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span> Open Invoices: {invoiceTabs.length}</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Draft Invoices: 1</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Pending Printing: 5</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Pending Dispatch: 8</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Outstanding Collection: <span className="text-red-400">₹2,10,000</span></span>
          </div>
          <div className="flex gap-3">
            <span className="cursor-pointer hover:text-white" onClick={saveCurrentInvoice}><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-gray-400">F5</kbd> Save</span>
            <span className="cursor-pointer hover:text-white"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-gray-400">F6</kbd> Print</span>
            <span className="cursor-pointer hover:text-white"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-gray-400">Ctrl+W</kbd> WhatsApp</span>
            <span className="cursor-pointer hover:text-white"><kbd className="bg-zinc-800 px-1 rounded border border-zinc-700 text-gray-400">Esc</kbd> Cancel</span>
          </div>
        </div>

      </div>
    </div>
  );
}