import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import Auth from './Auth';
import { Wallet, ArrowRight } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Navigation states: 'welcome' | 'auth' | 'landing' | 'dashboard'
  const [currentView, setCurrentView] = useState('welcome');

  useEffect(() => {
    // 1. Fetch current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // If already logged in, show the Landing Page first
        setCurrentView('landing');
      }
      setLoading(false);
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Upon logging in/signing up, navigate to the Landing Page
        setCurrentView('landing');
      } else {
        setCurrentView('welcome');
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-medium animate-pulse">Loading UniVault...</div>
      </div>
    );
  }

  // --- STEP 4: TOOL / DASHBOARD VIEW ---
  if (session && currentView === 'dashboard') {
    return <Dashboard session={session} />;
  }

  // --- STEP 3: LANDING PAGE VIEW (Shown after sign-in) ---
  if (session && currentView === 'landing') {
    return (
      <LandingPage 
        onLaunchApp={() => setCurrentView('dashboard')} 
      />
    );
  }

  // --- STEP 2: SIGN UP / SIGN IN VIEW ---
  if (currentView === 'auth') {
    return <Auth onBack={() => setCurrentView('welcome')} />;
  }

  // --- STEP 1: WELCOME SCREEN (First page when opening site) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100/60 via-purple-50/40 to-blue-100/50 flex flex-col justify-center items-center p-4">
      
      {/* Welcome Card matching your image layout */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl shadow-indigo-500/10 text-center space-y-6">
        
        {/* App Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Wallet size={32} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome to UniVault
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            Your smart campus budget & daily spending limit manager.
          </p>
        </div>

        {/* Get Started Button -> Goes to Auth Page */}
        <div className="pt-2">
          <button
            onClick={() => setCurrentView('auth')}
            className="w-full py-4 px-6 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer text-base"
          >
            <span>Get Started</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>

      </div>

    </div>
  );
}