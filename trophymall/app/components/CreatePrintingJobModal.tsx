"use client";

import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function CreatePrintingJobModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Printing Job:", values);
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Create New Printing Job"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={900}
      className="dark-order-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: "Medium Priority",
          jobStatus: "Pending",
          startDate: dayjs(),
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Job Title */}

          <Form.Item
            label="Job Title"
            name="jobTitle"
            rules={[{ required: true, message: "Enter job title" }]}
          >
            <Input placeholder="e.g. Trophy Engraving - Corporate Event" />
          </Form.Item>

          {/* Customer */}

          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: "Enter customer name" }]}
          >
            <Input placeholder="Customer name" />
          </Form.Item>

          {/* Order Reference */}

          <Form.Item label="Order Reference" name="orderReference">
            <Input placeholder="ORD-2501" />
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
              <Select.Option value="Amit">Amit</Select.Option>
            </Select>
          </Form.Item>

          {/* Priority */}

          <Form.Item
            label="Priority Level"
            name="priority"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Low Priority">Low Priority</Select.Option>
              <Select.Option value="Medium Priority">
                Medium Priority
              </Select.Option>
              <Select.Option value="High Priority">High Priority</Select.Option>
            </Select>
          </Form.Item>

          {/* Start Date */}

          <Form.Item label="Start Date" name="startDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Deadline */}

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: "Select deadline" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Job Status */}

          <Form.Item
            label="Job Status"
            name="jobStatus"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="On Hold">On Hold</Select.Option>
            </Select>
          </Form.Item>

          {/* Job Description */}

          <Form.Item
            label="Job Description"
            name="description"
            rules={[{ required: true, message: "Enter job description" }]}
            className="col-span-2"
          >
            <TextArea
              rows={5}
              placeholder="Describe the printing job requirements..."
            />
          </Form.Item>
        </div>

        {/* Footer */}

        <div className="flex gap-4 mt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-green-600 hover:bg-green-700 border-none"
          >
            Create Job
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
