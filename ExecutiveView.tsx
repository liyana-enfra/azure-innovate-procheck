
import React from 'react';

const ExecutiveView: React.FC = () => {
  const metrics = [
    { label: 'Projected Opex', value: '<$5.00', desc: 'Monthly Azure Serverless consumption' },
    { label: 'Manual Time Offset', value: '450 hrs', desc: 'Annual engineer hours saved via automation' },
    { label: 'SLA Reliability', value: '100%', desc: 'Health checks performed without human error' },
    { label: 'Security Posture', value: 'Zero-Trust', desc: 'Managed Identity with no stored credentials' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 tracking-tighter">MSP Strategic Impact</h2>
          <p className="text-indigo-200 max-w-2xl text-lg font-medium leading-relaxed mb-10">
            ProCheck utilizes a 100% Serverless "Pay-As-You-Audit" model. By leveraging the Azure Free Grant and Gemini Flash, operational overhead is virtually eliminated.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl group hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{m.label}</p>
                <p className="text-3xl font-black mb-2">{m.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
          <h3 className="text-xl font-black text-slate-900 mb-6">Cost Optimization Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-700">Hosting (SWA)</span>
              <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-100 px-3 py-1 rounded-full">Included (Free Tier)</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-700">Compute (Functions)</span>
              <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-100 px-3 py-1 rounded-full">Free Grant (1M/mo)</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-700">Intelligence (Gemini)</span>
              <span className="text-xs font-black text-emerald-600 uppercase bg-emerald-100 px-3 py-1 rounded-full">Free Tier (15 RPM)</span>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Architect's Note</p>
              <p className="text-xs text-slate-400 font-medium italic">
                The platform scales with your client base. Adding 100 more tenants adds less than $1.50 to your monthly Azure bill.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center border border-white/5">
           <h3 className="text-2xl font-black mb-4">Enterprise Value</h3>
           <p className="text-slate-400 text-sm leading-relaxed mb-6">
             ProCheck isn't just a tool; it's a <strong>Compliance Asset</strong>. It generates immutable proof of daily diligence that you can use to justify SLA bonuses and pass ISO/SOC2 audits with zero manual document gathering.
           </p>
           <div className="flex gap-4">
             <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <p className="text-2xl font-black text-indigo-400">14ms</p>
                <p className="text-[9px] font-black uppercase text-slate-500">Latency</p>
             </div>
             <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <p className="text-2xl font-black text-indigo-400">$0</p>
                <p className="text-[9px] font-black uppercase text-slate-500">Capex</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveView;
