"use client";

import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const { TextArea } = Input;

export default function AddLeadModal({
  open,
  setOpen,
  refresh,
  editData,
}: {
  open: boolean;
  setOpen: any;
  refresh: () => void;
  editData?: any;
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leadStatus, setLeadStatus] = useState("Cold");

  useEffect(() => {
    if (editData) {
      setLeadStatus(editData.lead_status);
      form.setFieldsValue({
        leadName: editData.lead_name,
        contact: editData.contact_number,
        email: editData.email,
        company: editData.company_name,
        leadSource: editData.lead_source,
        product: editData.interested_product,
        employee: editData.assigned_employee,
        leadStatus: editData.lead_status,
        lostReason: editData.lost_reason,
        dateCreated: editData.created_at ? dayjs(editData.created_at) : dayjs(),
        notes: editData.notes,
      });
    } else {
      form.resetFields();
      setLeadStatus("Cold");
      form.setFieldValue("dateCreated", dayjs());
    }
  }, [editData, open, form]);

  const handleSubmit = async (values: any) => {
    const toastId = toast.loading(editData ? "Updating lead..." : "Saving lead...");
    setLoading(true);

    try {
      const payload = {
        lead_name: values.leadName,
        contact_number: values.contact,
        email: values.email,
        company_name: values.company,
        lead_source: values.leadSource,
        interested_product: values.product,
        assigned_employee: values.employee,
        lead_status: values.leadStatus,
        lost_reason: values.leadStatus === "Lost" ? values.lostReason : null,
        created_at: values.dateCreated ? dayjs(values.dateCreated).format("YYYY-MM-DD") : null,
        notes: values.notes || "",
      };

      const endpoint = editData ? `/api/leads/${editData.id}` : "/api/leads";
      const method = editData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editData ? "Lead updated successfully ✅" : "Lead added successfully ✅", { id: toastId });
        form.resetFields();
        setOpen(false);
        refresh();
      } else {
        toast.error(data.error || "Failed to save lead ❌", { id: toastId });
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
      title={editData ? "Edit Lead" : "Add New Lead"}
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
          leadStatus: "Cold",
          dateCreated: dayjs(),
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Lead Name */}
          <Form.Item
            label="Lead Name"
            name="leadName"
            rules={[{ required: true, message: "Please enter lead name" }]}
          >
            <Input placeholder="Enter lead name" />
          </Form.Item>

          {/* Contact */}
          <Form.Item
            label="Contact Number"
            name="contact"
            rules={[{ required: true, message: "Please enter contact number" }]}
          >
            <Input placeholder="+91 98765 43210" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          {/* Company */}
          <Form.Item label="Company Name" name="company">
            <Input placeholder="Company name" />
          </Form.Item>

          {/* Lead Source (Updated with client's options) */}
          <Form.Item
            label="Lead Source"
            name="leadSource"
            rules={[{ required: true, message: "Select lead source" }]}
          >
            <Select placeholder="Select source">
              <Select.Option value="Instagram">Instagram</Select.Option>
              <Select.Option value="Facebook">Facebook</Select.Option>
              <Select.Option value="Website">Website</Select.Option>
              <Select.Option value="Referral">Referral</Select.Option>
              <Select.Option value="Walk-in">Walk-in</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          {/* Interested Product */}
          <Form.Item label="Interested Product / Service" name="product">
            <Input placeholder="e.g. Crystal Trophies" />
          </Form.Item>

          {/* Assigned Employee */}
          <Form.Item
            label="Assigned Employee"
            name="employee"
            rules={[{ required: true, message: "Select employee" }]}
          >
            <Select placeholder="Select employee">
              <Select.Option value="Rahul">Rahul</Select.Option>
              <Select.Option value="Priya">Priya</Select.Option>
            </Select>
          </Form.Item>

          {/* Lead Status (Includes Lost option) */}
          <Form.Item
            label="Lead Status"
            name="leadStatus"
            rules={[{ required: true }]}
          >
            <Select onChange={(val) => setLeadStatus(val)}>
              <Select.Option value="Cold">Cold</Select.Option>
              <Select.Option value="Warm">Warm</Select.Option>
              <Select.Option value="Hot">Hot</Select.Option>
              <Select.Option value="Converted">Converted</Select.Option>
              <Select.Option value="Lost">Lost</Select.Option>
            </Select>
          </Form.Item>

          {/* Conditional Lost Reason Field */}
          {leadStatus === "Lost" && (
            <Form.Item
              label="Lost Reason"
              name="lostReason"
              rules={[{ required: true, message: "Please specify why the lead was lost" }]}
              className="col-span-2"
            >
              <Input placeholder="e.g. High pricing, Went with competitor, etc." />
            </Form.Item>
          )}

          {/* Date */}
          <Form.Item label="Date Created" name="dateCreated">
            <DatePicker style={{ width: "100%" }} />
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
            {editData ? "Update Lead" : "Save Lead"}
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