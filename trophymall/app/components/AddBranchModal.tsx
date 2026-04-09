import { Modal, Form, Input } from "antd"

export default function AddBranchModal({ open, setOpen, refresh }: any) {
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    const values = await form.validateFields()

    await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    })

    setOpen(false)
    form.resetFields()
    refresh()
  }

  return (
    <Modal
      title="Add Branch"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleSubmit}
      className="dark-ant-modal"
    >
      <Form form={form} layout="vertical">

  <Form.Item name="name" label="Branch Name" required>
    <Input className="bg-zinc-800 text-white" />
  </Form.Item>

  <Form.Item name="location" label="Location">
    <Input className="bg-zinc-800 text-white" />
  </Form.Item>

  <Form.Item name="manager" label="Manager">
    <Input className="bg-zinc-800 text-white" />
  </Form.Item>

  <Form.Item name="staff_count" label="Staff Count">
    <Input type="number" className="bg-zinc-800 text-white" />
  </Form.Item>

  <Form.Item name="total_orders" label="Total Orders">
    <Input type="number" className="bg-zinc-800 text-white" />
  </Form.Item>

  <Form.Item name="revenue" label="Revenue">
    <Input type="number" className="bg-zinc-800 text-white" />
  </Form.Item>

  <Form.Item name="performance" label="Performance (%)">
    <Input type="number" className="bg-zinc-800 text-white" />
  </Form.Item>

</Form>
    </Modal>
  )
}