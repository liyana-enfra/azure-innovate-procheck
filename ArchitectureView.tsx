
import React from 'react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">
      <section className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <h2 className="text-4xl font-black mb-8 tracking-tighter">🚀 Deployment Roadmap</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {[
            { step: '01', title: 'Provider Auth', desc: 'Configure Azure SPN with Reader role in each client tenant.', icon: '🔑' },
            { step: '02', title: 'Managed Identity', desc: 'Enable System-Assigned ID in the ProCheck Hosting App.', icon: '🛡️' },
            { step: '03', title: 'Persistence', desc: 'Migrate Mock Storage to Azure Cosmos DB Serverless.', icon: '💾' },
            { step: '04', title: 'Automation', desc: 'Trigger daily scans via GitHub Actions or Logic Apps.', icon: '⚡' }
          ].map(item => (
            <div key={item.step} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-all">
              <div className="text-3xl mb-4">{item.icon}</div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Step {item.step}</p>
              <h4 className="font-black text-xl mb-3">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Publishing Guide Section */}
      <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Publishing to Azure</h3>
            <p className="text-slate-500 font-medium">Follow these steps to deploy this application to your production Azure environment.</p>
            
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-xs">
                <p className="text-slate-400 mb-2"># 1. Initialize Azure Static Web App</p>
                <p className="text-indigo-600">az staticwebapp create --name procheck-v4 --resource-group msp-procheck-rg</p>
                <p className="text-slate-400 mt-4 mb-2"># 2. Set API Secret for Gemini Diagnostic Engine</p>
                <p className="text-indigo-600">az staticwebapp appsettings set --name procheck-v4 --setting-names API_KEY=YOUR_GEMINI_KEY</p>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-amber-600">⚠️</div>
                <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                  IMPORTANT: After deployment, navigate to the SWA "Configuration" settings in the Azure Portal and ensure the API_KEY environment variable is set. Without this, AI Diagnostics will remain offline.
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-80 bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Production Specs</h4>
            <div className="space-y-4">
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-xs text-slate-400">FE Tier:</span>
                 <span className="text-xs font-bold">Standard SWA</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-xs text-slate-400">BE Tier:</span>
                 <span className="text-xs font-bold">Serverless Functions</span>
               </div>
               <div className="flex justify-between border-b border-white/10 pb-2">
                 <span className="text-xs text-slate-400">SLA:</span>
                 <span className="text-xs font-bold">99.9%</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12">
        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Security Flaw Mitigation</h3>
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-xs font-black text-rose-500 uppercase mb-2">Flaw: Client Secret Leakage</p>
              <p className="text-sm text-slate-600 font-medium">Storing secrets in code or local variables poses high risk.</p>
              <p className="text-[11px] text-emerald-600 font-black mt-3 uppercase">ProCheck Fix: Automated KeyVault retrieval via Managed Identity only.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-xs font-black text-rose-500 uppercase mb-2">Flaw: Audit Fragmentation</p>
              <p className="text-sm text-slate-600 font-medium">Engineers skipping manual steps during peak times.</p>
              <p className="text-[11px] text-emerald-600 font-black mt-3 uppercase">ProCheck Fix: Mandatory automated checksum for all 8 SOP checks.</p>
            </div>
          </div>
        </section>

        <section className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl flex flex-col justify-center">
          <h3 className="text-2xl font-black mb-6">Development Requirements</h3>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">AI</span>
              <p className="text-sm font-medium">Gemini 3 Flash (Free Tier) for Diagnostic Synthesis.</p>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">FE</span>
              <p className="text-sm font-medium">React 19 + Tailwind CSS (Adaptive/Mobile Ready).</p>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">BE</span>
              <p className="text-sm font-medium">Node.js Azure Functions (Serverless API Layer).</p>
            </li>
          </ul>
          <button className="mt-10 w-full py-5 bg-white text-indigo-600 rounded-2xl font-black shadow-2xl hover:scale-[1.02] transition-all">Download Reference Architecture</button>
        </section>
      </div>
    </div>
  );
};

export default ArchitectureView;
