import React, { useState } from 'react';
import { 
  Wallet, ShieldCheck, Zap, TrendingUp, ArrowRight, 
  CheckCircle2, Sparkles, Lock, RefreshCw, Layers, Code 
} from 'lucide-react';

export default function LandingPage({ onLaunchApp }) {
  const [activeTab, setActiveTab] = useState('weekly');

  // Custom Links
  const PORTFOLIO_URL = "https://albert-dev-omega.vercel.app/";
  const GITHUB_URL = "https://github.com/Albertmnuel/";
  const LINKEDIN_URL = "https://www.linkedin.com/in/albert-emmanuel-46b0843a7/";
  const INSTAGRAM_URL = "https://www.instagram.com/d_metree/";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <Wallet size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              UniVault
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#vaults" className="hover:text-blue-600 transition-colors">Smart Vaults</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Student Plan</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLaunchApp}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={onLaunchApp}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-16 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} /> Student Budgeting Engine
              </div>

              <a 
                href={PORTFOLIO_URL} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 text-xs font-mono shadow-xs transition-all"
              >
                <Code size={13} className="text-blue-600" /> by Albertdev.tech
              </a>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Stop Overspending. <br />
              <span className="text-blue-600">
                Master Your Campus Cash.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              UniVault dynamically calculates your exact daily safe-to-spend limit, manages targeted budget vaults for books or food, and ensures your allowance lasts until the end of the semester.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button 
                onClick={onLaunchApp}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Open Your Vault <ArrowRight size={18} />
              </button>
              <a 
                href="#how-it-works"
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-base text-center shadow-xs transition-all"
              >
                See How It Works
              </a>
            </div>

            <div className="pt-6 flex items-center gap-4 border-t border-slate-200">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center font-bold text-xs text-white">JD</div>
                <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center font-bold text-xs text-white">AK</div>
                <div className="w-9 h-9 rounded-full bg-amber-600 border-2 border-white flex items-center justify-center font-bold text-xs text-white">ST</div>
              </div>
              <div className="text-xs text-slate-500">
                <span className="text-slate-900 font-semibold block text-sm">Built for University Students</span>
                Manage weekly stipends, semester grants, or irregular transfers easily.
              </div>
            </div>
          </div>

          {/* Dark Contrast Card: Live Safe-To-Spend */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-2xl relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Live Safe-To-Spend</div>
                  <div className="text-3xl font-extrabold text-blue-400 mt-1">$14.50 <span className="text-xs text-slate-400 font-normal">/ day</span></div>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                  <TrendingUp size={24} />
                </div>
              </div>

              <div className="my-6 space-y-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Semester Pool Progress</span>
                  <span className="text-slate-200 font-semibold">$320.00 Remaining</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[68%] h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <div>
                      <div className="text-sm font-semibold text-slate-100">Textbooks & Handouts</div>
                      <div className="text-xs text-slate-400">$45.00 of $60.00 target</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">75%</span>
                </div>

                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div>
                      <div className="text-sm font-semibold text-slate-100">Cafeteria & Snacks</div>
                      <div className="text-xs text-slate-400">$110.00 of $150.00 target</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">73%</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-slate-950 border border-slate-800 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 size={16} /> Budget Status: Safe
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Feature Highlights Bar (Mixed Dark Theme Cards) */}
      <section id="features" className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2 shadow-xl hover:-translate-y-1 transition-transform">
            <Zap className="text-blue-400" size={24} />
            <h3 className="font-bold text-white text-base">Dynamic Limits</h3>
            <p className="text-xs text-slate-300">Recalculates your daily safe spending after every expense or income top-up.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:-translate-y-1 transition-transform">
            <Layers className="text-indigo-600" size={24} />
            <h3 className="font-bold text-slate-900 text-base">Targeted Vaults</h3>
            <p className="text-xs text-slate-600">Lock money away specifically for handouts, hostel dues, or campus food.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2 shadow-xl hover:-translate-y-1 transition-transform">
            <RefreshCw className="text-emerald-400" size={24} />
            <h3 className="font-bold text-white text-base">Flexible Cycles</h3>
            <p className="text-xs text-slate-300">Supports weekly allowances, monthly stipends, or lump-sum grants.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:-translate-y-1 transition-transform">
            <Lock className="text-amber-600" size={24} />
            <h3 className="font-bold text-slate-900 text-base">Private & Cloud Sync</h3>
            <p className="text-xs text-slate-600">Powered by secure database infrastructure, accessible from any device.</p>
          </div>

        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">The Blueprint</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Three Steps to Financial Peace of Mind
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            No complex accounting knowledge required. Designed specifically around campus living habits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-4 hover:border-blue-300 transition-all shadow-xs">
            <div className="text-4xl font-black text-blue-100">01</div>
            <h3 className="text-xl font-bold text-slate-900">Set Your Income Profile</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tell UniVault whether you get allowance weekly, monthly, or as a semester grant. Input your base amount to set the total pool.
            </p>
          </div>

          {/* Dark Card for Step 02 */}
          <div className="bg-slate-900 border border-slate-800 text-white p-8 rounded-2xl space-y-4 hover:border-blue-500/50 transition-all shadow-xl">
            <div className="text-4xl font-black text-slate-700">02</div>
            <h3 className="text-xl font-bold text-white">Organize Custom Vaults</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create dedicated goal pots for essential expenses like textbooks, hostel fees, data plans, or cafeteria meals.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-2xl space-y-4 hover:border-blue-300 transition-all shadow-xs">
            <div className="text-4xl font-black text-blue-100">03</div>
            <h3 className="text-xl font-bold text-slate-900">Log & Spend Safely</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Log daily expenses in seconds. UniVault updates your real-time daily safe limit so you never run out of funds unexpectedly.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Interactive Demo Feature Box (Dark Modern Theme) */}
      <section id="vaults" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 grid lg:grid-cols-12 gap-8 items-center shadow-2xl text-white">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck size={14} /> Smart Budgeting Engine
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Know exactly how much you can spend every day.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Instead of giving you overwhelming charts, UniVault cuts through the noise and provides a single key metric: your daily safe spend.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-400" /> Auto-updates when you log top-ups or purchases
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-400" /> Isolates goal vaults from daily spending cash
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-blue-400" /> Zero manual spreadsheet maintenance required
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">Simulation Mode</span>
              <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 font-medium">Live Calculation</span>
            </div>
            
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 shadow-inner">
              <div className="text-xs text-slate-400">Calculated Daily Safe Limit</div>
              <div className="text-3xl font-extrabold text-emerald-400">$18.25 <span className="text-xs text-slate-400 font-normal">per day</span></div>
              <div className="text-xs text-slate-400">Based on $128 remaining pool over 7 days</div>
            </div>

            <button 
              onClick={onLaunchApp}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md cursor-pointer"
            >
              Launch Dashboard & Try
            </button>
          </div>
        </div>
      </section>

      {/* 6. Free Student Plan Section (Dark Contrast Card) */}
      <section id="pricing" className="py-20 px-6 max-w-4xl mx-auto text-center">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Simple Access</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 mb-12">
          100% Free for Students
        </h2>

        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 md:p-10 shadow-2xl relative text-left">
          <div className="absolute -top-3.5 right-8 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Campus Ready
          </div>

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 pb-8 border-b border-slate-800">
            <div>
              <h3 className="text-2xl font-bold text-white">Full Student Access</h3>
              <p className="text-sm text-slate-300 mt-1">Everything you need to track allowances, vaults, and expenses.</p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-4xl font-extrabold text-white">$0</div>
              <div className="text-xs text-slate-400">Free forever for students</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 py-8 text-sm text-slate-300">
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-400" /> Unlimited Vaults</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-400" /> Dynamic Safe-to-Spend limit</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-400" /> Real-time Supabase sync</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-400" /> Allowance & Top-up logging</div>
          </div>

          <button 
            onClick={onLaunchApp}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg transition-all cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* 7. Footer Section (Dark Theme) */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Wallet size={22} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  UniVault
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Smart dynamic budgeting tailored for university students. Track daily safe spending limits, save into custom vaults, and avoid end-of-semester cash shortages.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#vaults" className="hover:text-white transition-colors">Smart Vaults</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Student Plan</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Tech Stack</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><span>React & Vite</span></li>
                <li><span>Tailwind CSS</span></li>
                <li><span>Supabase DB</span></li>
                <li><span>Zustand State</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Developer</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Albertdev.tech ↗
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
              <span>© {new Date().getFullYear()}</span>
              <a 
                href={PORTFOLIO_URL} 
                target="_blank" 
                rel="noreferrer" 
                className="text-slate-300 hover:text-white font-semibold transition-colors underline decoration-slate-700 underline-offset-4 hover:decoration-white"
              >
                Albertdev.tech
              </a>
              <span>. All rights reserved.</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-slate-400">
              
              {/* GitHub */}
              <a 
                href={GITHUB_URL} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GitHub"
                className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href={INSTAGRAM_URL} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href={LINKEDIN_URL} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn"
                className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}