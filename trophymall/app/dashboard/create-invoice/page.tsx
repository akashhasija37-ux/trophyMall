"use client";

import {
  Form,
  Select,
  DatePicker,
  Button,
  InputNumber,
  Input,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Link from "next/link";

const { TextArea } = Input;

/* ==============================
   TYPES
================================= */

type InvoiceItem = {
  product: string;
  product_id?: number;
  qty: number;
  price: number;
  total: number;
  discount?: number;
};

type InvoiceTab = {
  id: string;

  customer?: number;
  customerName?: string;

  invoiceDate: string;
  dueDate: string;

  paymentStatus: string;

  salesperson_id?: number;
  assigned_to?: number;

  notes: string;

  items: InvoiceItem[];

  discount: number;
  gst: number;
  deposit: number;
  roundOff: number;
};

/* ==============================
   HELPERS
================================= */

const createNewInvoiceTab = (): InvoiceTab => ({
  id: crypto.randomUUID(),

  customer: undefined,
  customerName: "",

  invoiceDate: dayjs().format("YYYY-MM-DD"),
  dueDate: dayjs().format("YYYY-MM-DD"),

  paymentStatus: "Pending",

  salesperson_id: undefined,
  assigned_to: undefined,

  notes: "",

  items: [
    {
      product: "",
      qty: 1,
      price: 0,
      total: 0,
      discount: 0,
    },
  ],

  discount: 0,
  gst: 18,
  deposit: 0,
  roundOff: 0,
});

/* ==============================
   COMPONENT
================================= */

export default function CreateInvoiceModal({ refresh }: any) {
  const [form] = Form.useForm();

  /* ==============================
     MASTER DATA
  ================================= */

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  /* ==============================
     MULTI TAB STATE
  ================================= */

  const [invoiceTabs, setInvoiceTabs] = useState<InvoiceTab[]>([
    createNewInvoiceTab(),
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
    const newTab = createNewInvoiceTab();

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

  /* ==============================
     ADD ITEM
  ================================= */

  const addItem = () => {
    updateInvoiceTab({
      items: [
        ...currentInvoice.items,
        {
          product: "",
          qty: 1,
          price: 0,
          total: 0,
          discount: 0,
        },
      ],
    });
  };

  /* ==============================
     REMOVE ITEM
  ================================= */

  const removeItem = (index: number) => {
    if (currentInvoice.items.length === 1) {
      return;
    }

    const updated = [...currentInvoice.items];

    updated.splice(index, 1);

    updateInvoiceTab({
      items: updated,
    });
  };

  /* ==============================
   CALCULATIONS
================================= */

  const subtotal = currentInvoice.items.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const discountAmount = subtotal * (currentInvoice.discount / 100);

  const taxableAmount = subtotal - discountAmount;

  const gstAmount = taxableAmount * (currentInvoice.gst / 100);

  const grandTotal = taxableAmount + gstAmount;

  const finalPayable =
    grandTotal - currentInvoice.deposit - currentInvoice.roundOff;

  /* ==============================
   TAB BAR UI
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

        gst: currentInvoice.gst,

        deposit: currentInvoice.deposit,

        roundOff: currentInvoice.roundOff,

        items: currentInvoice.items,
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      message.success("Invoice saved successfully");

      refresh?.();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  /* ==============================
   SAVE ALL
================================= */

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
          headers: {
            "Content-Type": "application/json",
          },
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
    <>
      <div className="p-8 bg-black min-h-screen text-white">
        <div className="mb-5">
          <Link href="/dashboard/billing">
            <Button
              className="bg-gray"
              style={{
                background: "red",
                color: "white",
                border: "transparent",
              }}
            >
              Back
            </Button>
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {invoiceTabs.map((tab, index) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg cursor-pointer flex items-center gap-3 whitespace-nowrap border
      ${
        activeTab === tab.id
          ? "bg-green-600 border-green-500 text-white"
          : "bg-zinc-800 border-zinc-700 text-gray-300"
      }`}
            >
              <span>Invoice {index + 1}</span>

              {tab.customerName && (
                <span className="text-xs">- {tab.customerName}</span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeInvoiceTab(tab.id);
                }}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addInvoiceTab}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <PlusOutlined />
            New Invoice
          </button>
        </div>

        <div className="max-w-7xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              paymentStatus: "Pending",
            }}
          >
            <div className="grid grid-cols-3 gap-6 lablcl">
              <Form.Item label="Customer" required>
                <Select
                  value={currentInvoice.customer}
                  placeholder="Select customer"
                  onChange={updateCustomer}
                >
                  {customers.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Invoice Date">
                <DatePicker
                  style={{ width: "100%" }}
                  value={dayjs(currentInvoice.invoiceDate)}
                  onChange={(date) =>
                    updateInvoiceTab({
                      invoiceDate: date?.format("YYYY-MM-DD") || "",
                    })
                  }
                />
              </Form.Item>

              <Form.Item label="Due Date">
                <DatePicker
                  style={{ width: "100%" }}
                  value={dayjs(currentInvoice.dueDate)}
                  onChange={(date) =>
                    updateInvoiceTab({
                      dueDate: date?.format("YYYY-MM-DD") || "",
                    })
                  }
                />
              </Form.Item>
            </div>

            <div className="mt-8 ">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg">
                  Products / Services
                </h3>

                <button
                  type="button"
                  onClick={addItem}
                  className="text-green-500"
                >
                  <PlusOutlined />
                  Add Item
                </button>
              </div>

              <div className="grid grid-cols-5 gap-4 px-3 py-2 text-xs uppercase tracking-wide text-gray-400">
                <span>Product</span>

                <span>Quantity</span>

                <span>Discount %</span>

                <span>Price</span>

                <span>Total</span>
              </div>

              <div className="space-y-3 ">
                {currentInvoice.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 bg-zinc-800 p-3 rounded-lg items-center pdinput"
                  >
                    <Select
                      placeholder="Select product"
                      value={item.product_id}
                      onChange={(v) => updateItem(index, "product_id", v)}
                    >
                      {products.map((p) => (
                        <Select.Option key={p.id} value={p.id}>
                          {p.name}
                        </Select.Option>
                      ))}
                    </Select>

                    <InputNumber
                      min={1}
                      value={item.qty}
                      style={{
                        width: "100%",
                      }}
                      onChange={(v) => updateItem(index, "qty", v)}
                    />

                    <InputNumber
                      min={0}
                      max={100}
                      value={item.discount}
                      style={{
                        width: "100%",
                        
                      }}
                      onChange={(v) =>
                        updateItem(index, "discount", Number(v) || 0)
                      }
                    />

                    <InputNumber
                      value={item.price}
                      disabled
                      className="pricetag"
                      style={{
                        width: "100%",
                       
                      }}
                    />

                    <div className="flex justify-between items-center text-white font-medium">
                      <span>₹{item.total.toFixed(2)}</span>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="bg-zinc-800 p-6 rounded-lg lablcl">
                <Form.Item label="Payment Status">
                  <Select
                    value={currentInvoice.paymentStatus}
                    onChange={(value) =>
                      updateInvoiceTab({
                        paymentStatus: value,
                      })
                    }
                  >
                    <Select.Option value="Pending">Pending</Select.Option>

                    <Select.Option value="Paid">Paid</Select.Option>

                    <Select.Option value="Partial">Partial</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Salesperson">
                  <Select
                    value={currentInvoice.salesperson_id}
                    onChange={(value) =>
                      updateInvoiceTab({
                        salesperson_id: value,
                      })
                    }
                  >
                    {employees.map((e) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Assign Job">
                  <Select
                    value={currentInvoice.assigned_to}
                    onChange={(value) =>
                      updateInvoiceTab({
                        assigned_to: value,
                      })
                    }
                  >
                    {employees.map((e) => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Invoice Notes">
                  <TextArea
                    rows={5}
                    value={currentInvoice.notes}
                    onChange={(e) =>
                      updateInvoiceTab({
                        notes: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </div>

              {/* RIGHT PANEL */}

              <div className="bg-zinc-800 p-6 rounded-lg notepart">
                <div className="flex justify-between mb-3">
                  <span>Subtotal</span>

                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span>Discount (%)</span>

                  <InputNumber
                    value={currentInvoice.discount}
                    onChange={(v) =>
                      updateInvoiceTab({
                        discount: Number(v) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span>GST</span>

                  <Select
                    value={currentInvoice.gst}
                    style={{
                      width: 120,
                    }}
                    onChange={(v) =>
                      updateInvoiceTab({
                        gst: Number(v),
                      })
                    }
                  >
                    <Select.Option value={5}>5%</Select.Option>

                    <Select.Option value={12}>12%</Select.Option>

                    <Select.Option value={18}>18%</Select.Option>

                    <Select.Option value={28}>28%</Select.Option>
                  </Select>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span>Deposited Amount</span>

                  <InputNumber
                    value={currentInvoice.deposit}
                    onChange={(v) =>
                      updateInvoiceTab({
                        deposit: Number(v) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span>Round Off</span>

                  <InputNumber
                    value={currentInvoice.roundOff}
                    onChange={(v) =>
                      updateInvoiceTab({
                        roundOff: Number(v) || 0,
                      })
                    }
                  />
                </div>

                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Discount Amount</span>

                    <span>₹{discountAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>GST Amount</span>

                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-700 pt-4 mt-4 flex justify-between text-xl font-bold">
                  <span>Final Payable</span>

                  <span className="text-green-500">
                    ₹{finalPayable.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* ==========================
         ACTIONS
      ========================== */}

            <div className="flex gap-4 mt-8">
              <Button
                type="primary"
                className="bg-green-600 border-none"
                onClick={saveCurrentInvoice}
              >
                Save Current Invoice
              </Button>

              <Button
                className="bg-blue-600 text-white border-none"
                onClick={saveAllInvoices}
              >
                Save All Invoices
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
