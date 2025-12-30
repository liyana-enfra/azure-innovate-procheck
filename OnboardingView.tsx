
import React, { useState } from 'react';

const OnboardingView: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  
  // These steps represent the literal technical prerequisites for successful Azure Portal integration.
  const steps = [
    { 
      title: 'Azure AD Service Principal', 
      desc: 'Create secure API identity in Client Tenant', 
      mandatory: true,
      subSteps: [
        '1. Login to Azure Portal as Global Admin in Client Tenant.',
        '2. Navigate to "Microsoft Entra ID" > "App Registrations" > "New Registration".',
        '3. Name: "ProCheck-Monitor". Supported accounts: Single Tenant.',
        '4. Copy the "Application (client) ID" and "Directory (tenant) ID".',
        '5. Create a new Client Secret under "Certificates & secrets". Set to 12 months.'
      ],
      placeholder: 'SPN Client ID / Secret Name...'
    },
    { 
      title: 'RBAC Reader Assignment', 
      desc: 'Grant Read-Only visibility to the identity', 
      mandatory: true,
      subSteps: [
        '1. Search for "Subscriptions" in the top search bar.',
        '2. Select target subscription > "Access control (IAM)".',
        '3. Click "+ Add" > "Add role assignment".',
        '4. Role: "Reader". Assign access to "User, group, or service principal".',
        '5. Search for "ProCheck-Monitor" (SPN from Step 1) and click "Review + Assign".'
      ],
      placeholder: 'Confirmed Subscription ID...'
    },
    { 
      title: 'Agent & Workspace Link', 
      desc: 'Enable telemetry streaming for VM metrics', 
      mandatory: true,
      subSteps: [
        '1. Ensure VMs have the "Azure Monitor Agent" (AMA) installed.',
        '2. Link VMs to the shared Log Analytics Workspace (LAW).',
        '3. Enable "VM Insights" for all production-tier virtual machines.',
        '4. Verify metrics flow by running: Perf | where CounterName == "% Processor Time" | take 10'
      ],
      placeholder: 'Log Analytics Workspace ID...'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl animate-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Prerequisites Guide */}
      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-200">
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Onboarding ProCheck v4</h2>
        <p className="text-slate-500 mb-12 font-medium text-lg">Detailed procedure for client environment integration with Azure Portal.</p>

        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`rounded-[2.5rem] border transition-all duration-300 ${expandedStep === idx ? 'bg-indigo-50 border-indigo-200 p-10 shadow-sm' : 'bg-slate-50 border-slate-100 p-8 hover:bg-white hover:border-indigo-100 cursor-pointer'}`}
              onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${expandedStep === idx ? 'bg-indigo-600 text-white scale-110 shadow-xl' : 'bg-slate-200 text-slate-500'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-1">
                    <h3 className="font-black text-slate-900 text-xl">{step.title}</h3>
                    {step.mandatory ? 
                      <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-3 py-1 rounded-full uppercase tracking-tighter">Strictly Required</span> : 
                      <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">Optional Insight</span>
                    }
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-loose">{step.desc}</p>
                </div>
              </div>

              {expandedStep === idx && (
                <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300" onClick={e => e.stopPropagation()}>
                  <div className="p-8 bg-white rounded-[2rem] border border-indigo-100 shadow-inner space-y-4">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Azure Portal Mandatory Steps</h4>
                    <div className="space-y-3">
                      {step.subSteps.map((sub, sIdx) => (
                        <p key={sIdx} className="text-sm text-slate-700 leading-relaxed font-semibold">{sub}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certification & Final Readiness Checklist */}
      <div className="bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        <h3 className="text-2xl font-black mb-8 relative z-10">Certification Readiness Checklist</h3>
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          {[
            { label: 'SPN Created', detail: 'Application ID verified in client tenant Entra ID.' },
            { label: 'Reader Role Active', detail: 'Verified at subscription scope for all target assets.' },
            { label: 'Secret In KeyVault', detail: 'Secret stored in msp-procheck-kv with correct tags.' },
            { label: 'AMA Agent Deployed', detail: 'VM Insights providing telemetry to Log Analytics.' },
          ].map((check, i) => (
            <div key={i} className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-all">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="font-black text-sm">{check.label}</p>
                <p className="text-xs text-slate-400 font-medium">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-12 w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95">
          Execute System Connection Test
        </button>
      </div>
    </div>
  );
};

export default OnboardingView;
