"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, Filter, Plus, Edit, Download, Upload, Trash2, ArrowRightCircle } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "@/app/components/sidebar";
import Topbar from "@/app/components/topbar";
import AddLeadModal from "../../components/AddLeadModal";
import dayjs from "dayjs";

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
  lost_reason?: string;
  created_at?: string;
};

export default function LeadsTracking() {
  const [open, setOpen] = useState(false);
  const [editLeadData, setEditLeadData] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // ✅ CONVERT LEAD TO CUSTOMER
  const handleConvertToCustomer = async (lead: Lead) => {
    const toastId = toast.loading("Converting lead to customer...");
    try {
      // 1. Add to customers database API
      const custRes = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.lead_name,
          phone: lead.contact_number,
          email: lead.email,
          company: lead.company_name,
        }),
      });

      if (!custRes.ok) throw new Error("Failed to create customer record");

      // 2. Update lead status to "Converted"
      const updateRes = await fetch(`/api/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, lead_status: "Converted" }),
      });

      if (!updateRes.ok) throw new Error("Failed to update lead status");

      toast.success("Lead successfully converted to Customer! ✅", { id: toastId });
      fetchLeads();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Conversion failed ❌", { id: toastId });
    }
  };

  // ✅ EXCEL DOWNLOAD (CSV export)
  const handleDownloadExcel = () => {
    if (leads.length === 0) {
      toast.error("No leads available to export!");
      return;
    }
    const headers = ["Name,Contact,Email,Company,Source,Status,Product,Assigned\n"];
    const rows = leads.map(l => 
      `"${l.lead_name || ""}","${l.contact_number || ""}","${l.email || ""}","${l.company_name || ""}","${l.lead_source || ""}","${l.lead_status || ""}","${l.interested_product || ""}","${l.assigned_employee || ""}"`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${dayjs().format("YYYY-MM-DD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads downloaded successfully!");
  };

  // ✅ EXCEL / CSV UPLOAD & SAVE TO DATABASE
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Processing and uploading leads file...");
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n");
        const rows = lines.slice(1); // skip header row

        let importedCount = 0;

        for (const row of rows) {
          if (!row.trim()) continue;
          
          // Basic CSV regex parser handling quotes and commas
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.replace(/^"|"$/g, "").trim());
          
          if (cols.length >= 2 && cols[0]) {
            const leadPayload = {
              lead_name: cols[0] || "Unknown Lead",
              contact_number: cols[1] || "",
              email: cols[2] || "",
              company_name: cols[3] || "",
              lead_source: cols[4] || "Website",
              lead_status: cols[5] || "Cold",
              interested_product: cols[6] || "",
              assigned_employee: cols[7] || "",
            };

            const res = await fetch("/api/leads", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(leadPayload),
            });

            if (res.ok) {
              importedCount++;
            }
          }
        }

        toast.success(`Successfully uploaded and saved ${importedCount} leads! ✅`, { id: toastId });
        fetchLeads();
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse or save excel sheet ❌", { id: toastId });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  // ✅ FILTER + SEARCH
  const processedLeads = leads.filter((lead) => {
    const statusMatch = statusFilter === "All" || lead.lead_status === statusFilter;
    const sourceMatch = sourceFilter === "All" || lead.lead_source === sourceFilter;
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
                Manage, track, convert, export, and import sales leads via Excel
              </p>
            </div>

            <div className="flex gap-3">
              {/* Hidden file input for Excel/CSV upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv, .txt, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
              >
                <Upload size={16} /> Upload Excel
              </button>

              <button
                onClick={handleDownloadExcel}
                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
              >
                <Download size={16} /> Export Excel
              </button>

              <button
                className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
                onClick={() => {
                  setEditLeadData(null);
                  setOpen(true);
                }}
              >
                <Plus size={18} />
                Add Lead
              </button>
            </div>

            <AddLeadModal
              open={open}
              setOpen={setOpen}
              refresh={fetchLeads}
              editData={editLeadData}
            />
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Leads" value={leads.length} />
            <StatCard title="Hot Leads" value={leads.filter((l) => l.lead_status === "Hot").length} />
            <StatCard
              title="Conversion Rate"
              value={
                leads.length
                  ? `${Math.round(
                      (leads.filter((l) => l.lead_status === "Converted").length / leads.length) * 100,
                    )}%`
                  : "0%"
              }
            />
            <StatCard
              title="Today Leads"
              value={
                leads.filter(
                  (l) =>
                    l.created_at?.split("T")[0] === new Date().toISOString().split("T")[0],
                ).length
              }
            />
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
            <div className="flex gap-4">
              <input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg w-64 text-sm"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg text-sm"
              >
                <option value="All">All Status</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#1a1a1a] border border-gray-700 px-4 py-2 rounded-lg text-sm"
              >
                <option value="All">All Sources</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
                    onEdit={() => {
                      setEditLeadData(lead);
                      setOpen(true);
                    }}
                    onConvert={() => handleConvertToCustomer(lead)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-sm disabled:opacity-40"
            >
              Prev
            </button>

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
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  ✕
                </button>

                <h2 className="text-lg font-semibold mb-4">Lead Details</h2>

                <Info label="Name" value={selectedLead.lead_name} />
                <Info label="Phone" value={selectedLead.contact_number} />
                <Info label="Email" value={selectedLead.email} />
                <Info label="Company" value={selectedLead.company_name} />
                <Info label="Status" value={selectedLead.lead_status} />
                {selectedLead.lead_status === "Lost" && (
                  <Info label="Lost Reason" value={selectedLead.lost_reason} />
                )}
                <Info label="Source" value={selectedLead.lead_source} />
                <Info label="Interested Product" value={selectedLead.interested_product} />
                <Info label="Assigned Employee" value={selectedLead.assigned_employee} />
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
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-gray-800 rounded-xl p-6 flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-2">{value}</h3>
      </div>
      <TrendingUp className="text-green-500" />
    </div>
  );
}

const LeadRow = ({ id, onView, onEdit, onConvert, ...lead }: any) => {
  return (
    <tr className="border-b border-gray-800 hover:bg-zinc-900/40 transition">
      <td
        className="py-4 px-3 text-blue-400 font-medium cursor-pointer"
        onClick={onView}
      >
        {id}
      </td>

      <td className="px-3">
        <div className="flex flex-col">
          <span className="text-white">{lead.lead_name}</span>
          <span className="text-gray-400 text-xs">{lead.email}</span>
          <span className="text-gray-500 text-xs">{lead.contact_number}</span>
        </div>
      </td>

      <td className="px-3 text-gray-300">{lead.company_name || "-"}</td>

      <td className="px-3">
        <span
          className={`px-2 py-1 rounded text-xs ${
            lead.lead_status === "Hot"
              ? "bg-red-600/20 text-red-400"
              : lead.lead_status === "Converted"
              ? "bg-green-600/20 text-green-400"
              : lead.lead_status === "Lost"
              ? "bg-zinc-700 text-zinc-400 line-through"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {lead.lead_status}
        </span>
      </td>

      <td className="px-3 text-gray-300">{lead.lead_source}</td>
      <td className="px-3 text-gray-300">{lead.interested_product || "-"}</td>
      <td className="px-3 text-gray-300">{lead.assigned_employee || "-"}</td>

      <td className="px-3 text-gray-400">
        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : "-"}
      </td>

      <td className="px-3 text-right space-x-2">
        <button onClick={onView} className="text-green-400 hover:underline text-xs">
          View
        </button>
        <button onClick={onEdit} className="text-blue-400 hover:underline text-xs">
          Edit
        </button>
        {lead.lead_status !== "Converted" && (
          <button onClick={onConvert} className="text-amber-400 hover:underline text-xs" title="Convert to Customer">
            Convert
          </button>
        )}
      </td>
    </tr>
  );
};

const Info = ({ label, value }: any) => (
  <div className="mb-2">
    <p className="text-gray-400 text-xs">{label}</p>
    <p className="text-sm">{value || "-"}</p>
  </div>
);