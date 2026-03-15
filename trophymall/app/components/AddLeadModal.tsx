"use client"

import { Modal, Form, Input, Select, DatePicker, Button } from "antd"
import dayjs from "dayjs"

const { TextArea } = Input

export default function AddLeadModal({
  open,
  setOpen
}:{open:boolean,setOpen:any}){

const [form] = Form.useForm()

const handleSubmit = (values:any)=>{
  console.log("Lead Data:",values)
  setOpen(false)
  form.resetFields()
}

return(

<Modal
title="Add New Lead"
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
leadStatus:"Cold",
dateCreated:dayjs()
}}
>

<div className="grid grid-cols-2 gap-6">

{/* Lead Name */}

<Form.Item
label="Lead Name"
name="leadName"
rules={[{required:true,message:"Please enter lead name"}]}
>
<Input placeholder="Enter lead name"/>
</Form.Item>


{/* Contact */}

<Form.Item
label="Contact Number"
name="contact"
rules={[
{required:true,message:"Please enter contact number"}
]}
>
<Input placeholder="+91 98765 43210"/>
</Form.Item>


{/* Email */}

<Form.Item
label="Email"
name="email"
rules={[
{required:true,message:"Please enter email"},
{type:"email",message:"Enter valid email"}
]}
>
<Input placeholder="email@example.com"/>
</Form.Item>


{/* Company */}

<Form.Item
label="Company Name"
name="company"
rules={[{required:true,message:"Please enter company name"}]}
>
<Input placeholder="Company name"/>
</Form.Item>


{/* Lead Source */}

<Form.Item
label="Lead Source"
name="leadSource"
rules={[{required:true,message:"Select lead source"}]}
>
<Select placeholder="Select source">
<Select.Option value="Website">Website</Select.Option>
<Select.Option value="Instagram">Instagram</Select.Option>
<Select.Option value="WhatsApp">WhatsApp</Select.Option>
<Select.Option value="Referral">Referral</Select.Option>
</Select>
</Form.Item>


{/* Interested Product */}

<Form.Item
label="Interested Product / Service"
name="product"
>
<Input placeholder="e.g. Crystal Trophies"/>
</Form.Item>


{/* Assigned Employee */}

<Form.Item
label="Assigned Employee"
name="employee"
rules={[{required:true,message:"Select employee"}]}
>
<Select placeholder="Select employee">
<Select.Option value="Rahul">Rahul</Select.Option>
<Select.Option value="Priya">Priya</Select.Option>
</Select>
</Form.Item>


{/* Lead Status */}

<Form.Item
label="Lead Status"
name="leadStatus"
rules={[{required:true}]}
>
<Select>
<Select.Option value="Cold">Cold</Select.Option>
<Select.Option value="Warm">Warm</Select.Option>
<Select.Option value="Hot">Hot</Select.Option>
</Select>
</Form.Item>


{/* Date */}

<Form.Item
label="Date Created"
name="dateCreated"
>
<DatePicker style={{width:"100%"}}/>
</Form.Item>


{/* Notes */}

<Form.Item
label="Notes"
name="notes"
className="col-span-2"
>
<TextArea
rows={4}
placeholder="Add any additional notes..."
/>
</Form.Item>

</div>


{/* Footer */}

<div className="flex gap-4 mt-4">

<Button
htmlType="submit"
className="bg-green-600 hover:bg-green-700 border-none"
>
Save Lead
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