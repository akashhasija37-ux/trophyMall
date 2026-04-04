"use client";

import { useState, useEffect } from "react";
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
  const [employees, setEmployees] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  const badge: any = {
    active: "bg-green-500/20 text-green-400",
    inactive: "bg-red-500/20 text-red-400",
  };

  // 🔥 FETCH
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();

      setEmployees(data);

      generateDepartmentData(data);
      generatePerformanceData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔥 DEPARTMENT CHART
  const generateDepartmentData = (data: any[]) => {
    const map: any = {};

    data.forEach((emp) => {
      map[emp.department] = (map[emp.department] || 0) + 1;
    });

    const result = Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));

    setDepartmentData(result);
  };

  // 🔥 PERFORMANCE CHART
  const generatePerformanceData = (data: any[]) => {
    const ranges: any = {
      "90-100%": 0,
      "80-90%": 0,
      "70-80%": 0,
      "Below 70%": 0,
    };

    data.forEach((emp) => {
      const perf = emp.performance || 75;

      if (perf >= 90) ranges["90-100%"]++;
      else if (perf >= 80) ranges["80-90%"]++;
      else if (perf >= 70) ranges["70-80%"]++;
      else ranges["Below 70%"]++;
    });

    setPerformanceData(
      Object.keys(ranges).map((key) => ({
        range: key,
        value: ranges[key],
      })),
    );
  };

  // 🔥 STATS
  const totalEmployees = employees.length;
  const departmentsCount = [...new Set(employees.map((e) => e.department))]
    .length;

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
              value={totalEmployees}
              sub="Live data"
            />

            <StatCard
              icon={<Briefcase />}
              title="Active Departments"
              value={departmentsCount}
              sub="From DB"
            />

            <StatCard
              icon={<CheckCircle />}
              title="Attendance"
              value="94%"
              sub="Static for now"
            />

            <StatCard
              icon={<Clock />}
              title="Pending Tasks"
              value="48"
              sub="Static for now"
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
                      <Cell key={i} fill={colors[i % colors.length]} />
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

          {/* EMPLOYEE TABLE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Employee Directory
            </h3>

            <table className="w-full border-collapse">
              <thead className="text-gray-400 text-sm">
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-2">Employee ID</th>
                  <th className="text-left py-3 px-2">Name</th>
                  <th className="text-left py-3 px-2">Department</th>
                  <th className="text-left py-3 px-2">Role</th>
                  <th className="text-left py-3 px-2">Branch</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Performance</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((e, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-800 hover:bg-zinc-800/40"
                  >
                    <td className="py-4 px-2 text-blue-400">
                      {`EMP-${1000 + e.id}`}
                    </td>

                    <td className="py-4 px-2 text-white">{e.name}</td>

                    <td className="py-4 px-2 text-white">{e.department}</td>

                    <td className="py-4 px-2 text-white">{e.role}</td>

                    <td className="py-4 px-2 text-gray-300">{e.branch}</td>

                    <td className="py-4 px-2">
                      <span
                        className={`px-3 py-1 rounded text-xs ${
                          e.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>

                    <td className="py-4 px-2 text-yellow-400 flex items-center gap-1">
                      ⭐ {e.performance || 75}%
                    </td>

                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-3 text-gray-400">
                        <Eye
                          size={18}
                          className="cursor-pointer hover:text-white"
                        />
                        <Pencil
                          size={18}
                          className="cursor-pointer hover:text-green-400"
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {!employees.length && (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* LEAVE (kept same) */}
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
