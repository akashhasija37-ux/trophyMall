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
    { product: "", qty: 1, price: 0, total: 0, discount: 0 },
  ]);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [roundOff, setRoundOff] = useState(0);

  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(18);
  const [deposit, setDeposit] = useState(0);

  // 🔥 PREFILL FOR EDIT WITH PERCENTAGE REVERSE-CALCULATION
  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        customer: editData.customer_id,
        invoiceDate: editData.invoice_date ? dayjs(editData.invoice_date) : dayjs(),
        dueDate: editData.due_date ? dayjs(editData.due_date) : dayjs(),
        paymentStatus: editData.payment_status || "Pending",
        notes: editData.notes || "",
        salesperson_id: editData.salesperson_id,
        assigned_to: editData.assigned_to,
      });

      if (editData.items?.length) {
        setItems(
          editData.items.map((i: any) => {
            const matchedProduct = products.find((p) => p.name === i.product_name);
            const qty = Number(i.quantity || 1);
            const price = Number(i.price || 0);
            const disc = Number(i.discount || 0);
            const rowTotal = qty * price;
            const finalRowTotal = rowTotal - (rowTotal * (disc / 100));

            return {
              product: i.product_name,
              product_id: matchedProduct ? matchedProduct.id : undefined,
              qty: qty,
              price: price,
              discount: disc,
              total: finalRowTotal,
            };
          })
        );
      } else {
        setItems([{ product: "", qty: 1, price: 0, total: 0, discount: 0 }]);
      }

      setDeposit(Number(editData.deposit || 0));
      setDiscount(Number(editData.discount || 0));
      setRoundOff(Number(editData.round_off || 0));

      // Reverse calculate tax amount to percentage if stored as amount
      const storedSubtotal = Number(editData.subtotal || 0);
      const storedTax = Number(editData.tax || 0);
      if (storedSubtotal > 0 && storedTax > 0) {
        const calculatedPercentage = Math.round((storedTax / storedSubtotal) * 100);
        // Match with standard GST slabs (0, 5, 12, 18, 28)
        const validSlabs = [0, 5, 12, 18, 28];
        const closestSlab = validSlabs.reduce((prev, curr) => 
          Math.abs(curr - calculatedPercentage) < Math.abs(prev - calculatedPercentage) ? curr : prev
        , 18);
        setGst(closestSlab);
      } else {
        setGst(18);
      }
    } else {
      form.resetFields();
      setItems([{ product: "", qty: 1, price: 0, total: 0, discount: 0 }]);
      setDeposit(0);
      setDiscount(0);
      setGst(18);
      setRoundOff(0);
    }
  }, [editData, products]);

  // FETCH DATA
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchEmployees();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
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
        updated[index].price = Number(selected.selling_price || selected.price || 0);
        updated[index].discount = Number(selected.discount || 0);
      }
    }

    const qty = Number(updated[index].qty || 0);
    const price = Number(updated[index].price || 0);
    const discountPercent = Number(updated[index].discount || 0);

    const rowTotal = qty * price;
    const discountAmount = rowTotal * (discountPercent / 100);

    updated[index].total = rowTotal - discountAmount;

    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { product: "", qty: 1, price: 0, total: 0, discount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // 🔥 CALCULATIONS
  const subtotal = items.reduce((sum, i) => sum + (i.total || 0), 0);
  const globalDiscountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - globalDiscountAmount;
  const gstAmount = taxableAmount * (gst / 100);
  const total = taxableAmount + gstAmount;
  const finalPayable = total - deposit - roundOff;

  // SUBMIT
  const handleSubmit = async (values: any) => {
    const cleanedItems = items.map((i) => ({
      product: i.product,
      qty: Number(i.qty),
      price: Number(i.price),
      discount: Number(i.discount || 0),
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
      tax: gstAmount, // Save calculated tax amount to database
      deposit,
      round_off: roundOff,
      subtotal,
      total_amount: finalPayable,
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
      if (!res.ok) throw new Error(data.error || "Failed to save invoice");

      message.success(
        editData
          ? "Invoice updated successfully ✅"
          : "Invoice created successfully ✅"
      );

      setOpen(false);
      form.resetFields();
      setItems([{ product: "", qty: 1, price: 0, total: 0, discount: 0 }]);

      if (refresh) refresh();
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <Modal
      title={<span className="text-white font-bold text-base">{editData ? "Edit Invoice" : "Create New Invoice"}</span>}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1000}
      className="dark-ant-modal"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          invoiceDate: dayjs(),
          dueDate: dayjs(),
          paymentStatus: "Pending",
        }}
      >
        {/* TOP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Form.Item
            label={<span className="text-zinc-300 text-xs">Customer</span>}
            name="customer"
            rules={[{ required: true, message: "Please select customer" }]}
          >
            <Select placeholder="Select customer" showSearch optionFilterProp="children">
              {customers.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-zinc-300 text-xs">Invoice Date</span>}
            name="invoiceDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label={<span className="text-zinc-300 text-xs">Due Date</span>}
            name="dueDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </div>

        {/* PRODUCTS */}
        <div className="mt-6">
          <div className="flex justify-between mb-3 items-center">
            <h3 className="text-white font-semibold text-sm">Products / Services</h3>
            <button
              type="button"
              onClick={addItem}
              className="text-green-400 hover:text-green-300 text-xs font-bold flex items-center gap-1"
            >
              <PlusOutlined /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-4 px-2 text-xs text-zinc-400 font-semibold uppercase">
              <span>Product</span>
              <span>Qty</span>
              <span>Discount (%)</span>
              <span>Price (₹)</span>
              <span>Total (₹)</span>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-5 gap-4 bg-zinc-800/80 border border-zinc-700/60 p-3 rounded-xl items-center"
              >
                <Select
                  placeholder="Select product"
                  value={item.product_id}
                  onChange={(v) => updateItem(index, "product_id", v)}
                  showSearch
                  optionFilterProp="children"
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
                  onChange={(v) => updateItem(index, "qty", v)}
                  style={{ width: "100%" }}
                />

                <InputNumber
                  min={0}
                  max={100}
                  value={item.discount}
                  onChange={(v) => updateItem(index, "discount", v)}
                  style={{ width: "100%" }}
                />

                <InputNumber
                  min={0}
                  value={item.price}
                  onChange={(v) => updateItem(index, "price", v)}
                  style={{ width: "100%" }}
                />

                <div className="text-white font-bold flex justify-between items-center text-xs">
                  <span>₹{Number(item.total || 0).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <Form.Item label={<span className="text-zinc-300 text-xs">Payment Status</span>} name="paymentStatus">
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Paid">Paid</Select.Option>
                <Select.Option value="Overdue">Overdue</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-zinc-300 text-xs">Salesperson</span>}
              name="salesperson_id"
              rules={[{ required: true, message: "Select salesperson" }]}
            >
              <Select
                placeholder="Select salesperson"
                options={employees.map((e: any) => ({
                  label: e.name,
                  value: e.id,
                }))}
              />
            </Form.Item>

            <Form.Item label={<span className="text-zinc-300 text-xs">Invoice Notes</span>} name="notes">
              <TextArea rows={4} placeholder="Optional notes..." />
            </Form.Item>
          </div>

          <div className="bg-zinc-800 border border-zinc-700/80 p-6 rounded-2xl space-y-3 text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>Subtotal</span>
              <span className="font-bold text-white">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-zinc-300">
              <span>Discount (%)</span>
              <InputNumber
                min={0}
                max={100}
                value={discount}
                onChange={(v) => setDiscount(v || 0)}
                style={{ width: "120px" }}
              />
            </div>

            <div className="flex justify-between items-center text-zinc-300">
              <span>GST (%)</span>
              <Select value={gst} onChange={(v) => setGst(v)} style={{ width: "120px" }}>
                <Select.Option value={0}>0%</Select.Option>
                <Select.Option value={5}>5%</Select.Option>
                <Select.Option value={12}>12%</Select.Option>
                <Select.Option value={18}>18%</Select.Option>
                <Select.Option value={28}>28%</Select.Option>
              </Select>
            </div>

            <div className="flex justify-between items-center text-zinc-300">
              <span>Round Off</span>
              <InputNumber
                value={roundOff}
                onChange={(v) => setRoundOff(v || 0)}
                style={{ width: "120px" }}
              />
            </div>

            <div className="flex justify-between items-center text-zinc-300">
              <span>Deposited Amount</span>
              <InputNumber
                min={0}
                value={deposit}
                onChange={(v) => setDeposit(v || 0)}
                style={{ width: "120px" }}
              />
            </div>

            <div className="border-t border-zinc-700 pt-3 flex justify-between text-base">
              <span className="text-white font-bold">Final Payable</span>
              <span className="text-green-400 font-black">
                ₹{finalPayable.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-800">
          <Button
            htmlType="submit"
            className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 h-10 rounded-xl"
          >
            {editData ? "Update Invoice" : "Save Invoice"}
          </Button>

          <Button
            onClick={() => setOpen(false)}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 h-10 rounded-xl border-zinc-700"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
}