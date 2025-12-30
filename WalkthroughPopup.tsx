
import React from 'react';

interface Props {
  activeTab: string;
  onDismiss: () => void;
}

const WalkthroughPopup: React.FC<Props> = ({ activeTab, onDismiss }) => {
  const content: Record<string, { title: string; desc: string; icon: string }> = {
    dashboard: {
      title: "Tenant Portfolio",
      desc: "This is your command center. Monitor all customer environments at a glance. Green indicates healthy baselines, while Red triggers immediate remediation alerts.",
      icon: "🏢"
    },
    inventory: {
      title: "Resource Matrix",
      desc: "A global inventory of every Virtual Machine, SQL Instance, and Gateway across all client subscriptions. Filter by power state or resource health.",
      icon: "📦"
    },
    team: {
      title: "Engineer Roster",
      desc: "Monitor your fleet of engineers. See who is currently remediating specific Azure incidents and check their authorized IP origins for security compliance.",
      icon: "👷"
    },
    logs: {
      title: "Audit Trail",
      desc: "An immutable history of every action taken on this platform. Use this for root-cause analysis and customer service delivery proof.",
      icon: "📜"
    },
    onboarding: {
      title: "Azure Integration",
      desc: "Add new tenants here. Our 'Security First' wizard ensures you only provide 'Reader' permissions, maintaining zero-write risk across all client environments.",
      icon: "🚀"
    },
    executive: {
      title: "Strategy & ROI",
      desc: "Review high-level efficiency metrics. Track time saved per day through automation and platform reliability for executive reporting.",
      icon: "📈"
    },
    settings: {
      title: "Platform Logic",
      desc: "Define the 'Truth'. Set CPU, Disk, and Memory thresholds that trigger status changes, and configure SMTP for automated daily reporting.",
      icon: "⚙️"
    }
  };

  const current = content[activeTab];
  if (!current) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[150] w-[350px] animate-in slide-in-from-right-10 duration-500">
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 relative group">
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
          {current.icon}
        </div>
        <div className="pl-4">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Walkthrough Intelligence</h4>
          <h3 className="text-xl font-black mb-3">{current.title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
            {current.desc}
          </p>
          <button 
            onClick={onDismiss}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkthroughPopup;
