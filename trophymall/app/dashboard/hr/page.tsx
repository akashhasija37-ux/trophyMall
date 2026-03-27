"use client";
import { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import {
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  Star,
  Eye,
  Pencil,
  Plus,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const departmentData = [
  { name: "Manufacturing", value: 29 },
  { name: "Sales", value: 22 },
  { name: "Logistics", value: 20 },
  { name: "Design", value: 16 },
  { name: "Management", value: 7 },
  { name: "HR", value: 5 },
];

const performanceData = [
  { range: "90-100%", value: 45 },
  { range: "80-90%", value: 32 },
  { range: "70-80%", value: 18 },
  { range: "Below 70%", value: 5 },
];

const employees = [
  {
    id: "EMP-001",
    name: "Rajesh Kumar",
    dept: "Management",
    role: "Branch Manager",
    branch: "Mumbai HQ",
    status: "Active",
    tasks: "10/12",
    perf: 92,
    initials: "RK",
  },
  {
    id: "EMP-002",
    name: "Priya Sharma",
    dept: "Sales",
    role: "Sales Lead",
    branch: "Delhi Branch",
    status: "Active",
    tasks: "16/18",
    perf: 89,
    initials: "PS",
  },
  {
    id: "EMP-003",
    name: "Amit Patel",
    dept: "Manufacturing",
    role: "Production Head",
    branch: "Bangalore Branch",
    status: "Active",
    tasks: "14/15",
    perf: 93,
    initials: "AP",
  },
  {
    id: "EMP-004",
    name: "Neha Singh",
    dept: "Design",
    role: "Senior Designer",
    branch: "Mumbai HQ",
    status: "Active",
    tasks: "20/22",
    perf: 91,
    initials: "NS",
  },
];

const colors = [
  "#10b981",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
];

export default function HRPage() {
  const [openEmployee, setOpenEmployee] = useState(false);
  const badge: any = {
    Active: "bg-green-500/20 text-green-400",
    "On Leave": "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <div className="p-8 space-y-8">
          {/* HEADER */}

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">HR Management</h1>

              <p className="text-gray-400 text-sm">
                Manage employees, departments, and HR operations
              </p>
            </div>

            <button
              className="flex items-center gap-2 bg-green-600 px-5 py-2 rounded-lg text-white"
              onClick={() => setOpenEmployee(true)}
            >
              <Plus size={18} />
              Add Employee
            </button>
            <AddEmployeeModal open={openEmployee} setOpen={setOpenEmployee} />
          </div>

          {/* STATS */}

          <div className="grid grid-cols-4 gap-6">
            <StatCard
              icon={<Users />}
              title="Total Employees"
              value="110"
              sub="+8 this month"
            />

            <StatCard
              icon={<Briefcase />}
              title="Active Departments"
              value="6"
              sub="Across all branches"
            />

            <StatCard
              icon={<CheckCircle />}
              title="Attendance"
              value="94%"
              sub="Above target"
            />

            <StatCard
              icon={<Clock />}
              title="Pending Tasks"
              value="48"
              sub="Requires attention"
            />
          </div>

          {/* CHARTS */}

          <div className="grid grid-cols-2 gap-6">
            {/* PIE */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">
                Department Distribution
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >
                    {departmentData.map((_, i) => (
                      <Cell key={i} fill={colors[i]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BAR */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">
                Performance Analytics
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid stroke="#333" />

                  <XAxis dataKey="range" stroke="#aaa" />

                  <YAxis stroke="#aaa" />

                  <Tooltip />

                  <Bar dataKey="value" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EMPLOYEE DIRECTORY */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Employee Directory
            </h3>

            <table className="w-full">
              <thead className="text-gray-400 text-sm">
                <tr>
                  <th className="text-left">Employee ID</th>
                  <th className="text-left">Name</th>
                  <th className="text-left">Department</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Branch</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Tasks</th>
                  <th className="text-left">Performance</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((e, i) => (
                  <tr key={i} className="border-t border-zinc-800">
                    <td className="py-4 text-blue-400">{e.id}</td>

                    <td className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-xs text-white">
                        {e.initials}
                      </div>

                      <span className="text-white">{e.name}</span>
                    </td>

                    <td className="text-white">{e.dept}</td>

                    <td className="text-white">{e.role}</td>

                    <td className="text-gray-300">{e.branch}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded text-xs ${badge[e.status]}`}
                      >
                        {e.status}
                      </span>
                    </td>

                    <td className="text-white">{e.tasks}</td>

                    <td className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} />
                      {e.perf}%
                    </td>

                    <td className="flex justify-end gap-3 text-gray-400">
                      <Eye size={18} />
                      <Pencil size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LEAVE REQUEST */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Pending Leave Requests
            </h3>

            <div className="flex justify-between items-center bg-zinc-800 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white">
                  AM
                </div>

                <div>
                  <p className="text-white">Anjali Mehta - Sick Leave</p>

                  <p className="text-gray-400 text-sm">
                    Feb 26–27, 2026 (2 days)
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-red-600 px-4 py-2 rounded text-white">
                  Reject
                </button>

                <button className="bg-green-600 px-4 py-2 rounded text-white">
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, sub }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">
      <div className="text-green-500">{icon}</div>

      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold text-white">{value}</h2>

      <p className="text-green-400 text-sm">{sub}</p>
    </div>
  );
}
