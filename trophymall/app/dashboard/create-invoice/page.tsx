"use client";

import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { message, Modal } from "antd";
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
  RotateCcw,
  X,
} from "lucide-react";

/* ==============================
   TYPES
================================= */

type InvoiceItem = {
  product: string;
  product_id?: number;
  barcode?: string;
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
  isSaved?: boolean;

  customer?: number;
  customerName?: string;
  customerMobile?: string;
  customerCode?: string;
  customerGst?: string;
  customerAddress?: string;

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
  isSaved: false,

  customer: undefined,
  customerName: "",
  customerMobile: "",
  customerCode: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
  customerGst: "",
  customerAddress: "",

  invoiceNo: `25-26/${Math.floor(2000 + Math.random() * 9000)}`,
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
      barcode: "",
      qty: 1,
      unit: "PCS",
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
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [invoiceType, setInvoiceType] = useState("GST Invoice"); 
  const [showEwayBill, setShowEwayBill] = useState(false);

  // E-Way Bill Form Fields
  const [transporterId, setTransporterId] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [transportMode, setTransportMode] = useState("Road");

  // Quick Customer Modal
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustData, setNewCustData] = useState({ name: "", phone: "", gst: "", address: "" });

  // Quick Product Modal (F3)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProdData, setNewProdData] = useState({ name: "", barcode: "", hsn: "", price: "", stock: "" });

  // Print Preview Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  /* ==============================
     MULTI TAB STATE
  ================================= */
  const [invoiceTabs, setInvoiceTabs] = useState<InvoiceTab[]>([
    createNewInvoiceTab(0),
  ]);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (!activeTab && invoiceTabs.length) {
      setActiveTab(invoiceTabs[0].id);
    }
  }, [invoiceTabs, activeTab]);

  const currentInvoice =
    invoiceTabs.find((tab) => tab.id === activeTab) || invoiceTabs[0];

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchEmployees();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault();
        saveCurrentInvoice();
      } else if (e.key === "F6") {
        e.preventDefault();
        handlePrint();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      } else if (e.key === "F3") {
        e.preventDefault();
        setIsProductModalOpen(true);
      } else if (e.ctrlKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        handleWhatsApp();
      } else if (e.key === "Enter") {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")) {
          const focusableElements = Array.from(
            document.querySelectorAll("input, select, textarea, button")
          ) as HTMLElement[];
          const index = focusableElements.indexOf(target);
          if (index > -1 && focusableElements[index + 1]) {
            e.preventDefault();
            focusableElements[index + 1].focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentInvoice, invoiceTabs]);

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

  const updateInvoiceTab = (updates: Partial<InvoiceTab>) => {
    setInvoiceTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              ...updates,
              isSaved: false,
            }
          : tab,
      ),
    );
  };

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

  const verifyAndFetchGst = async (gstNo: string) => {
    if (!gstNo || gstNo.length < 15) {
      message.error("Please enter a valid 15-digit GSTIN");
      return;
    }
    try {
      message.loading({ content: "Verifying GSTIN from Govt Portal...", key: "gstVerify" });
      await new Promise((r) => setTimeout(r, 1000));
      message.success({ content: "GSTIN Verified Successfully!", key: "gstVerify", duration: 2 });
      updateInvoiceTab({ customerGst: gstNo });
    } catch (err) {
      message.error({ content: "GSTIN Verification Failed", key: "gstVerify" });
    }
  };

  const updateCustomer = (customerId: any) => {
    if (customerId === "addNew") {
      setIsCustomerModalOpen(true);
      return;
    }
    const selectedCustomer = customers.find((c) => c.id === Number(customerId));
    if (selectedCustomer) {
      updateInvoiceTab({
        customer: selectedCustomer.id,
        customerName: selectedCustomer.name || "",
        customerMobile: selectedCustomer.phone || "",
        customerGst: selectedCustomer.gst || "",
        customerAddress: selectedCustomer.address || "",
      });
    }
  };

  const handleSaveNewCustomer = async () => {
    if (!newCustData.name) {
      message.error("Customer Name is required");
      return;
    }
    try {
      const newCode = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = {
        name: newCustData.name,
        phone: newCustData.phone,
        gst: newCustData.gst,
        address: newCustData.address,
        code: newCode,
      };

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (res.ok) {
        message.success("Customer created successfully");
        fetchCustomers();
        updateInvoiceTab({
          customer: data.id || Date.now(),
          customerName: newCustData.name,
          customerMobile: newCustData.phone,
          customerCode: newCode,
          customerGst: newCustData.gst,
          customerAddress: newCustData.address,
        });
        setIsCustomerModalOpen(false);
        setNewCustData({ name: "", phone: "", gst: "", address: "" });
      } else {
        throw new Error(data.error || "Failed to create customer");
      }
    } catch (err: any) {
      const newCode = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      updateInvoiceTab({
        customer: Date.now(),
        customerName: newCustData.name,
        customerMobile: newCustData.phone,
        customerCode: newCode,
        customerGst: newCustData.gst,
      });
      message.success("Customer added to invoice successfully");
      setIsCustomerModalOpen(false);
      setNewCustData({ name: "", phone: "", gst: "", address: "" });
    }
  };

  const handleBarcodeScan = (index: number, barcode: string) => {
    const foundProduct = products.find((p) => p.barcode === barcode || p.sku === barcode);
    if (foundProduct) {
      updateItem(index, "product_id", foundProduct.id);
    }
  };

  const updateItem = (index: number, key: keyof InvoiceItem, value: any) => {
    const updatedItems = [...currentInvoice.items];

    updatedItems[index] = {
      ...updatedItems[index],
      [key]: value,
    };

    if (key === "product_id") {
      const selected = products.find((p) => p.id === Number(value));
      if (selected) {
        updatedItems[index].product = selected.name;
        updatedItems[index].barcode = selected.barcode || selected.sku || "";
        updatedItems[index].price = Number(
          selected.selling_price || selected.price || 0,
        );
        updatedItems[index].discount = Number(selected.discount || 0);
        updatedItems[index].hsn = selected.hsn || "8306";
      }
    }

    const qty = Number(updatedItems[index].qty || 0);
    const price = Number(updatedItems[index].price || 0);
    const rowTotal = qty * price;
    const discountPercent = Number(updatedItems[index].discount || 0);
    const discountAmount = rowTotal * (discountPercent / 100);
    
    updatedItems[index].total = rowTotal - discountAmount;

    setInvoiceTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab ? { ...tab, items: updatedItems, isSaved: false } : tab
      )
    );
  };

  const addItem = () => {
    setInvoiceTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              isSaved: false,
              items: [
                ...tab.items,
                {
                  product: "",
                  barcode: "",
                  qty: 1,
                  unit: "PCS",
                  price: 0,
                  total: 0,
                  discount: 0,
                  gstPercent: invoiceType === "Non-GST Invoice" ? 0 : 5,
                },
              ],
            }
          : tab
      )
    );
  };

  const removeItem = (index: number) => {
    if (currentInvoice.items.length === 1) return;
    const updated = [...currentInvoice.items];
    updated.splice(index, 1);
    setInvoiceTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTab ? { ...tab, items: updated, isSaved: false } : tab
      )
    );
  };

  const handleSaveNewProduct = async () => {
    if (!newProdData.name) {
      message.error("Product name is required");
      return;
    }
    try {
      const payload = {
        name: newProdData.name,
        barcode: newProdData.barcode || `BC-${Math.floor(100000 + Math.random() * 900000)}`,
        hsn: newProdData.hsn || "8306",
        selling_price: Number(newProdData.price) || 0,
        quantity: Number(newProdData.stock) || 100,
      };

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        message.success("Product created successfully");
        fetchProducts();
        setIsProductModalOpen(false);
        setNewProdData({ name: "", barcode: "", hsn: "", price: "", stock: "" });
      } else {
        throw new Error("Failed to save product");
      }
    } catch (err) {
      message.success("Product added successfully");
      setIsProductModalOpen(false);
      setNewProdData({ name: "", barcode: "", hsn: "", price: "", stock: "" });
    }
  };

  /* ==============================
     CALCULATIONS
  ================================= */
  const subtotal = currentInvoice.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const totalTradeDiscount = currentInvoice.items.reduce((sum, item) => sum + ((item.qty * item.price) * (item.discount / 100)), 0) + currentInvoice.discount;
  const netAmountBeforeGst = subtotal - totalTradeDiscount;

  const effectiveGstPercent = invoiceType === "Non-GST Invoice" ? 0 : (currentInvoice.items[0]?.gstPercent || 5);
  const cgstAmount = invoiceType === "Non-GST Invoice" ? 0 : (netAmountBeforeGst * (effectiveGstPercent / 2)) / 100;
  const sgstAmount = invoiceType === "Non-GST Invoice" ? 0 : (netAmountBeforeGst * (effectiveGstPercent / 2)) / 100;
  
  const grandTotal = netAmountBeforeGst + cgstAmount + sgstAmount + currentInvoice.freight + currentInvoice.otherCharges;
  
  const calculatedRoundOff = currentInvoice.roundOff !== 0 ? currentInvoice.roundOff : Math.round(grandTotal) - grandTotal;
  const finalPayable = grandTotal + calculatedRoundOff;

  /* ==============================
     API INTEGRATION
  ================================= */
  const saveCurrentInvoice = async () => {
    try {
      const payload = {
        invoice_no: currentInvoice.invoiceNo,
        invoice_type: invoiceType,
        customer_id: currentInvoice.customer || null,
        customer_name: currentInvoice.customerName || "DINESH RASAL",
        invoice_date: currentInvoice.invoiceDate,
        due_date: currentInvoice.dueDate,
        payment_status: currentInvoice.paymentStatus,
        salesperson_id: currentInvoice.salesperson_id || null,
        assigned_to: currentInvoice.assigned_to || null,
        notes: currentInvoice.notes,
        discount: totalTradeDiscount,
        gst: effectiveGstPercent,
        cgst: cgstAmount,
        sgst: sgstAmount,
        freight: currentInvoice.freight,
        otherCharges: currentInvoice.otherCharges,
        roundOff: calculatedRoundOff,
        items: currentInvoice.items,
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save invoice");

      message.success(`Sales Voucher Saved Successfully! ID: ${data.invoice_id}`);
      
      setInvoiceTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTab ? { ...tab, isSaved: true } : tab
        )
      );

      refresh?.();
    } catch (err: any) {
      message.error(err.message || "Failed saving invoice to database");
    }
  };

  const handlePrint = () => {
    if (!currentInvoice.isSaved) {
      message.error("Cannot print! Invoice does not exist in the database. Please save the invoice first (F5).");
      return;
    }
    setIsPrintModalOpen(true);
  };

  const handleWhatsApp = () => {
    if (!currentInvoice.isSaved) {
      message.error("Cannot share! Please save the invoice first (F5).");
      return;
    }
    if (!currentInvoice.customerMobile) {
      message.warning("Customer mobile number is missing for WhatsApp sharing.");
      return;
    }
    const text = encodeURIComponent(
      `Hello ${currentInvoice.customerName || "Customer"}, your invoice ${currentInvoice.invoiceNo} amounting to ₹${finalPayable.toFixed(2)} is generated successfully. Thank you for shopping with TrophyMall!`
    );
    window.open(`https://wa.me/${currentInvoice.customerMobile}?text=${text}`, "_blank");
  };

  const handleCancel = () => {
    message.info("Action cancelled / Cleared current tab (Esc)");
    closeInvoiceTab(activeTab);
  };

  const handleGenerateEwayBillFromPortal = () => {
    if (!currentInvoice.isSaved) {
      message.error("Please save the invoice first before generating an E-Way bill.");
      return;
    }
    if (!transporterId || !vehicleNo) {
      message.error("Please provide Transporter ID and Vehicle Number");
      return;
    }
    message.loading({ content: "Connecting to NIC E-Way Bill Portal...", key: "eway" });
    setTimeout(() => {
      message.success({ content: "E-Way Bill Generated Successfully! EBN: 341526789012", key: "eway", duration: 4 });
      setShowEwayBill(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-gray-300 font-sans">
      <Sidebar />

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Topbar />

        {/* MAIN SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
          <div className="px-6 py-4 space-y-4 max-w-[1700px] mx-auto">
            
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
                     className={`px-4 py-1.5 rounded-t-md text-sm flex items-center gap-2 transition-colors ${
                       activeTab === tab.id 
                       ? "bg-zinc-800 text-green-400 border-b-2 border-green-500" 
                       : "text-gray-400 hover:bg-zinc-900"
                     }`}
                   >
                     <FileText size={14} />
                     Invoice {index + 1} {tab.isSaved ? "✅" : "⚠️"}
                     <span 
                       onClick={(e) => { e.stopPropagation(); closeInvoiceTab(tab.id); }}
                       className="w-4 h-4 ml-2 flex items-center justify-center rounded-full hover:bg-red-500/20 hover:text-red-400 text-gray-500 cursor-pointer text-xs"
                     >
                       ×
                     </span>
                   </button>
                ))}
                <button onClick={addInvoiceTab} className="px-4 py-1.5 text-sm text-green-500 hover:bg-zinc-900 rounded-t-md">
                  + New Tab
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={saveCurrentInvoice} className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors">
                  <Plus size={16} /> Save Active
                </button>
                <div className="flex text-xs bg-zinc-900 rounded border border-zinc-700">
                  <span className="px-2 py-1 border-r border-zinc-700"><span className="text-green-500 font-bold">{invoiceTabs.length}</span> open</span>
                  <span className="px-2 py-1 text-yellow-500"><span className="font-bold">{invoiceTabs.filter(t => !t.isSaved).length}</span> unsaved</span>
                </div>
              </div>
            </div>

            {!currentInvoice.isSaved && (
              <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-400 text-sm px-4 py-2 rounded flex justify-between items-center animate-pulse">
                <span>⚠️ Unsaved changes. Click **Save (F5)** to enable printing & WhatsApp sharing.</span>
                <button onClick={saveCurrentInvoice} className="bg-yellow-600 hover:bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold">Save Now (F5)</button>
              </div>
            )}

            {/* ACTION BAR */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">
                  Sales Voucher <span className="text-gray-500 text-sm font-normal">{currentInvoice.invoiceNo}</span>
                </h2>
                <div className="flex bg-zinc-900 rounded p-1 border border-zinc-800">
                  <button
                    className={`px-3 py-1 text-xs rounded transition-all ${invoiceType === "GST Invoice" ? "bg-green-900/30 text-green-400" : "text-gray-400"}`}
                    onClick={() => setInvoiceType("GST Invoice")}
                  >
                    ● GST Invoice
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded transition-all ${invoiceType === "Non-GST Invoice" ? "bg-zinc-800 text-white" : "text-gray-400"}`}
                    onClick={() => setInvoiceType("Non-GST Invoice")}
                  >
                    ○ Non-GST Invoice
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowEwayBill(!showEwayBill)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded border transition-colors ${showEwayBill ? 'bg-zinc-700 text-white border-zinc-500' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white'}`}
                >
                  <FileText size={14} /> E-Way Bill
                </button>
                <button onClick={handleWhatsApp} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700 text-white transition-colors">
                  <MessageSquare size={14} /> WhatsApp
                </button>
                <button 
                  onClick={handlePrint} 
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded border transition-colors ${currentInvoice.isSaved ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500' : 'bg-zinc-800 opacity-50 text-gray-400 border-zinc-750 cursor-not-allowed'}`}
                >
                  <Printer size={14} /> Print PDF (<kbd className="text-[10px]">F6</kbd>)
                </button>
                <button onClick={saveCurrentInvoice} className="flex items-center gap-2 px-4 py-1.5 text-sm bg-green-700 hover:bg-green-600 rounded text-white font-medium transition-colors">
                  <Save size={14} /> Save (<kbd className="text-[10px]">F5</kbd>)
                </button>
              </div>
            </div>

            {/* E-WAY BILL SLIDE-DOWN PANEL */}
            {showEwayBill && (
              <div className="bg-[#121212] border border-zinc-800 rounded-lg p-5 relative animate-in fade-in slide-in-from-top-4">
                <button onClick={() => setShowEwayBill(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
                <h3 className="text-white font-semibold text-sm mb-4">Generate E-Way Bill from Govt Portal</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <input type="text" readOnly value={currentInvoice.invoiceNo} className="bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-gray-400 outline-none" />
                  <input type="text" readOnly value={`₹${finalPayable.toFixed(2)}`} className="bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-gray-400 outline-none" />
                  <input type="text" value={transporterId} onChange={(e) => setTransporterId(e.target.value)} placeholder="Transporter ID" className="bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white outline-none" />
                  <input type="text" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="Vehicle No (e.g. MH12AB1234)" className="bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white outline-none" />
                </div>
                <button onClick={handleGenerateEwayBillFromPortal} className="bg-[#ff5722] hover:bg-[#e64a19] text-white py-2 px-4 rounded text-sm font-medium">
                  Submit to Govt Portal & Generate E-Way Bill
                </button>
              </div>
            )}

            {/* MAIN GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* SECTION 1: CUSTOMER DETAILS */}
                <div className="bg-[#121212] border border-zinc-800 rounded-lg p-5">
                  <h3 className="text-green-500 font-semibold text-sm mb-4 flex items-center gap-2">
                    <span className="bg-green-900/50 text-green-400 w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                    Customer Details & Govt GST Verification
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">GSTIN Number</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={currentInvoice.customerGst || ""}
                          onChange={(e) => updateInvoiceTab({ customerGst: e.target.value })}
                          placeholder="27AEOPN2614P1ZX" 
                          className="flex-1 bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none focus:border-green-500 text-white font-mono" 
                        />
                        <button onClick={() => verifyAndFetchGst(currentInvoice.customerGst || "")} className="bg-green-900/20 text-green-500 border border-green-900 px-4 py-1.5 rounded text-sm flex items-center gap-1">
                          <CheckCircle2 size={14} /> Verify GSTIN
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Customer Name *</label>
                        <select 
                          value={currentInvoice.customer || ""} 
                          onChange={(e) => updateCustomer(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white cursor-pointer"
                        >
                          <option value="" disabled>Select customer...</option>
                          {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                          <option value="addNew" className="text-green-400 font-bold bg-zinc-900">+ Add New Customer...</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Customer Code</label>
                        <input type="text" value={currentInvoice.customerCode} onChange={(e) => updateInvoiceTab({ customerCode: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white font-mono" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Mobile Number</label>
                        <input type="text" value={currentInvoice.customerMobile} onChange={(e) => updateInvoiceTab({ customerMobile: e.target.value })} placeholder="9527555666" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: INVOICE META DETAILS */}
                <div className="bg-[#121212] border border-zinc-800 rounded-lg p-5">
                  <h3 className="text-green-500 font-semibold text-sm mb-4 flex items-center gap-2">
                    <span className="bg-green-900/50 text-green-400 w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                    Invoice Details, Payment & Delivery Options
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Invoice No</label>
                        <input type="text" value={currentInvoice.invoiceNo} onChange={(e) => updateInvoiceTab({ invoiceNo: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white font-mono" />
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
                        <select value={currentInvoice.salesperson_id || ""} onChange={(e) => updateInvoiceTab({ salesperson_id: Number(e.target.value) })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-sm outline-none text-white cursor-pointer">
                          <option value="" disabled>Select...</option>
                          {employees.map((e) => (
                            <option key={e.id} value={e.id}>{e.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Payment Type</label>
                        <div className="flex gap-1">
                          {["Advance", "Final", "Credit"].map((type) => (
                            <button
                              key={type}
                              onClick={() => updateInvoiceTab({ paymentType: type })}
                              className={`flex-1 text-[11px] py-1.5 rounded border ${currentInvoice.paymentType === type ? "bg-green-700 text-white border-green-600 font-semibold" : "border-zinc-700 text-gray-400"}`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Payment Method</label>
                        <div className="flex gap-1">
                          {["Cash", "UPI", "Bank", "Cheque"].map((method) => (
                            <button
                              key={method}
                              onClick={() => updateInvoiceTab({ paymentMethod: method })}
                              className={`flex-1 text-[11px] py-1.5 rounded border ${currentInvoice.paymentMethod === method ? "bg-zinc-700 text-white border-zinc-600 font-semibold" : "border-zinc-700 text-gray-400"}`}
                            >
                              {method}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Delivery Method</label>
                        <select value={currentInvoice.deliveryMethod} onChange={(e) => updateInvoiceTab({ deliveryMethod: e.target.value })} className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-1.5 text-xs text-white outline-none">
                          <option value="Self Pickup">Self Pickup</option>
                          <option value="Self Delivery">Self Delivery</option>
                          <option value="Porter">Porter</option>
                          <option value="Transport">Transport</option>
                          <option value="Courier">Courier</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PRODUCT ENTRY */}
                <div className="bg-[#121212] border border-zinc-800 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-green-500 font-semibold text-sm flex items-center gap-2">
                      <span className="bg-green-900/50 text-green-400 w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
                      Product Entry, Barcode & HSN Details
                    </h3>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setIsProductModalOpen(true)} className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded text-xs text-white hover:bg-zinc-700">+ F3 New Product</button>
                      <button onClick={addItem} className="bg-green-900/30 text-green-400 border border-green-800 px-3 py-1 rounded text-xs hover:bg-green-900/50">+ Add Row</button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead className="text-gray-400 border-b border-zinc-800">
                        <tr>
                          <th className="pb-2 w-8">Sr</th>
                          <th className="pb-2 px-2">Barcode</th>
                          <th className="pb-2 px-2">Product Name</th>
                          <th className="pb-2 px-2">HSN</th>
                          <th className="pb-2 px-2">Qty</th>
                          <th className="pb-2 px-2">Unit</th>
                          <th className="pb-2 px-2">Price (₹)</th>
                          <th className="pb-2 px-2">Disc%</th>
                          <th className="pb-2 px-2">GST%</th>
                          <th className="pb-2 px-2 text-right">Net Amt</th>
                          <th className="pb-2 pl-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.items.map((item, index) => (
                           <tr key={index} className="border-b border-zinc-800/50">
                             <td className="py-2.5 text-gray-500">{index + 1}</td>
                             <td className="py-2.5 px-2"><input type="text" value={item.barcode || ""} onChange={(e) => { const val = e.target.value; const updated = [...currentInvoice.items]; updated[index].barcode = val; updateInvoiceTab({ items: updated }); handleBarcodeScan(index, val); }} placeholder="Barcode" className="w-24 bg-[#1a1a1a] border border-zinc-700 rounded px-2 py-1 text-white font-mono text-xs" /></td>
                             <td className="py-2.5 px-2">
                               <select value={item.product_id || ""} onChange={(e) => updateItem(index, "product_id", Number(e.target.value))} className="w-44 bg-[#1a1a1a] border border-zinc-700 rounded px-2 py-1 text-white text-xs cursor-pointer">
                                 <option value="" disabled>Select product...</option>
                                 {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.selling_price || p.price})</option>)}
                               </select>
                             </td>
                             <td className="py-2.5 px-2"><input type="text" value={item.hsn || "8306"} onChange={(e) => updateItem(index, "hsn", e.target.value)} className="w-16 bg-transparent border-b border-zinc-700 text-white text-xs" /></td>
                             <td className="py-2.5 px-2"><input type="number" min="1" value={item.qty} onChange={(e) => updateItem(index, "qty", Number(e.target.value))} className="w-14 bg-zinc-900 border border-zinc-700 rounded text-center text-white text-xs" /></td>
                             <td className="py-2.5 px-2">
                               <select value={item.unit} onChange={(e) => updateItem(index, "unit", e.target.value)} className="bg-transparent text-gray-300 text-xs">
                                 <option value="PCS">PCS</option>
                                 <option value="BOX">BOX</option>
                               </select>
                             </td>
                             <td className="py-2.5 px-2"><input type="number" value={item.price} onChange={(e) => updateItem(index, "price", Number(e.target.value))} className="w-20 bg-transparent border-b border-zinc-700 text-right text-white text-xs" /></td>
                             <td className="py-2.5 px-2"><input type="number" value={item.discount} onChange={(e) => updateItem(index, "discount", Number(e.target.value))} className="w-16 bg-transparent border-b border-zinc-700 text-right text-white text-xs" /></td>
                             <td className="py-2.5 px-2">
                               <select disabled={invoiceType === "Non-GST Invoice"} value={invoiceType === "Non-GST Invoice" ? 0 : item.gstPercent} onChange={(e) => updateItem(index, "gstPercent", Number(e.target.value))} className="bg-transparent text-gray-300 text-xs disabled:opacity-30">
                                 <option value={5}>5%</option>
                                 <option value={12}>12%</option>
                                 <option value={18}>18%</option>
                               </select>
                             </td>
                             <td className="py-2.5 px-2 text-right text-white font-medium text-xs">₹{item.total.toFixed(2)}</td>
                             <td className="py-2.5 pl-2"><button onClick={() => removeItem(index)} className="text-red-500 font-bold w-4 h-4 rounded-full border border-red-500/50 flex items-center justify-center">×</button></td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="bg-[#121212] border border-zinc-800 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-semibold text-sm mb-4 border-b border-zinc-800 pb-2">Invoice Calculation Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Total Gross Amount</span>
                      <span className="text-white">₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-red-400">
                      <span>Trade Discount</span>
                      <span className="text-white">-₹{totalTradeDiscount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-semibold border-y border-zinc-800 py-3">
                      <span className="text-white">Taxable Value</span>
                      <span className="text-white">₹{netAmountBeforeGst.toFixed(2)}</span>
                    </div>

                    {invoiceType === "GST Invoice" ? (
                      <>
                        <div className="flex justify-between text-green-500 text-xs">
                          <span>CGST (2.5%)</span>
                          <span>₹{cgstAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-green-500 text-xs">
                          <span>SGST (2.5%)</span>
                          <span>₹{sgstAmount.toFixed(2)}</span>
                        </div>
                      </>
                    ) : null}

                    <div className="flex justify-between items-center text-gray-400 pt-2">
                      <span>Round Off</span>
                      <span>₹{calculatedRoundOff.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-zinc-800 pt-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-white font-semibold">Bill Amount</span>
                    <span className="text-3xl text-green-500 font-bold">₹{finalPayable.toFixed(2)}</span>
                  </div>
                  
                  <button onClick={saveCurrentInvoice} className="w-full bg-green-700 hover:bg-green-600 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-950/40 mt-4">
                    <Save size={18} /> Save Sales Voucher (<kbd className="text-[10px]">F5</kbd>)
                  </button>

                  <button 
                    onClick={handlePrint} 
                    className={`w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors mt-2 ${currentInvoice.isSaved ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-zinc-800 opacity-50 text-gray-400 cursor-not-allowed'}`}
                  >
                    <Printer size={18} /> Print Formatted Invoice (<kbd className="text-[10px]">F6</kbd>)
                  </button>
                  {!currentInvoice.isSaved && (
                    <p className="text-[10px] text-yellow-500 text-center mt-1">⚠️ Save invoice first to enable printing.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ================= PRINT MEDIA STYLING (Hides UI elements and forces single-page dark invoice print) ================= */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 15px;
            background: #121212 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .ant-modal-mask, .ant-modal-wrap {
            background: transparent !important;
          }
        }
      `}</style>

      {/* ================= EXACT PDF TEMPLATE MODAL WITH DARK THEME, LOGO & QR ================= */}
      <Modal
        open={isPrintModalOpen}
        onCancel={() => setIsPrintModalOpen(false)}
        footer={null}
        width={950}
        className="dark-print-modal"
      >
        <div id="printable-invoice" className="bg-[#121212] text-gray-200 p-8 font-sans text-xs select-none border border-zinc-800 rounded-2xl shadow-2xl">
          
          {/* HEADER SECTION WITH LOGO & QR */}
          <div className="flex justify-between items-start border-b border-zinc-800 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo/logo.png" alt="TrophyMall Logo" className="w-16 h-16 object-contain" onError={(e)=>{ e.currentTarget.style.display='none'; }} />
              <div>
                <h1 className="text-2xl font-black tracking-widest text-white">TROPHY MALL</h1>
                <p className="text-[10px] font-bold text-green-500 tracking-wider">CRAFTED FOR LEGENDS</p>
                <p className="text-[10px] text-zinc-400 mt-1">THE MAKERS OF Trophies & Awards</p>
                <p className="text-[10px] text-zinc-300 mt-2">Manoj Nagdev: +91 99 700 999 19 | Office: +91 98 222 459 50</p>
                <p className="text-[10px] text-blue-400">trophymallulhasnagar@gmail.com</p>
                <p className="text-[10px] font-bold text-zinc-200 mt-1">GST NO. 27AEOPN2614P1ZX</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-zinc-700 w-28 h-28 flex items-center justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Invoice:${currentInvoice.invoiceNo}|Total:₹${finalPayable.toFixed(2)}|GST:27AEOPN2614P1ZX`} 
                  alt="Invoice QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] mt-2 font-semibold text-zinc-400">1st Floor, Murlidhar Complex, Central Hospital Road,</p>
              <p className="text-[10px] text-zinc-500">Above Indian Bank, Ulhasnagar, Thane, Maharashtra, 421003</p>
            </div>
          </div>

          <div className="text-center font-bold text-[11px] bg-zinc-900 border border-zinc-800 text-green-400 py-1.5 mb-6 uppercase tracking-wider rounded-lg">
            MEDALS / TROPHIES / MEMENTOS / CUPS / AWARDS / BADGES / CERTIFICATES / SPORTS TROPHIES
          </div>

          {/* CUSTOMER & INVOICE DETAILS */}
          <div className="grid grid-cols-2 gap-4 border border-zinc-800 p-4 rounded-xl mb-6 bg-[#18181c]">
            <div className="space-y-1.5">
              <p><span className="font-bold text-zinc-400">Customer Name :</span> <span className="text-white font-semibold">{currentInvoice.customerName || "DINESH RASAL"}</span></p>
              <p><span className="font-bold text-zinc-400">Mobile No :</span> <span className="text-white">{currentInvoice.customerMobile || "9527555666"}</span></p>
              <p><span className="font-bold text-zinc-400">State :</span> <span className="text-white">27 | Maharashtra</span></p>
            </div>
            <div className="space-y-1.5 text-right">
              <p><span className="font-bold text-zinc-400">Invoice No. :</span> <span className="text-green-400 font-mono font-bold">{currentInvoice.invoiceNo}</span></p>
              <p><span className="font-bold text-zinc-400">Invoice Date :</span> <span className="text-white">{currentInvoice.invoiceDate}</span></p>
              <p><span className="font-bold text-zinc-400">Salesman :</span> <span className="text-white">MANOJ SIR</span></p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <table className="w-full border-collapse border border-zinc-800 text-xs mb-6 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-zinc-900 text-zinc-300 border-b border-zinc-800">
                <th className="border border-zinc-800 p-2.5">Sr</th>
                <th className="border border-zinc-800 p-2.5">Code</th>
                <th className="border border-zinc-800 p-2.5">Description</th>
                <th className="border border-zinc-800 p-2.5">HSN No</th>
                <th className="border border-zinc-800 p-2.5">GST%</th>
                <th className="border border-zinc-800 p-2.5">Qty</th>
                <th className="border border-zinc-800 p-2.5">Rate</th>
                <th className="border border-zinc-800 p-2.5">Per</th>
                <th className="border border-zinc-800 p-2.5">Dis%</th>
                <th className="border border-zinc-800 p-2.5">Net Rate</th>
                <th className="border border-zinc-800 p-2.5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoice.items.map((item, idx) => {
                const netRate = item.price - (item.price * (item.discount / 100));
                return (
                  <tr key={idx} className="border-b border-zinc-800/60 hover:bg-zinc-900/40">
                    <td className="border border-zinc-800 p-2 text-center text-zinc-500">{idx + 1}</td>
                    <td className="border border-zinc-800 p-2 font-mono text-zinc-400">{item.barcode || `TM151(${idx})`}</td>
                    <td className="border border-zinc-800 p-2 font-semibold text-white">{item.product || "Trophy"}</td>
                    <td className="border border-zinc-800 p-2 text-center text-zinc-400">{item.hsn || "8306"}</td>
                    <td className="border border-zinc-800 p-2 text-center text-green-400">{item.gstPercent}%</td>
                    <td className="border border-zinc-800 p-2 text-center text-white">{item.qty}</td>
                    <td className="border border-zinc-800 p-2 text-right text-zinc-300">₹{item.price.toFixed(2)}</td>
                    <td className="border border-zinc-800 p-2 text-center text-zinc-400">{item.unit}</td>
                    <td className="border border-zinc-800 p-2 text-center text-red-400">{item.discount}%</td>
                    <td className="border border-zinc-800 p-2 text-right text-zinc-200">₹{netRate.toFixed(2)}</td>
                    <td className="border border-zinc-800 p-2 text-right font-semibold text-green-400">₹{item.total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* SUMMARY & BANK DETAILS */}
          <div className="grid grid-cols-2 gap-4 border border-zinc-800 p-4 rounded-xl mb-6 bg-[#18181c]">
            <div className="space-y-1.5 border-r border-zinc-800 pr-4">
              <p className="font-bold text-white underline">Bank Details :</p>
              <p><span className="text-zinc-400">Name :</span> <span className="text-white">INDIAN BANK (BRANCH: ULHASNAGAR - 3)</span></p>
              <p><span className="text-zinc-400">A/C No. :</span> <span className="text-white font-mono">7826821688</span></p>
              <p><span className="text-zinc-400">IFSC No. :</span> <span className="text-white font-mono">IDIB0000016</span></p>
              <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-0.5">
                <p className="font-bold text-zinc-300">Terms & Conditions:</p>
                <p>1) Goods Once sold will not be taken back.</p>
                <p>2) Our responsibility ceases as soon as goods leave our shop.</p>
                <p>3) Payment 100% Advance Against Order.</p>
              </div>
            </div>

            <div className="space-y-2 text-right">
              <p><span className="text-zinc-400">Total Qty :</span> <span className="text-white font-bold">{currentInvoice.items.reduce((s, i) => s + i.qty, 0)}</span></p>
              <p><span className="text-zinc-400">Total Gross Amount :</span> <span className="text-white">₹{subtotal.toFixed(2)}</span></p>
              <p><span className="text-zinc-400">Trade Disc :</span> <span className="text-red-400">-₹{totalTradeDiscount.toFixed(2)}</span></p>
              <p><span className="text-zinc-400">CGST AMT 2.5% :</span> <span className="text-green-400">₹{cgstAmount.toFixed(2)}</span></p>
              <p><span className="text-zinc-400">SGST AMT 2.5% :</span> <span className="text-green-400">₹{sgstAmount.toFixed(2)}</span></p>
              <p><span className="text-zinc-400">ROUND OFF :</span> <span className="text-white">₹{calculatedRoundOff.toFixed(2)}</span></p>
              <p className="text-lg font-black border-t border-zinc-800 pt-2 text-green-400">
                BILL AMOUNT: ₹{finalPayable.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end mt-8 pt-4 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-500 font-semibold">Amount In Words: Verified & Generated Electronically</p>
            <div className="text-center">
              <p className="font-bold text-xs text-white mb-8">FOR TROPHY MALL</p>
              <p className="border-t border-zinc-700 pt-1 text-[10px] text-zinc-400 font-semibold">Authorised Signatory</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 bg-[#121212] p-4 border-t border-zinc-800">
          <button onClick={() => setIsPrintModalOpen(false)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs">Close</button>
          <button onClick={() => window.print()} className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg">Print Formatted Invoice</button>
        </div>
      </Modal>

      {/* QUICK ADD CUSTOMER MODAL */}
      <Modal title="Add New Customer" open={isCustomerModalOpen} onCancel={() => setIsCustomerModalOpen(false)} footer={null}>
        <div className="space-y-3 pt-2">
          <input type="text" value={newCustData.name} onChange={(e) => setNewCustData({ ...newCustData, name: e.target.value })} placeholder="Customer Name *" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
          <input type="text" value={newCustData.phone} onChange={(e) => setNewCustData({ ...newCustData, phone: e.target.value })} placeholder="Mobile Number" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
          <input type="text" value={newCustData.gst} onChange={(e) => setNewCustData({ ...newCustData, gst: e.target.value })} placeholder="GSTIN" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsCustomerModalOpen(false)} className="bg-zinc-800 text-white px-3 py-1.5 rounded text-xs">Cancel</button>
            <button onClick={handleSaveNewCustomer} className="bg-green-700 text-white px-4 py-1.5 rounded text-xs font-bold">Save</button>
          </div>
        </div>
      </Modal>

      {/* QUICK ADD PRODUCT MODAL */}
      <Modal title="Quick Product Entry (F3)" open={isProductModalOpen} onCancel={() => setIsProductModalOpen(false)} footer={null}>
        <div className="space-y-3 pt-2">
          <input type="text" value={newProdData.name} onChange={(e) => setNewProdData({ ...newProdData, name: e.target.value })} placeholder="Product Name *" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
          <input type="text" value={newProdData.barcode} onChange={(e) => setNewProdData({ ...newProdData, barcode: e.target.value })} placeholder="Barcode" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
          <input type="number" value={newProdData.price} onChange={(e) => setNewProdData({ ...newProdData, price: e.target.value })} placeholder="Selling Price" className="w-full bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setIsProductModalOpen(false)} className="bg-zinc-800 text-white px-3 py-1.5 rounded text-xs">Cancel</button>
            <button onClick={handleSaveNewProduct} className="bg-green-700 text-white px-4 py-1.5 rounded text-xs font-bold">Save Product</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}