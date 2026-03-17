"use client";

import { Modal, Form, Input, Select, InputNumber, Button } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";

const { TextArea } = Input;

type AddStockItemModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void; // 🔥 important for updating UI
};

export default function AddStockItemModal({
  open,
  setOpen,
  refresh,
}: AddStockItemModalProps) {
  const [antdForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 🔥 Submit handler
  const handleSubmit = async (values: any) => {
    const toastId = toast.loading("Adding product...");

    setLoading(true);

    try {
      const payload = {
        name: values.productName,
        sku: values.sku,
        category: values.category,
        quantity: values.quantity,
        purchase_price: values.purchasePrice || 0,
        selling_price: values.sellingPrice || 0,
        supplier: values.supplier || "",
        stock_status: values.stockStatus,
        notes: values.notes || "",
      };

      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product added successfully ✅", { id: toastId });

        antdForm.resetFields();
        setOpen(false);
        refresh(); // 🔥 update table instantly
      } else {
        toast.error(data.error || "Failed to add product ❌", {
          id: toastId,
        });
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
      title="Add Stock Item"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={900}
      className="dark-ant-modal"
    >
      <Form
        form={antdForm}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          category: "Finished Goods",
          stockStatus: "In Stock",
          quantity: 0,
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Product Name */}
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Enter product name" }]}
          >
            <Input placeholder="Product name" />
          </Form.Item>

          {/* SKU */}
          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "Enter SKU" }]}
          >
            <Input placeholder="e.g. TRP-CRY-001" />
          </Form.Item>

          {/* Category */}
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Finished Goods">
                Finished Goods
              </Select.Option>
              <Select.Option value="Raw Material">Raw Material</Select.Option>
              <Select.Option value="Accessories">Accessories</Select.Option>
            </Select>
          </Form.Item>

          {/* Quantity */}
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Enter quantity" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* Purchase Price */}
          <Form.Item label="Purchase Price (₹)" name="purchasePrice">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" />
          </Form.Item>

          {/* Selling Price */}
          <Form.Item label="Selling Price (₹)" name="sellingPrice">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="0.00" />
          </Form.Item>

          {/* Supplier */}
          <Form.Item label="Supplier" name="supplier">
            <Input placeholder="Supplier name" />
          </Form.Item>

          {/* Stock Status */}
          <Form.Item label="Stock Status" name="stockStatus">
            <Select>
              <Select.Option value="In Stock">In Stock</Select.Option>
              <Select.Option value="Low Stock">Low Stock</Select.Option>
              <Select.Option value="Out of Stock">Out of Stock</Select.Option>
            </Select>
          </Form.Item>

          {/* Notes */}
          <Form.Item label="Notes" name="notes" className="col-span-2">
            <TextArea rows={4} placeholder="Add any additional notes..." />
          </Form.Item>
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-4">
          <Button
            htmlType="submit"
            loading={loading}
            className="bg-green-600 hover:bg-green-700 border-none text-white"
          >
            Add Stock
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
