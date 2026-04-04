"use client";

import { Modal, Form, Input, Select, DatePicker, Checkbox, Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddEmployeeModal({ open, setOpen }: any) {
  const [form] = Form.useForm();

  const [departments, setDepartments] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch dropdown data
  const fetchMeta = async () => {
    try {
      const res = await axios.get("/api/meta");
      setDepartments(res.data.departments);
      setBranches(res.data.branches);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) fetchMeta();
  }, [open]);

  // 🔥 Submit
  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const permissionsObject = {
        dashboard: values.permissions?.includes("dashboard"),
        orders: values.permissions?.includes("orders"),
        invoices: values.permissions?.includes("invoices"),
        inventory: values.permissions?.includes("inventory"),
        reports: values.permissions?.includes("reports"),
        settings: values.permissions?.includes("settings"),
      };

      await axios.post("/api/employees", {
        name: values.employeeName,
        contact: values.contact,
        role: values.role,
        department: values.department,
        branch: values.branch,
        joining_date: values.joiningDate.format("YYYY-MM-DD"),
        permissions: permissionsObject,
      });

      toast.success("Employee created 🎉");

      form.resetFields();
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Error creating employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Employee"
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
          joiningDate: dayjs(),
        }}
      >
        <div className="grid grid-cols-2 gap-6">

          <Form.Item
            label="Employee Name"
            name="employeeName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>

          <Form.Item
            label="Contact Details"
            name="contact"
            rules={[{ required: true }]}
          >
            <Input placeholder="Email or phone" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., Manager" />
          </Form.Item>

          {/* ✅ Dynamic Department */}
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Department">
              {departments.map((d) => (
                <Select.Option key={d.id} value={d.name}>
                  {d.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* ✅ Dynamic Branch */}
          <Form.Item
            label="Branch"
            name="branch"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Branch">
              {branches.map((b) => (
                <Select.Option key={b.id} value={b.name}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Joining Date"
            name="joiningDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Permissions */}
          <Form.Item
            label="Access Permissions"
            name="permissions"
            className="col-span-2"
          >
            <Checkbox.Group className="flex flex-col gap-2">
              <Checkbox value="dashboard">View Dashboard</Checkbox>
              <Checkbox value="orders">Manage Orders</Checkbox>
              <Checkbox value="invoices">Create Invoices</Checkbox>
              <Checkbox value="inventory">Manage Inventory</Checkbox>
              <Checkbox value="reports">View Reports</Checkbox>
              <Checkbox value="settings">System Settings</Checkbox>
            </Checkbox.Group>
          </Form.Item>

        </div>

        <div className="flex gap-4 mt-4">
          <Button
            htmlType="submit"
            loading={loading}
            className="bg-green-600 text-white border-none"
          >
            Add Employee
          </Button>

          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
}