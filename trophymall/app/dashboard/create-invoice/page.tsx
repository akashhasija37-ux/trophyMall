"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  InputNumber,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "@/app/components/sidebar";
import Link from "next/link";

const { TextArea } = Input;

type InvoiceItem = {
  product: string;
  product_id?: number;
  qty: number;
  price: number;
  total: number;
  discount?: number;
};

export default function CreateInvoiceModal({
  open,
  setOpen,
  refresh,
  editData = null,
}: any) {
  const [form] = Form.useForm();

  const [items, setItems] = useState<InvoiceItem[]>([
    { product: "", qty: 1, price: 0, total: 0 },
  ]);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [roundOff, setRoundOff] = useState(0);

  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(18);
  const [deposit, setDeposit] = useState(0);

  // 🔥 PREFILL FOR EDIT
  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        customer: editData.customer_id,
        invoiceDate: dayjs(editData.invoice_date),
        dueDate: dayjs(editData.due_date),
        paymentStatus: editData.payment_status,
        notes: editData.notes,
        salesperson_id: editData.salesperson_id,
        assigned_to: editData.assigned_to,
      });

      setItems(
        editData.items?.length
          ? editData.items.map((i: any) => ({
              product: i.product_name,
              qty: Number(i.quantity),
              price: Number(i.price),
              total: Number(i.total),
            }))
          : [{ product: "", qty: 1, price: 0, total: 0 }],
      );

      setDeposit(Number(editData.deposit || 0));
      setDiscount(Number(editData.discount || 0));
      setGst(Number(editData.tax || 0));
    } else {
      form.resetFields();
      setItems([{ product: "", qty: 1, price: 0, total: 0 }]);
      setDeposit(0);
      setDiscount(0);
      setGst(18);
    }
  }, [editData]);

  // FETCH DATA
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchEmployees();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setProducts(data);
  };

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  };

  // UPDATE ITEM
  const updateItem = (index: number, key: keyof InvoiceItem, value: any) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    if (key === "product_id") {
      const selected = products.find((p) => p.id === value);

      if (selected) {
        updated[index].product = selected.name;
        updated[index].price = Number(
          selected.selling_price || selected.price || 0,
        );
        updated[index].discount = Number(selected.discount || 0);
      }
    }

    const qty = Number(updated[index].qty || 0);
    const price = Number(updated[index].price || 0);

    const rowTotal = qty * price;
    const discountPercent = Number(updated[index].discount || 0);
    const discountAmount = rowTotal * (discountPercent / 100);

    updated[index].total = rowTotal - discountAmount;

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { product: "", qty: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // 🔥 CALCULATIONS (UNCHANGED)
  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const gstAmount = (subtotal - discountAmount) * (gst / 100);
  const total = subtotal - discountAmount + gstAmount;
  const finalPayable = total - deposit - roundOff;

  // SUBMIT
  const handleSubmit = async (values: any) => {
    const cleanedItems = items.map((i) => ({
      product: i.product,
      qty: Number(i.qty),
      price: Number(i.price),
      total: Number(i.total),
    }));

    const invoiceData = {
      invoice_id: editData?.invoice_id,
      customer_id: values.customer,
      invoice_date: dayjs(values.invoiceDate).format("YYYY-MM-DD"),
      due_date: dayjs(values.dueDate).format("YYYY-MM-DD"),
      payment_status: values.paymentStatus,
      notes: values.notes || "",
      items: cleanedItems,
      discount,
      gst,
      deposit,
      salesperson_id: values.salesperson_id,
      assigned_to: values.assigned_to,
    };

    try {
      const res = await fetch("/api/invoices", {
        method: editData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      message.success(
        editData
          ? "Invoice updated successfully ✅"
          : "Invoice created successfully ✅",
      );

      setOpen(false);
      form.resetFields();
      setItems([{ product: "", qty: 1, price: 0, total: 0 }]);

      if (refresh) refresh();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
   <div className="p-8 bg-black min-h-screen text-white">
    <Link href="/dashboard/billing">
    <Button className="bg-secondary">Back </Button ></Link>
  <div className="max-w-6xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-xl">
    
        {/* TOP */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          invoiceDate: dayjs(),
          paymentStatus: "Pending",
        }}
      >
      
        <div className="grid grid-cols-3 gap-6 lablcl">
          <Form.Item
            label="Customer"
            name="customer"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select customer">
              {customers.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Invoice Date"
            name="invoiceDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>

        {/* PRODUCTS */}
        <div className="mt-6">
          <div className="flex justify-between mb-3">
            <h3 className="text-white font-semibold">Products / Services</h3>
            <button type="button" onClick={addItem} className="text-green-500">
              <PlusOutlined /> Add Item
            </button>
          </div>

          <div className="space-y-3">

  {/* ✅ HEADER LABELS */}
  <div className="grid grid-cols-5 gap-4 px-2 text-xs text-gray-400">
    <span>Product</span>
    <span>Qty</span>
    <span>Discount (%)</span>
    <span>Price</span>
    <span>Total</span>
  </div>

  {/* ✅ ITEMS */}
  {items.map((item, index) => (
    <div
      key={index}
      className="grid grid-cols-5 gap-4 bg-zinc-800 p-3 rounded items-center"
    >
      {/* PRODUCT */}
      <Select
        placeholder="Select product"
        value={item.product_id} // ✅ FIXED (important)
        onChange={(v) => updateItem(index, "product_id", v)}
      >
        {products.map((p) => (
          <Select.Option key={p.id} value={p.id}>
            {p.name}
          </Select.Option>
        ))}
      </Select>

      {/* QTY */}
      <InputNumber
        min={1}
        value={item.qty}
        onChange={(v) => updateItem(index, "qty", v)}
        style={{ width: "100%",background:'#000' }}
      />

      {/* DISCOUNT */}
      <InputNumber
        value={item.discount}
        disabled
        style={{ width: "100%" }}
      />

      {/* PRICE */}
      <InputNumber
        value={item.price}
        disabled
        style={{ width: "100%" }}
      />

      {/* TOTAL + REMOVE */}
      <div className="text-white font-medium flex justify-between items-center">
        ₹{item.total.toFixed(2)}

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

        {/* SUMMARY (FULL PRESERVED) */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div className="lablcl">
            <Form.Item label="Payment Status" name="paymentStatus">
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Paid">Paid</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Salesperson"
              name="salesperson_id"
              rules={[{ required: true }]}
            >
              <Select
                options={employees.map((e: any) => ({
                  label: e.name,
                  value: e.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Assign Job"
              name="assigned_to"
              rules={[{ required: true }]}
            >
              <Select
                options={employees.map((e: any) => ({
                  label: e.name,
                  value: e.id,
                }))}
              />
            </Form.Item>

            <Form.Item label="Invoice Notes" name="notes">
              <TextArea rows={5} />
            </Form.Item>
          </div>

          <div className="bg-zinc-800 p-6 rounded-lg">
            <div className="flex justify-between text-white mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-white">Discount (%)</span>
              <InputNumber
                value={discount}
                onChange={(v) => setDiscount(v || 0)}
              />
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-white">GST</span>
              <Select value={gst} onChange={(v) => setGst(v)}>
                <Select.Option value={5}>5%</Select.Option>
                <Select.Option value={12}>12%</Select.Option>
                <Select.Option value={18}>18%</Select.Option>
              </Select>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white">Round Off</span>
              <InputNumber
                value={roundOff}
                onChange={(v) => setRoundOff(v || 0)}
              />
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-white">Deposited Amount</span>
              <InputNumber
                value={deposit}
                onChange={(v) => setDeposit(v || 0)}
              />
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between text-lg">
              <span className="text-white font-semibold">Final Payable</span>
              <span className="text-green-500 font-bold">
                ₹{finalPayable.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button htmlType="submit" className="bg-green-600 text-white">
            {editData ? "Update Invoice" : "Save Invoice"}
          </Button>

          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </Form>
   </div>
</div>
  );
}
