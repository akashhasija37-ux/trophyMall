"use client"
import { Modal, Form, Input, InputNumber, Select, DatePicker, Button } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

type AddWebsiteOrderProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddWebsiteOrder({ open, setOpen }: AddWebsiteOrderProps) {

  const [form] = Form.useForm();

  const handleSubmit = (values:any) => {
    console.log("Form Values:", values);
    setOpen(false);
    form.resetFields();
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
          orderDate: dayjs()
        }}
        style={{color:'white'}}
      >

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          <Form.Item
            label="Customer Name"
            name="customerName"
            rules={[{ required: true, message: "Please enter customer name" }]}
          >
            <Input placeholder="Customer name" />
          </Form.Item>

          <Form.Item
            label="Contact Details"
            name="contact"
            rules={[
              { required: true, message: "Enter email or phone" }
            ]}
          >
            <Input placeholder="Email or phone" />
          </Form.Item>

          <Form.Item label="Order ID" name="orderId">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Enter product name" }]}
          >
            <Input placeholder="Product name" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Enter quantity" }]}
          >
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Enter price" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="₹"
            />
          </Form.Item>

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

          <Form.Item label="Order Date" name="orderDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Order Status"
            name="orderStatus"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Processing">Processing</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

        </div>

        <Form.Item label="Notes" name="notes">
          <TextArea rows={4} placeholder="Add any additional notes..." />
        </Form.Item>

        <div style={{ display: "flex", gap: 10 }}>

          <Button type="primary" htmlType="submit">
            Save Order
          </Button>

          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

        </div>

      </Form>
    </Modal>
  );
}