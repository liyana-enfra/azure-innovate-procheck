
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const OnboardingGuide: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const guideSteps = [
    {
      title: "Welcome to Azure Innovate ProCheck",
      desc: "Your automated hub for Azure Managed Services Daily Health Checklists. Let's configure your high-security monitoring environment.",
      icon: "🛡️",
      action: "Next: Security First"
    },
    {
      title: "The 'Reader' Security Model",
      desc: "ProCheck enforces Least Privilege. You must create an Azure App Registration (SPN) with only the 'Reader' role. No write access is required or allowed.",
      icon: "🔑",
      action: "Next: Daily Audits"
    },
    {
      title: "Daily Global Sync",
      desc: "Instead of manual SOPs, click 'Global Audit Sync' every morning. ProCheck queries Resource Health and Log Analytics to verify 8 critical performance areas automatically.",
      icon: "⚡",
      action: "Next: Final Step"
    },
    {
      title: "Dispatch Reports",
      desc: "Once scans are complete, use the Multi-Tenant Dispatcher to send PDF/XLS executive summaries to your clients directly from the portal.",
      icon: "📊",
      action: "Start Onboarding Tenants"
    }
  ];

  const current = guideSteps[step];

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-12 text-center space-y-8">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-4xl mx-auto border border-indigo-100 shadow-inner">
            {current.icon}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{current.title}</h2>
            <p className="text-slate-500 font-medium leading-relaxed px-4">{current.desc}</p>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                if (step < guideSteps.length - 1) setStep(step + 1);
                else onComplete();
              }}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
            >
              {current.action}
            </button>
            <div className="flex justify-center gap-2">
              {guideSteps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
