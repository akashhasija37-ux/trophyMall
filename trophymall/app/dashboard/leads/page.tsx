"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Filter, Plus } from "lucide-react";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddLeadModal from "../../components/AddLeadModal";

type Lead = {
  id: number;
  lead_name: string;
  contact_number: string;
  email?: string;
  company_name?: string;
  lead_source?: string;
  interested_product?: string;
  assigned_employee?: string;
  lead_status: string;
  created_at?: string;
};

export default function LeadsTracking() {
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const itemsPerPage = 5;

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ✅ FILTER + SEARCH
  const processedLeads = leads.filter((lead) => {
    const statusMatch =
      statusFilter === "All" || lead.lead_status === statusFilter;

    const sourceMatch =
      sourceFilter === "All" || lead.lead_source === sourceFilter;

    const searchMatch =
      lead.lead_name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.contact_number?.includes(search);

    return statusMatch && sourceMatch && searchMatch;
  });

  const totalPages = Math.ceil(processedLeads.length / itemsPerPage);

  const paginatedLeads = processedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <div className="p-8">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold">Leads Tracking</h1>
              <p className="text-gray-400 text-sm">
                Manage and track all your sales leads
              </p>
            </div>

            <button
              className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setOpen(true)}
            >
              <Plus size={18} />
              Add Lead
            </button>

            <AddLeadModal open={open} setOpen={setOpen} refresh={fetchLeads} />
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Leads" value={leads.length} />

            <StatCard
              title="Hot Leads"
              value={leads.filter((l) => l.lead_status === "Hot").length}
            />

            <StatCard
              title="Conversion Rate"
              value={
                leads.length
                  ? `${Math.round(
                      (leads.filter((l) => l.lead_status === "Converted")
                        .length /
                        leads.length) *
                        100,
                    )}%`
                  : "0%"
              }
            />

            <StatCard
              title="Today Leads"
              value={
                leads.filter(
                  (l) =>
                    l.created_at?.split("T")[0] ===
                    new Date().toISOString().split("T")[0],
                ).length
              }
            />
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg w-64 mb-4"
          />

          {/* FILTERS */}
          <div className="flex gap-4 mb-6">
            <button className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Filter size={16} />
              Filters
            </button>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg"
            >
              <option value="All">All Status</option>
              <option value="Hot">Hot</option>
              <option value="Cold">Cold</option>
              <option value="Converted">Converted</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg"
            >
              <option value="All">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social">Social</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gray-800 rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-400 text-sm border-b border-gray-800">
                <tr>
                  <th className="py-4 px-3">Lead ID</th>
                  <th className="px-3">Contact</th>
                  <th className="px-3">Company</th>
                  <th className="px-3">Status</th>
                  <th className="px-3">Source</th>
                  <th className="px-3">Product</th>
                  <th className="px-3">Assigned</th>
                  <th className="px-3">Date</th>
                  <th className="px-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {paginatedLeads.map((lead, i) => (
                  <LeadRow
                    key={lead.id || i}
                    {...lead}
                    id={`LEAD-${lead.id}`}
                    onView={() => setSelectedLead(lead)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm disabled:opacity-40"
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>

          {/* VIEW MODAL */}
          {selectedLead && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-[#111] border border-gray-800 rounded-xl w-[500px] p-6 relative">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-3 right-3"
                >
                  ✕
                </button>

                <h2 className="text-lg font-semibold mb-4">Lead Details</h2>

                <Info label="Name" value={selectedLead.lead_name} />
                <Info label="Phone" value={selectedLead.contact_number} />
                <Info label="Email" value={selectedLead.email} />
                <Info label="Company" value={selectedLead.company_name} />
                <Info label="Status" value={selectedLead.lead_status} />
                <Info label="Source" value={selectedLead.lead_source} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function StatCard({ title, value }: any) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gray-800 rounded-xl p-6 flex justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-2">{value}</h3>
      </div>

      <TrendingUp className="text-green-500" />
    </div>
  );
}

const LeadRow = ({ id, onView, ...lead }: any) => {
  return (
    <tr className="border-b border-gray-800 hover:bg-zinc-900/40 transition">
      <td className="py-4 px-3 text-blue-400 font-medium cursor-pointer" onClick={onView}>{id}</td>

      <td className="px-3">
        <div className="flex flex-col">
          <span className="text-white">{lead.lead_name} </span>
          <span className="text-gray-400 text-xs">{lead.email}</span>
          <span className="text-gray-500 text-xs">{lead.contact_number}</span>
        </div>
      </td>

      <td className="px-3 text-gray-300">{lead.company_name}</td>

      <td className="px-3">
        <span
          className={`px-2 py-1 rounded text-xs ${
            lead.lead_status === "Hot"
              ? "bg-red-600/20 text-red-400"
              : lead.lead_status === "Converted"
                ? "bg-green-600/20 text-green-400"
                : "bg-gray-700 text-gray-300"
          }`}
        >
          {lead.lead_status}
        </span>
      </td>

      <td className="px-3 text-gray-300">{lead.lead_source}</td>
      <td className="px-3 text-gray-300">{lead.interested_product}</td>
      <td className="px-3 text-gray-300">{lead.assigned_employee}</td>

      <td className="px-3 text-gray-400">
        {new Date(lead.created_at).toLocaleDateString()}
      </td>

      <td className="px-3 text-right">
        <button onClick={onView} className="text-green-400">
          View
        </button>
      </td>
    </tr>
  );
};

const Info = ({ label, value }: any) => (
  <div className="mb-2">
    <p className="text-gray-400">{label}</p>
    <p>{value || "-"}</p>
  </div>
);
