"use client"

import { Modal, Form, Input, Select, DatePicker, Checkbox, Button } from "antd"
import dayjs from "dayjs"

export default function AddEmployeeModal({
open,
setOpen
}:{open:boolean,setOpen:any}){

const [form] = Form.useForm()

const handleSubmit=(values:any)=>{

console.log("Employee Data:",values)

setOpen(false)

form.resetFields()

}

return(

<Modal
title="Add New Employee"
open={open}
onCancel={()=>setOpen(false)}
footer={null}
width={900}
className="dark-ant-modal"
>

<Form
form={form}
layout="vertical"
onFinish={handleSubmit}
initialValues={{
department:"Management",
branch:"Mumbai HQ",
joiningDate:dayjs()
}}
>

<div className="grid grid-cols-2 gap-6">

{/* Employee Name */}

<Form.Item
label="Employee Name"
name="employeeName"
rules={[{required:true,message:"Enter employee name"}]}
>
<Input placeholder="Full name"/>
</Form.Item>


{/* Contact */}

<Form.Item
label="Contact Details"
name="contact"
rules={[{required:true,message:"Enter contact details"}]}
>
<Input placeholder="Email or phone"/>
</Form.Item>


{/* Role */}

<Form.Item
label="Role"
name="role"
rules={[{required:true,message:"Enter role"}]}
>
<Input placeholder="e.g., Branch Manager"/>
</Form.Item>


{/* Department */}

<Form.Item
label="Department"
name="department"
rules={[{required:true}]}
>
<Select>
<Select.Option value="Management">Management</Select.Option>
<Select.Option value="Sales">Sales</Select.Option>
<Select.Option value="Production">Production</Select.Option>
<Select.Option value="Accounts">Accounts</Select.Option>
</Select>
</Form.Item>


{/* Branch */}

<Form.Item
label="Branch"
name="branch"
rules={[{required:true}]}
>
<Select>
<Select.Option value="Mumbai HQ">Mumbai HQ</Select.Option>
<Select.Option value="Delhi Branch">Delhi Branch</Select.Option>
<Select.Option value="Pune Branch">Pune Branch</Select.Option>
</Select>
</Form.Item>


{/* Joining Date */}

<Form.Item
label="Joining Date"
name="joiningDate"
rules={[{required:true}]}
>
<DatePicker style={{width:"100%"}}/>
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


{/* Footer */}

<div className="flex gap-4 mt-4">

<Button
htmlType="submit"
className="bg-green-600 hover:bg-green-700 border-none"
>
Add Employee
</Button>

<Button
onClick={()=>setOpen(false)}
className="bg-zinc-700 text-white border-none"
>
Cancel
</Button>

</div>

</Form>

</Modal>

)
}