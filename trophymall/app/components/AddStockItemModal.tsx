"use client";

import { Modal, Form, Input, Select, InputNumber, Button } from "antd";
import { useState } from "react";

const { TextArea } = Input;

type AddStockItemModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function AddStockItemModal({
  open,
  setOpen,
}: AddStockItemModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    console.log(values);
    await fetch("http://localhost:5000/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(values),
    });

    setOpen(false);
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
        form={form}
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
            className="bg-green-600 hover:bg-green-700 border-none"
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
