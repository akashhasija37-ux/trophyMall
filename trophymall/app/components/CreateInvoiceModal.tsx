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

const { TextArea } = Input;

type InvoiceItem = {
  product: string;
  product_id?: number;
  qty: number;
  price: number;
  total: number;
};

export default function CreateInvoiceModal({
  open,
  setOpen,
  refresh,
}: {
  open: boolean;
  setOpen: any;
  refresh?: any;
}) {
  const [form] = Form.useForm();

  const [items, setItems] = useState<InvoiceItem[]>([
    { product: "", qty: 1, price: 0, total: 0 },
  ]);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [employees, setEmployees] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(18);
  const [deposit, setDeposit] = useState(0); // ✅ NEW

  // ✅ FETCH CUSTOMERS
  const fetchCustomers = async () => {
    const res = await fetch("/api/customers");
    const data = await res.json();
    setCustomers(data);
  };

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Inventory fetch error:", err);
    }
  };

  const fetchEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchEmployees();
  }, []);

  const updateItem = (index: number, key: keyof InvoiceItem, value: any) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    // 🔥 product select → auto price
    if (key === "product_id") {
      const selected = products.find((p) => p.id === value);

      if (selected) {
        updated[index].product = selected.name;
        updated[index].price = Number(
          selected.selling_price || selected.price || 0,
        );
      }
    }

    // 🔥 recalc total ALWAYS
    const qty = Number(updated[index].qty || 0);
    const price = Number(updated[index].price || 0);

    updated[index].total = qty * price;

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { product: "", qty: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];

    // prevent removing last row
    if (updated.length === 1) return;

    updated.splice(index, 1);
    setItems(updated);
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const gstAmount = (subtotal - discountAmount) * (gst / 100);

  // ✅ FINAL TOTAL WITH DEPOSIT
  const total = subtotal - discountAmount + gstAmount;
  const finalPayable = total - deposit;

const handleSubmit = async (values: any) => {
  const cleanedItems = items.map((i) => ({
    product: i.product,
    qty: Number(i.qty) || 0,
    price: Number(i.price) || 0,
    total: Number(i.total) || 0,
  }));

  const invoiceData = {
    customer_id: values.customer,

    invoice_date: dayjs(values.invoiceDate).format("YYYY-MM-DD"),
    due_date: dayjs(values.dueDate).format("YYYY-MM-DD"),

    payment_status: values.paymentStatus,
    notes: values.notes || "",

    items: cleanedItems,

    discount,
    gst,
    deposit,

    // ✅ NEW (CRITICAL)
    salesperson_id: values.salesperson_id,
    assigned_to: values.assigned_to,
  };

  try {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoiceData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    message.success("Invoice + Printing Job created ✅");

    setOpen(false);
    form.resetFields();
    setItems([{ product: "", qty: 1, price: 0, total: 0 }]);
    setDeposit(0);

    if (refresh) refresh();

  } catch (err: any) {
    message.error(err.message);
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
        {/* TOP */}
        <div className="grid grid-cols-3 gap-6">
          {/* ✅ CUSTOMER DROPDOWN */}
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
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 bg-zinc-800 p-3 rounded items-center"
              >
                {/* PRODUCT */}
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

                {/* QTY */}
                <InputNumber
                  min={1}
                  value={item.qty}
                  onChange={(v) => updateItem(index, "qty", v)}
                  style={{ width: "100%",color:'white' }}
                />

                {/* PRICE (AUTO) */}
                <InputNumber
                  value={item.price}
                  disabled
                  style={{ width: "100%" }}
                />

                {/* TOTAL */}
                <div className="text-white font-medium">
                  ₹{item.total.toFixed(2)}
                </div>

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <Form.Item label="Payment Status" name="paymentStatus">
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Paid">Paid</Select.Option>
              </Select>
            </Form.Item>

             <Form.Item
              label="Salesperson"
              name="salesperson_id"
              rules={[{ required: true, message: "Select salesperson" }]}
            >
              <Select
                placeholder="Select Salesperson"
                showSearch
                optionFilterProp="label"
                options={employees.map((e: any) => ({
                  label: `${e.name} (${e.role})`,
                  value: e.id,
                }))}
              />
            </Form.Item>

             <Form.Item
              label="Assign Job"
              name="assigned_to"
              rules={[{ required: true, message: "Assign employee" }]}
            >
              <Select
                placeholder="Assign Printing Job"
                showSearch
                optionFilterProp="label"
                options={employees?.map((e: any) => ({
                  label: `${e.name} (${e.role})`,
                  value: e.id,
                }))}
              />
            </Form.Item>

            <Form.Item label="Invoice Notes" name="notes">
              <TextArea rows={5} />
            </Form.Item>
          </div>

         

          <div className="bg-zinc-800 p-6 rounded-lg" style={{height:'fit-content'}}>
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

            {/* ✅ NEW FIELD */}
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
            Save Invoice
          </Button>

          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </Form>
    </Modal>
  );
}
