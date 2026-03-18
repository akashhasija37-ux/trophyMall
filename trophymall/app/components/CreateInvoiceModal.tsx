"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  InputNumber,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { TextArea } = Input;

type InvoiceItem = {
  product: string;
  qty: number;
  price: number;
  total: number;
};

export default function CreateInvoiceModal({
  open,
  setOpen,
  refresh // ✅ NEW PROP
}: {
  open: boolean;
  setOpen: any;
  refresh?: any;
}) {
  const [form] = Form.useForm();

  const [items, setItems] = useState<InvoiceItem[]>([
    { product: "", qty: 1, price: 0, total: 0 },
  ]);

  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(18);

  const updateItem = (
    index: number,
    key: keyof InvoiceItem,
    value: string | number,
  ) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    updated[index].total =
      (updated[index].qty || 0) * (updated[index].price || 0);

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { product: "", qty: 1, price: 0, total: 0 }]);
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);

  const discountAmount = subtotal * (discount / 100);

  const gstAmount = (subtotal - discountAmount) * (gst / 100);

  const total = subtotal - discountAmount + gstAmount;

 const handleSubmit = async (values: any) => {

  // ✅ ensure items is always array
  const safeItems = Array.isArray(items) ? items : [];

  // ✅ sanitize items (avoid undefined/null issues)
  const cleanedItems = safeItems.map((i) => ({
    product: i.product || "",
    qty: Number(i.qty || 0),
    price: Number(i.price || 0),
    total: Number(i.total || 0),
  }));

  const invoiceData = {
    customer_name: values.customer,

    invoice_date: values.invoiceDate
      ? dayjs(values.invoiceDate).format("YYYY-MM-DD")
      : null,

    due_date: values.dueDate
      ? dayjs(values.dueDate).format("YYYY-MM-DD")
      : null,

    payment_status: values.paymentStatus,
    notes: values.notes || "",

    // 🔥 IMPORTANT FIX
    items: cleanedItems, // ❌ removed JSON.stringify

    subtotal: Number(subtotal || 0),
    discount: Number(discount || 0),
    gst: Number(gst || 0),
    total_amount: Number(total || 0),
  };

  try {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Failed");

    message.success("Invoice created successfully ✅");

    setOpen(false);
    form.resetFields();

    // ✅ reset items safely
    setItems([{ product: "", qty: 1, price: 0, total: 0 }]);

    // ✅ refresh list
    if (refresh) refresh();

  } catch (err: any) {
    console.error(err);
    message.error(err.message || "Something went wrong ❌");
  }
};

  return (
    <Modal
      title="Create New Invoice"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1000}
      className="dark-ant-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          invoiceDate: dayjs(),
          paymentStatus: "Pending",
        }}
      >
        {/* Top section */}

        <div className="grid grid-cols-3 gap-6">
          <Form.Item
            label="Customer"
            name="customer"
            rules={[{ required: true, message: "Select customer" }]}
          >
            <Select placeholder="Select customer">
              <Select.Option value="Acme Corporation">Acme Corporation</Select.Option>
              <Select.Option value="Tech Solutions Ltd">Tech Solutions Ltd</Select.Option>
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

        {/* Products */}

        <div className="mt-6">
          <div className="flex justify-between mb-3">
            <h3 className="text-white font-semibold">Products / Services</h3>

            <button
              type="button"
              onClick={addItem}
              className="text-green-500 flex items-center gap-1"
            >
              <PlusOutlined /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 bg-zinc-800 p-3 rounded"
              >
                <Input
                  placeholder="Product/service name"
                  value={item.product}
                  onChange={(e) => updateItem(index, "product", e.target.value)}
                />

                <InputNumber
                  min={1}
                  value={item.qty}
                  onChange={(v) => updateItem(index, "qty", v ?? 0)}
                  style={{ width: "100%" }}
                />

                <InputNumber
                  min={0}
                  value={item.price}
                  onChange={(v) => updateItem(index, "price", v ?? 0)}
                  style={{ width: "100%" }}
                />

                <div className="flex items-center text-white">
                  ₹{item.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}

        <div className="grid grid-cols-2 gap-8 mt-6">

          <div>
            <Form.Item label="Payment Status" name="paymentStatus">
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Paid">Paid</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Invoice Notes" name="notes">
              <TextArea
                rows={5}
                placeholder="Add terms, conditions, or special notes..."
              />
            </Form.Item>
          </div>

          <div className="bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-white text-lg mb-4">Invoice Summary</h3>

            <div className="flex justify-between mb-2 text-white">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-white">Discount</span>

              <div className="flex items-center gap-2">
                <InputNumber
                  min={0}
                  value={discount}
                  onChange={(v) => setDiscount(v || 0)}
                />
                <span>%</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-white">Tax (GST)</span>

              <Select
                value={gst}
                style={{ width: 120 }}
                onChange={(v) => setGst(v)}
              >
                <Select.Option value={5}>5%</Select.Option>
                <Select.Option value={12}>12%</Select.Option>
                <Select.Option value={18}>18%</Select.Option>
              </Select>
            </div>

            <div className="border-t border-zinc-600 pt-4 flex justify-between text-lg">
              <span className="text-white font-semibold">Total Amount</span>

              <span className="text-green-500 font-bold">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}

        <div className="flex gap-4 mt-6">
          <Button
            htmlType="submit"
            className="bg-green-600 border-none hover:bg-green-700"
          >
            Save Invoice
          </Button>

          <Button
            onClick={() => setOpen(false)}
            className="bg-zinc-700 text-white border-none"
          >
            Cancel
          </Button>
        </div>

      </Form>
    </Modal>
  );
}