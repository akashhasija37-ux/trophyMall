"use client";
import { useState, useEffect } from "react"; // ✅ added
import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import CreatePrintingJobModal from "../../components/CreatePrintingJobModal";
import { Plus, User, Clock, MoreVertical } from "lucide-react";

const workflow = {
  pending: [
    {
      id: "JOB-101",
      title: "Trophy Engraving - Corporate Event",
      client: "Acme Corp",
      priority: "high",
      assignee: "John D.",
      deadline: "Today",
    },
    {
      id: "JOB-102",
      title: "Metal Badges - 50 Units",
      client: "Tech Solutions",
      priority: "medium",
      assignee: "Sarah M.",
      deadline: "Tomorrow",
    },
  ],

  design: [
    {
      id: "JOB-103",
      title: "Custom Plaques - Award Ceremony",
      client: "Global Traders",
      priority: "high",
      assignee: "Mike R.",
      deadline: "Today",
    },
  ],

  printing: [
    {
      id: "JOB-104",
      title: "UV Printed Trophies - Sports Event",
      client: "Sports Club",
      priority: "medium",
      assignee: "Emma K.",
      deadline: "2 days",
    },
    {
      id: "JOB-105",
      title: "Laser Engraving - Medals",
      client: "School District",
      priority: "low",
      assignee: "Tom H.",
      deadline: "3 days",
    },
  ],

  qc: [
    {
      id: "JOB-106",
      title: "Crystal Awards - Executive Batch",
      client: "Prime Industries",
      priority: "high",
      assignee: "Lisa P.",
      deadline: "Today",
    },
  ],
};

export default function PrintingWorkflowPage() {
  const [openPrinting, setOpenPrinting] = useState(false);

  // ✅ NEW STATE
  const [jobs, setJobs] = useState<any[]>([]);

  // ✅ FETCH API
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

  // ✅ MAP DB → UI WORKFLOW
  const dynamicWorkflow = {
    pending: jobs
      .filter((j) => j.job_status === "Pending")
      .map(mapJob),

    design: jobs
      .filter((j) => j.job_status === "Designing")
      .map(mapJob),

    printing: jobs
      .filter((j) => j.job_status === "Printing")
      .map(mapJob),

    qc: jobs
      .filter((j) => j.job_status === "Completed")
      .map(mapJob),
  };

  // ✅ fallback (if no data)
  const finalWorkflow =
    jobs.length > 0 ? dynamicWorkflow : workflow;

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
              refresh={fetchJobs} // ✅ added
            />
          </div>

          {/* FILTERS */}

          <div className="flex gap-4">
            <select className="bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select className="bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <option>All Assignees</option>
            </select>

            <select className="bg-zinc-800 px-4 py-2 rounded-lg text-white">
              <option>All Time</option>
            </select>
          </div>

          {/* WORKFLOW BOARD */}

          <div className="grid grid-cols-4 gap-6">
            <Column
              title="Pending"
              color="bg-gray-400"
              jobs={finalWorkflow.pending}
            />

            <Column
              title="In Design"
              color="bg-blue-500"
              jobs={finalWorkflow.design}
            />

            <Column
              title="Printing"
              color="bg-purple-500"
              jobs={finalWorkflow.printing}
            />

            <Column
              title="Quality Check"
              color="bg-yellow-500"
              jobs={finalWorkflow.qc}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ HELPER FUNCTION (added)
function mapJob(j: any) {
  return {
    id: "JOB-" + j.id,
    title: j.job_title,
    client: j.customer_name,
    priority: (j.priority_level || "low").toLowerCase(),
    assignee: j.assigned_employee || "-",
    deadline: j.deadline
      ? new Date(j.deadline).toLocaleDateString()
      : "-",
  };
}

function Column({ title, color, jobs }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
      {/* COLUMN HEADER */}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />

          <h3 className="text-white font-semibold">{title}</h3>

          <span className="text-gray-400 text-sm">{jobs.length}</span>
        </div>

        <Plus className="text-gray-400 cursor-pointer" size={16} />
      </div>

      {/* JOB CARDS */}

      {jobs.map((job: any, index: number) => (
        <JobCard key={index} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: any) {
  const badge: any = {
    high: "bg-red-500/20 text-red-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    low: "bg-blue-500/20 text-blue-400",
  };

  return (
    <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <p className="text-blue-400 text-sm">{job.id}</p>

        <MoreVertical size={16} className="text-gray-400" />
      </div>

      <h4 className="text-white font-medium">{job.title}</h4>

      <p className="text-gray-400 text-sm">{job.client}</p>

      <span className={`px-2 py-1 text-xs rounded ${badge[job.priority]}`}>
        {job.priority}
      </span>

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