"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
} from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const { Option } = Select;
const { TextArea } = Input;

type AddWebsiteOrderProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
};

export default function AddWebsiteOrder({
  open,
  setOpen,
  refresh,
}: AddWebsiteOrderProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // ✅ FETCH DATA
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
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

  // ✅ HANDLE SUBMIT
  const handleSubmit = async (values: any) => {
    // 🔥 STOCK VALIDATION
    if (values.quantity > selectedProduct?.quantity) {
      toast.error("❌ Not enough stock available");
      return;
    }

    const toastId = toast.loading("Saving order...");
    setLoading(true);

    try {
      const payload = {
        customer_id: selectedCustomer?.id,
        product_id: selectedProduct?.id,
        quantity: values.quantity,
        price: selectedProduct?.price,
        payment_status: values.paymentStatus,
        order_status: values.orderStatus,
        order_date: values.orderDate
          ? dayjs(values.orderDate).format("YYYY-MM-DD")
          : null,
        notes: values.notes || "",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Order created successfully ✅", { id: toastId });

        form.resetFields();
        setSelectedCustomer(null);
        setSelectedProduct(null);

        setOpen(false);
        refresh();
      } else {
        toast.error(data.error || "Failed ❌", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error ❌", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Website Order"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
      className="dark-ant-modal"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          orderId: "Auto-generated",
          paymentStatus: "Pending",
          orderStatus: "Pending",
          orderDate: dayjs(),
        }}
        style={{ color: "white" }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {/* ✅ CUSTOMER SELECT */}
          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Customer"
              onChange={(value) => {
                const selected = customers.find((c) => c.id === value);
                setSelectedCustomer(selected);

                // ✅ AUTO FILL CONTACT
                form.setFieldsValue({
                  contact: selected?.phone,
                });
              }}
              style={{ color: "white" }}
            >
              {customers.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* ✅ CONTACT AUTO */}
          <Form.Item
            label="Contact Details"
            name="contact"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item label="Order ID" name="orderId">
            <Input disabled />
          </Form.Item>

          {/* ✅ PRODUCT SELECT */}
          <Form.Item
            label="Product Name"
            name="product_id"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select product"
              onChange={(value) => {
                const product = products.find((p: any) => p.id === value);
                setSelectedProduct(product);

                // Reset quantity
                setQuantity(0);

                // Reset price
                form.setFieldsValue({ price: 0 });
              }}
            >
              {products.map((p: any) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.quantity})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* ✅ QUANTITY */}
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true }]}
           
          >
            <InputNumber
              style={{ width: "100%", color:'white' }}
              className="valstyle"
              min={1}
              onChange={(val: any) => {
                setQuantity(val);

                if (selectedProduct) {
                  const total = val * selectedProduct.selling_price;

                  form.setFieldsValue({
                    price: total,
                  });
                }
              }}
            />
          </Form.Item>

          {/* ✅ PRICE AUTO */}
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} className="valstyle" min={0} disabled color="white" />
          </Form.Item>

          {/* ✅ PAYMENT */}
          <Form.Item
            label="Payment Status"
            name="paymentStatus"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Paid">Paid</Option>
              <Option value="Failed">Failed</Option>
            </Select>
          </Form.Item>

          {/* ✅ DATE */}
          <Form.Item label="Order Date" name="orderDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* ✅ STATUS */}
          <Form.Item
            label="Order Status"
            name="orderStatus"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Shipped">Shipped</Option>
              <Option value="Delivered">Delivered</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
        </div>

        {/* NOTES */}
        <Form.Item label="Notes" name="notes">
          <TextArea rows={4} placeholder="Add any additional notes..." />
        </Form.Item>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            htmlType="submit"
            loading={loading}
            className="bg-green-600 hover:bg-green-700 border-none text-white"
          >
            Save Order
          </Button>

          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </Form>
    </Modal>
  );
}
