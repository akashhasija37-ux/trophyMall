"use client";

import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

export default function CreateDispatchModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Dispatch Record:", values);
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Create Dispatch Record"
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
          orderId: "ORD-2501",
          deliveryStatus: "Pending",
          dispatchDate: dayjs(),
        }}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Order ID */}

          <Form.Item
            label="Order ID"
            name="orderId"
            rules={[{ required: true, message: "Order ID required" }]}
          >
            <Input placeholder="ORD-2501" />
          </Form.Item>

          {/* Customer */}

          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: "Enter customer name" }]}
          >
            <Input placeholder="Customer name" />
          </Form.Item>

          {/* Courier */}

          <Form.Item
            label="Courier Partner"
            name="courier"
            rules={[{ required: true, message: "Select courier" }]}
          >
            <Select placeholder="Select courier">
              <Select.Option value="Bluedart">Bluedart</Select.Option>
              <Select.Option value="DTDC">DTDC</Select.Option>
              <Select.Option value="Delhivery">Delhivery</Select.Option>
              <Select.Option value="India Post">India Post</Select.Option>
            </Select>
          </Form.Item>

          {/* Tracking */}

          <Form.Item
            label="Tracking Number"
            name="trackingNumber"
            rules={[{ required: true, message: "Enter tracking number" }]}
          >
            <Input placeholder="BD12345678" />
          </Form.Item>

          {/* Dispatch Date */}

          <Form.Item label="Dispatch Date" name="dispatchDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Delivery Status */}

          <Form.Item
            label="Delivery Status"
            name="deliveryStatus"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Shipped">Shipped</Select.Option>
              <Select.Option value="In Transit">In Transit</Select.Option>
              <Select.Option value="Delivered">Delivered</Select.Option>
              <Select.Option value="Returned">Returned</Select.Option>
            </Select>
          </Form.Item>

          {/* Assigned Staff */}

          <Form.Item label="Assigned Staff" name="staff">
            <Input placeholder="Staff member name" />
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
            Create Dispatch
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
