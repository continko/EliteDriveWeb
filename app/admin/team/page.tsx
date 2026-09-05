"use client";

import { UserPlus } from "lucide-react";

export default function AdminTeam() {
  return (
    <div className="space-y-6 font-urbanist text-left text-white">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Team</h1>
        <p className="text-xs text-slate-400 mt-1">Who has access to this workspace.</p>
      </div>

      <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 font-bold uppercase text-[10px]">
                <th className="pb-4">Name</th>
                <th className="pb-4">Email</th>
                <th className="pb-4 text-right">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-4 font-bold text-white">Tomi Hrmo</td>
                <td className="py-4 text-slate-400">hrmotomas0@gmail.com</td>
                <td className="py-4 text-right">
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 font-black rounded-lg text-[10px]">OWNER</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="px-5 py-2.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2">
          <UserPlus size={16} /> Invite & manage staff →
        </button>
      </div>
    </div>
  );
}