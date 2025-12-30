import React from 'react';

const TutorialPage: React.FC = () => {
  const blueprintSteps = [
    {
      title: "1. Create the Azure Container",
      desc: "Provision an Azure Static Web App (SWA) via the Portal or CLI. Select 'Free Tier' for the initial build.",
      code: "az staticwebapp create -n procheck-prod -g msp-rg --sku Free"
    },
    {
      title: "2. Secure the Keys",
      desc: "Use Azure Key Vault for the Gemini API key. Ensure 'Managed Identity' has access.",
      code: "az keyvault secret set --vault-name msp-kv --name 'GEMINI-API-KEY' --value 'YOUR_KEY'"
    },
    {
      title: "3. Establish Multi-Tenant Trust",
      desc: "Connect client subscriptions via Azure Lighthouse or delegated Resource Group permissions.",
      code: "Role: Reader | Scope: Client-Sub-01"
    },
    {
      title: "4. Enable Global Telemetry",
      desc: "Deploy the Log Analytics Workspace (LAW) and link VMs to enable automated metric ingestion.",
      code: "az monitor log-analytics workspace create -g msp-rg -n procheck-law"
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto pb-24">
      <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4 tracking-tighter">ProCheck Master Codex</h2>
          <p className="text-indigo-100 text-lg font-medium max-w-2xl leading-relaxed">
            The definitive builder's guide to taking Azure Innovate ProCheck from prototype to production.
          </p>
        </div>
      </div>

      <section className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Production Deployment Blueprint</h3>
        <div className="space-y-10">
          {blueprintSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black mb-4">{idx + 1}</div>
                <h4 className="font-black text-slate-900 mb-2">{step.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </div>
              <div className="flex-1 w-full bg-slate-900 p-6 rounded-2xl font-mono text-xs text-indigo-300 overflow-x-auto">
                <p className="text-slate-500 mb-2"># Azure CLI / Configuration</p>
                <code>{step.code}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW Economic Section */}
      <div className="bg-emerald-600 p-12 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h3 className="text-3xl font-black mb-4">Zero-Cost Infrastructure</h3>
            <p className="text-emerald-50 text-lg font-medium leading-relaxed">
              This architecture is specifically optimized for the <strong>Azure Free Tier</strong>. For most MSPs with under 50 clients, your monthly bill will literally be zero for hosting and compute.
            </p>
          </div>
          <div className="w-full md:w-auto p-8 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-md">
            <div className="space-y-4">
               <div className="flex justify-between gap-12">
                 <span className="text-xs font-black uppercase text-emerald-200">Execution Cost</span>
                 <span className="text-xs font-black uppercase">$0.00</span>
               </div>
               <div className="flex justify-between gap-12">
                 <span className="text-xs font-black uppercase text-emerald-200">Storage Cost</span>
                 {/* FIX: Use curly braces and quotes to ensure '<$0.10' is parsed as literal text, not a JSX tag start */}
                 <span className="text-xs font-black uppercase">{"<$0.10"}</span>
               </div>
               <div className="flex justify-between gap-12 border-t border-white/20 pt-4">
                 <span className="text-sm font-black uppercase">Net Total</span>
                 <span className="text-sm font-black uppercase">Near-Zero</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl">
           <h3 className="text-2xl font-black mb-4">Managed Identity</h3>
           <p className="text-slate-400 text-sm leading-relaxed mb-6">
             In production, we remove all passwords. The App has its own identity in Entra ID. It "asks" Key Vault for the Gemini Key, and Key Vault only speaks to it if it recognizes the App's hardware signature.
           </p>
           <button className="px-6 py-3 bg-indigo-600 rounded-xl text-xs font-black uppercase hover:bg-indigo-700 transition-all">Read Security Docs</button>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl">
           <h3 className="text-2xl font-black mb-4">Final Publication</h3>
           <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
             Connect your GitHub Repo to Azure Static Web Apps. Every <code>git push</code> will automatically rebuild your dashboard and deploy it globally in seconds.
           </p>
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
               <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">CI/CD Pipeline Ready</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;