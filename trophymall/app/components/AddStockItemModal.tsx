"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  DatePicker,
  Switch,
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

  const handleSubmit = async (values: any) => {
    const toastId = toast.loading("Adding product...");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", values.productName || "");
      formData.append("sku", values.sku || "");
      formData.append("barcode", values.barcode || "");
      formData.append("tm_code", values.tmCode || "");
      formData.append("category", values.customCategory || values.category || "");
      formData.append("sub_category", values.subCategory || "");
      formData.append("quantity", String(values.quantity || 0));

      formData.append("purchase_price", String(values.purchasePrice || 0));
      formData.append("selling_price", String(values.sellingPrice || 0));
      formData.append("discount", String(values.discount || 0));

      formData.append("supplier", values.supplier || "");
      formData.append("purchased_from", values.purchasedFrom || "");
      formData.append("invoice_no", values.invoiceNo || "");

      formData.append("warehouse", values.warehouse || "");
      formData.append("branch", values.branch || "");
      formData.append("rack_location", values.rackLocation || "");

      formData.append("stock_status", values.stockStatus || "");
      formData.append("inventory_condition", values.inventoryCondition || "");

      formData.append("height", String(values.height || 0));
      formData.append("width", String(values.width || 0));
      formData.append("weight", String(values.weight || 0));
      formData.append("product_size", values.productSize || "");
      formData.append("base_print_size", values.basePrintSize || "");

      formData.append("badge", values.badge || "");
      formData.append("notes", values.notes || "");

      formData.append("offer_price", String(values.offerPrice || 0));
      formData.append("is_offer_product", String(values.isOfferProduct || false));

      formData.append("is_featured", String(values.isFeatured || false));
      formData.append("is_homepage_product", String(values.isHomepageProduct || false));
      formData.append("is_special_product", String(values.isSpecialProduct || false));

      formData.append("is_customizable", String(values.isCustomizable || false));
      formData.append("customization_charge", String(values.customizationCharge || 0));

      formData.append("is_clearance_sale", String(values.isClearanceSale || false));
      formData.append("clearance_price", String(values.clearancePrice || 0));

      formData.append("damage_qty", String(values.damageQty || 0));
      formData.append("damage_reason", values.damageReason || "");

      formData.append("order_count", String(values.orderCount || 0));
      formData.append("view_count", String(values.viewCount || 0));

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
        refresh?.();
      } else {
        toast.error(data.error || "Failed ❌", { id: toastId });
      }
    } catch (error) {
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
      width={1400}
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
        <div className="grid grid-cols-2 gap-4">

          <Form.Item label="Product Name" name="productName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="SKU" name="sku" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Barcode" name="barcode">
            <Input />
          </Form.Item>

          <Form.Item label="TM Code" name="tmCode">
            <Input />
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Input />
          </Form.Item>

          <Form.Item label="Sub Category" name="subCategory">
            <Input />
          </Form.Item>

          <Form.Item label="Custom Category" name="customCategory">
            <Input />
          </Form.Item>

          <Form.Item label="Quantity" name="quantity">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Purchase Price" name="purchasePrice">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Selling Price" name="sellingPrice">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Discount %" name="discount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Supplier" name="supplier">
            <Input />
          </Form.Item>

          <Form.Item label="Purchased From" name="purchasedFrom">
            <Input />
          </Form.Item>

          <Form.Item label="Invoice No" name="invoiceNo">
            <Input />
          </Form.Item>

          <Form.Item label="Warehouse" name="warehouse">
            <Input />
          </Form.Item>

          <Form.Item label="Branch" name="branch">
            <Input />
          </Form.Item>

          <Form.Item label="Rack Location" name="rackLocation">
            <Input />
          </Form.Item>

          <Form.Item label="Stock Status" name="stockStatus">
            <Select options={[{value:"In Stock"},{value:"Low Stock"},{value:"Out of Stock"}]} />
          </Form.Item>

          <Form.Item label="Inventory Condition" name="inventoryCondition">
            <Select options={[
              {value:"new",label:"New Arrival"},
              {value:"damaged",label:"Damaged"},
              {value:"dead",label:"Dead Stock"},
              {value:"demanded",label:"Most Demanded"},
            ]} />
          </Form.Item>

          <Form.Item label="Height" name="height">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Width" name="width">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Weight" name="weight">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Product Size" name="productSize">
            <Input />
          </Form.Item>

          <Form.Item label="Base Print Size" name="basePrintSize">
            <Input />
          </Form.Item>

          <Form.Item label="Offer Product" name="isOfferProduct" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Offer Price" name="offerPrice">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Featured Product" name="isFeatured" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Homepage Product" name="isHomepageProduct" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Special Product" name="isSpecialProduct" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Customizable Product" name="isCustomizable" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Customization Charge" name="customizationCharge">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Clearance Sale" name="isClearanceSale" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Clearance Price" name="clearancePrice">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Damage Qty" name="damageQty">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Damage Reason" name="damageReason">
            <Input />
          </Form.Item>

          <Form.Item label="Order Count" name="orderCount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="View Count" name="viewCount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Featured Image">
            <Upload beforeUpload={(file) => { setFeaturedImage(file); return false; }} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Badge" name="badge">
            <Input />
          </Form.Item>

          <Form.Item label="Gallery Images" className="col-span-2">
            <Upload multiple beforeUpload={(file) => { setGalleryImages((p) => [...p, file]); return false; }}>
              <Button icon={<UploadOutlined />}>Upload Multiple</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Notes" name="notes" className="col-span-2">
            <TextArea rows={4} />
          </Form.Item>
        </div>

        <div className="flex gap-4 mt-4">
          <Button htmlType="submit" loading={loading} type="primary">
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
