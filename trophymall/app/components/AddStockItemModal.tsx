"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import toast from "react-hot-toast";

const { TextArea } = Input;

export default function AddStockItemModal({
  open,
  setOpen,
  refresh,
}: any) {
  const [antdForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [featuredImage, setFeaturedImage] = useState<any>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // 🔥 SUBMIT
 const handleSubmit = async (values: any) => {
  const toastId = toast.loading("Adding product...");
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("name", values.productName);
    formData.append("sku", values.sku);
    formData.append("tm_code", values.tmCode || "");
    formData.append("discount", values.discount || 0);
    formData.append("category", values.customCategory || values.category);
    formData.append("quantity", values.quantity || 0);
    formData.append("purchase_price", values.purchasePrice || 0);
    formData.append("selling_price", values.sellingPrice || 0);
    formData.append("supplier", values.supplier || "");
    formData.append("stock_status", values.stockStatus);
    formData.append("height", values.height || 0);
    formData.append("width", values.width || 0);
    formData.append("weight", values.weight || 0);
    formData.append("badge", values.badge || "");
    formData.append("notes", values.notes || "");

    // 🔥 FILES
    if (featuredImage) {
      formData.append("featured_image", featuredImage);
    }

    galleryImages.forEach((file) => {
      formData.append("gallery_images", file);
    });

    const res = await fetch("/api/inventory", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Product added ✅", { id: toastId });
      antdForm.resetFields();
      setOpen(false);
      refresh();
    } else {
      toast.error(data.error || "Failed ❌", { id: toastId });
    }

  } catch (err) {
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
      width={1100}
      className="dark-ant-modal"
    >
      <Form
        form={antdForm}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          category: "Finished Goods",
          stockStatus: "In Stock",
          discount: 0,
        }}
      >
        <div className="grid grid-cols-2 gap-6">

          {/* PRODUCT NAME */}
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* SKU */}
          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* 🔥 TM CODE */}
          <Form.Item label="TM Code" name="tmCode">
            <Input placeholder="Internal tracking code (TM-001)" />
          </Form.Item>

          {/* 🔥 DISCOUNT */}
          <Form.Item label="Discount (%)" name="discount">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          {/* CATEGORY */}
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="Finished Goods">Finished Goods</Select.Option>
              <Select.Option value="Raw Material">Raw Material</Select.Option>
              <Select.Option value="Accessories">Accessories</Select.Option>
            </Select>
          </Form.Item>

          {/* CUSTOM CATEGORY */}
          <Form.Item label="Custom Category" name="customCategory">
            <Input placeholder="Optional custom category" />
          </Form.Item>

          {/* QUANTITY */}
          <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* BADGE */}
          <Form.Item label="Product Badge" name="badge">
            <Select allowClear>
              <Select.Option value="New">New</Select.Option>
              <Select.Option value="Trending">Trending</Select.Option>
              <Select.Option value="Bestseller">Bestseller</Select.Option>
            </Select>
          </Form.Item>

          {/* DIMENSIONS */}
          <Form.Item label="Height (cm)" name="height">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Width (cm)" name="width">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Weight (kg)" name="weight">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* PRICES */}
          <Form.Item label="Purchase Price (₹)" name="purchasePrice">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Selling Price (₹)" name="sellingPrice">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          {/* SUPPLIER */}
          <Form.Item label="Supplier" name="supplier">
            <Input />
          </Form.Item>

          {/* STATUS */}
          <Form.Item label="Stock Status" name="stockStatus">
            <Select>
              <Select.Option value="In Stock">In Stock</Select.Option>
              <Select.Option value="Low Stock">Low Stock</Select.Option>
              <Select.Option value="Out of Stock">Out of Stock</Select.Option>
            </Select>
          </Form.Item>

          {/* FEATURED IMAGE */}
          <Form.Item label="Featured Image">
            <Upload
              beforeUpload={(file) => {
                setFeaturedImage(file);
                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          {/* GALLERY */}
          <Form.Item label="Gallery Images" className="col-span-2">
            <Upload
              multiple
              beforeUpload={(file) => {
                setGalleryImages((prev) => [...prev, file]);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Multiple</Button>
            </Upload>
          </Form.Item>

          {/* NOTES */}
          <Form.Item label="Notes" name="notes" className="col-span-2">
            <TextArea rows={4} />
          </Form.Item>

        </div>

        {/* FOOTER */}
        <div className="flex gap-4 mt-4">
          <Button
            htmlType="submit"
            loading={loading}
            className="bg-green-600 text-white"
          >
            Add Product
          </Button>

          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
}