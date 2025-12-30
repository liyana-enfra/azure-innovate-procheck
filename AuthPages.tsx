
import React, { useState } from 'react';
import { db } from '../services/database';

interface AuthProps {
  onLogin: (role: any, email: string) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'VERIFY';

export const LoginPage: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('admin@procheck.com');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('password');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignUp = () => {
    if (!email || !name) return;
    setIsProcessing(true);
    
    // In production, this would call an Azure Function to send an email via Azure Communication Services
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(mockCode);
    
    setTimeout(() => {
      db.addLog({
        type: 'Security',
        severity: 'Info',
        user: 'System',
        message: `Registration verification code sent to ${email} (Code: ${mockCode})`
      });
      setIsProcessing(false);
      setMode('VERIFY');
    }, 1500);
  };

  const handleVerify = () => {
    if (code === generatedCode) {
      onLogin('Engineer', email);
    } else {
      alert("Invalid confirmation code. Please check your email (or system logs for this demo).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-black text-2xl mb-4">A</div>
          <h1 className="text-2xl font-bold">ProCheck Access</h1>
          <p className="text-blue-100 text-sm">
            {mode === 'LOGIN' ? 'Azure Innovate Multi-Tenant Portal' : 
             mode === 'SIGNUP' ? 'Engineer Onboarding Request' : 'Email Confirmation Required'}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {mode === 'LOGIN' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="engineer@msp.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <button className="text-xs text-blue-600 font-bold hover:underline">Forgot?</button>
                </div>
                <input 
                  type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="••••••••"
                />
              </div>
              <button 
                onClick={() => onLogin(email.includes('admin') ? 'Admin' : 'Engineer', email)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Authorize Session
              </button>
              <div className="text-center pt-4">
                <p className="text-xs text-slate-400">
                  New Engineer? <button onClick={() => setMode('SIGNUP')} className="text-blue-600 font-bold hover:underline">Create Account</button>
                </p>
              </div>
            </>
          )}

          {mode === 'SIGNUP' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Email</label>
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="john@msp.com"
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                  NOTE: Registration requires a valid company domain. A 6-digit verification code will be dispatched to your inbox.
                </p>
              </div>
              <button 
                onClick={handleSignUp}
                disabled={isProcessing}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Confirmation Code'}
              </button>
              <div className="text-center pt-4">
                <button onClick={() => setMode('LOGIN')} className="text-xs text-slate-400 font-bold hover:underline">Back to Login</button>
              </div>
            </>
          )}

          {mode === 'VERIFY' && (
            <>
              <div className="text-center space-y-2 mb-6">
                <p className="text-sm text-slate-600 font-medium">We've sent a code to <span className="font-bold text-slate-900">{email}</span></p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">6-Digit Confirmation Code</label>
                <input 
                  type="text" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center text-2xl font-black tracking-[0.5em]" 
                  placeholder="000000"
                />
              </div>
              <button 
                onClick={handleVerify}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                Verify & Activate Account
              </button>
              <div className="text-center pt-4 flex flex-col gap-2">
                <button onClick={() => setMode('SIGNUP')} className="text-xs text-indigo-600 font-bold hover:underline">Change Email Address</button>
                <div className="p-2 bg-slate-100 rounded-lg text-[10px] text-slate-400 font-mono">
                  DEMO MODE: Check "Logs" tab after login or find code in memory: {generatedCode}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
