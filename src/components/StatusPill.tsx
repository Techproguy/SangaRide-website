// Status labels always carry text, so colour is never the only signal.
const tones: Record<string, string> = {
  Approved: "bg-emerald-50 text-emerald-800",
  Completed: "bg-emerald-50 text-emerald-800",
  Accepted: "bg-emerald-50 text-emerald-800",
  Charged: "bg-emerald-50 text-emerald-800",
  Pending: "bg-amber-50 text-amber-800",
  Invited: "bg-amber-50 text-amber-800",
  Scheduled: "bg-brand-50 text-brand-700",
  "In progress": "bg-brand-50 text-brand-700",
  Adjusted: "bg-slate-100 text-slate-700",
  Declined: "bg-red-50 text-red-700",
  Cancelled: "bg-slate-100 text-slate-700",
  "Payment failed": "bg-red-50 text-red-700",
  Active: "bg-emerald-50 text-emerald-800",
  Eligible: "bg-emerald-50 text-emerald-800",
  Verified: "bg-emerald-50 text-emerald-800",
  Finalised: "bg-emerald-50 text-emerald-800",
  "Under review": "bg-amber-50 text-amber-800",
  Estimated: "bg-brand-50 text-brand-700",
  Assigned: "bg-brand-50 text-brand-700",
  Unassigned: "bg-slate-100 text-slate-700",
  "Not started": "bg-slate-100 text-slate-700",
  "Not eligible": "bg-slate-100 text-slate-700",
  Expired: "bg-red-50 text-red-700",
  Blocked: "bg-red-50 text-red-700",
};

export function StatusPill({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[0.68rem] font-semibold whitespace-nowrap ${tones[status] ?? "bg-slate-100"}`}>{status}</span>;
}
