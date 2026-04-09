"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import CreatePrintingJobModal from "../../components/CreatePrintingJobModal";
import { Plus, User, Clock, MoreVertical } from "lucide-react";

export default function PrintingWorkflowPage() {
  const [openPrinting, setOpenPrinting] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  // ✅ FILTER STATES
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/printing-jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Printing Jobs API Error:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ MAP JOB
  const mapJob = (j: any) => ({
    id: j.id,
    code: "JOB-" + j.id,
    title: j.job_title,
    client: j.customer_name,
    priority: (j.priority_level || "low").toLowerCase(),
    assignee: j.assigned_employee || "-",
    deadline: j.deadline ? new Date(j.deadline).toLocaleDateString() : "-",
  });

  // ✅ FILTER LOGIC
  const applyFilters = (list: any[]) => {
    return list.filter((j) => {
      const priorityMatch =
        priorityFilter === "all" ||
        (j.priority || "").toLowerCase() === priorityFilter;

      const assigneeMatch =
        assigneeFilter === "all" || j.assignee === assigneeFilter;

      return priorityMatch && assigneeMatch;
    });
  };

  const dynamicWorkflow = {
    pending: applyFilters(
      jobs.filter((j) => j.job_status === "Pending").map(mapJob),
    ),

    design: applyFilters(
      jobs.filter((j) => j.job_status === "Designing").map(mapJob),
    ),

    printing: applyFilters(
      jobs.filter((j) => j.job_status === "Printing").map(mapJob),
    ),

    qc: applyFilters(
      jobs.filter((j) => j.job_status === "Quality Check").map(mapJob),
    ),
  };

  // ✅ UPDATE STATUS
  const updateJobStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/update-job-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      fetchJobs(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ASSIGN EMPLOYEE
  const assignEmployee = async (id: number, employee: string) => {
    await fetch("/api/assign-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, employee }),
    });

    fetchJobs();
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
              <h1 className="text-3xl font-bold text-white">
                Printing Workflow
              </h1>
              <p className="text-gray-400 text-sm">
                Manage printing jobs across all stages
              </p>
            </div>

            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
              onClick={() => setOpenPrinting(true)}
            >
              <Plus size={18} />
              New Job
            </button>

            <CreatePrintingJobModal
              open={openPrinting}
              setOpen={setOpenPrinting}
              refresh={fetchJobs}
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-4">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="bg-zinc-800 px-4 py-2 rounded-lg text-white"
            >
              <option value="all">All Assignees</option>
              {[...new Set(jobs.map((j) => j.assigned_employee))]
                .filter(Boolean)
                .map((a, i) => (
                  <option key={i} value={a}>
                    {a}
                  </option>
                ))}
            </select>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-4 gap-6">
            <Stat
              title="Pending"
              value={dynamicWorkflow.pending.length}
              color="bg-gray-400"
            />
            <Stat
              title="Design"
              value={dynamicWorkflow.design.length}
              color="bg-blue-500"
            />
            <Stat
              title="Printing"
              value={dynamicWorkflow.printing.length}
              color="bg-purple-500"
            />
            <Stat
              title="QC"
              value={dynamicWorkflow.qc.length}
              color="bg-yellow-500"
            />
          </div>

          {/* WORKFLOW */}
          <div className="grid grid-cols-4 gap-6">
            <Column
              title="Pending"
              color="bg-gray-400"
              jobs={dynamicWorkflow.pending}
              updateJobStatus={updateJobStatus}
              assignEmployee={assignEmployee}
            />
            <Column
              title="In Design"
              color="bg-blue-500"
              jobs={dynamicWorkflow.design}
              updateJobStatus={updateJobStatus}
              assignEmployee={assignEmployee}
            />
            <Column
              title="Printing"
              color="bg-purple-500"
              jobs={dynamicWorkflow.printing}
              updateJobStatus={updateJobStatus}
              assignEmployee={assignEmployee}
            />
            <Column
              title="Quality Check"
              color="bg-yellow-500"
              jobs={dynamicWorkflow.qc}
              updateJobStatus={updateJobStatus}
              assignEmployee={assignEmployee}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔥 COLUMN
function Column({ title, color, jobs, updateJobStatus, assignEmployee }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="text-white font-semibold">{title}</h3>
          <span className="text-gray-400 text-sm">{jobs.length}</span>
        </div>
      </div>

      {jobs.map((job: any, i: number) => (
        <JobCard
          key={i}
          job={job}
          updateJobStatus={updateJobStatus}
          assignEmployee={assignEmployee}
        />
      ))}
    </div>
  );
}

// 🔥 JOB CARD
function JobCard({ job, updateJobStatus, assignEmployee }: any) {
  const badge: any = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between">
        <p className="text-blue-400 text-sm">{job.code}</p>
        <MoreVertical size={16} className="text-gray-400" />
      </div>

      <h4 className="text-white">{job.title}</h4>
      <p className="text-gray-400 text-sm">{job.client}</p>

      <span className={`px-2 py-1 text-xs rounded ${badge[job.priority]}`}>
        {job.priority}
      </span>

      <select
        value={job.assignee}
        onChange={(e) => assignEmployee(job.id, e.target.value)}
        className="bg-zinc-700 text-white text-xs px-2 py-1 rounded w-full"
      >
        <option value="-">Unassigned</option>
        <option>John D.</option>
        <option>Sarah M.</option>
        <option>Mike R.</option>
      </select>

      <div className="flex gap-2">
        <button
          onClick={() => updateJobStatus(job.id, "Printing")}
          className="text-xs bg-purple-600 px-2 py-1 rounded"
        >
          → Printing
        </button>

        <button
          onClick={() => updateJobStatus(job.id, "Completed")}
          className="text-xs bg-yellow-600 px-2 py-1 rounded"
        >
          → QC
        </button>
      </div>

      <div className="flex justify-between text-gray-400 text-sm">
        <div className="flex items-center gap-1">
          <User size={14} />
          {job.assignee}
        </div>

        <div className="flex items-center gap-1">
          <Clock size={14} />
          {job.deadline}
        </div>
      </div>
    </div>
  );
}

// 🔥 STAT
function Stat({ title, value, color }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
      <h2 className="text-white text-2xl font-bold">{value}</h2>
    </div>
  );
}
