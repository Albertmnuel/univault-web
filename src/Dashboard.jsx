import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { 
  Wallet, PlusCircle, ArrowDownCircle, LogOut, PieChart, 
  History, Calendar, TrendingUp, X, RefreshCw,
  ArrowUpRight, ShieldCheck, Users, Layers, Activity, Trash2
} from 'lucide-react';

// SET YOUR ADMIN EMAIL HERE
const ADMIN_EMAIL = 'albertemmanuel981@gmail.com';

export default function Dashboard({ session }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [vaults, setVaults] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Admin Panel State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Income Setup Modal State
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeCycle, setIncomeCycle] = useState('weekly');
  const [allowanceAmount, setAllowanceAmount] = useState('');
  
  // Quick Top-Up Modal State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpSource, setTopUpSource] = useState('Stipend / Allowance');

  // Vault Form State
  const [vaultName, setVaultName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  
  // Transaction Form States
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [selectedVault, setSelectedVault] = useState('');
  const [description, setDescription] = useState('');

  // Fetch Admin Metrics
  const fetchAdminMetrics = async () => {
    setLoadingAdmin(true);
    try {
      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .single();

      if (error) throw error;
      setAdminMetrics(data);
    } catch (err) {
      console.error('Error fetching admin metrics:', err.message);
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Fetch Transactions helper
  const fetchTransactions = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    setRefreshing(true);
    try {
      const { data: txData, error: txErr } = await supabase
        .from('transactions')
        .select('*, vaults(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (txErr) throw txErr;
      setTransactions(txData || []);
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
    } finally {
      setRefreshing(false);
    }
  }, [session?.user?.id]);

  // Global Refresh Handler
  const handleRefreshAll = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    setRefreshing(true);
    try {
      // 1. Refresh Vaults
      const { data: vaultData } = await supabase
        .from('vaults')
        .select('*')
        .eq('user_id', userId);
      if (vaultData) setVaults(vaultData);

      // 2. Refresh Transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*, vaults(name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (txData) setTransactions(txData);

      // 3. Refresh Profile Info
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (profData) setProfile(profData);

    } catch (err) {
      console.error('Error refreshing dashboard data:', err.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Delete Individual Transaction
  const handleDeleteTransaction = async (txToDelete) => {
    if (!confirm('Are you sure you want to delete this transaction entry?')) return;

    try {
      // 1. Delete from Supabase
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', txToDelete.id);

      if (error) throw error;

      // 2. Revert vault amount if transaction was linked to a vault
      if (txToDelete.vault_id) {
        const vaultToUpdate = vaults.find((v) => v.id === txToDelete.vault_id);
        if (vaultToUpdate) {
          const currentVal = Number(vaultToUpdate.current_amount) || 0;
          const txAmt = Number(txToDelete.amount) || 0;
          
          // Revert: If it was expense, add it back. If income, deduct it.
          const newBalance = txToDelete.type === 'expense'
            ? currentVal + txAmt
            : Math.max(currentVal - txAmt, 0);

          await supabase
            .from('vaults')
            .update({ current_amount: newBalance })
            .eq('id', txToDelete.vault_id);

          setVaults((prev) =>
            prev.map((v) => (v.id === txToDelete.vault_id ? { ...v, current_amount: newBalance } : v))
          );
        }
      }

      // 3. Remove locally
      setTransactions((prev) => prev.filter((t) => t.id !== txToDelete.id));

    } catch (err) {
      alert(err.message);
    }
  };

  // Clear All Transaction History
  const handleClearAllHistory = async () => {
    const userId = session?.user?.id;
    if (!userId) return;

    if (!confirm('⚠️ Are you sure you want to CLEAR ALL transaction history? This action cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setTransactions([]);
    } catch (err) {
      alert(`Failed to clear history: ${err.message}`);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Profile Info
        const { data: profData, error: profErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profErr) throw profErr;
        
        if (isMounted) {
          setProfile(profData);
          if (!profData?.income_cycle || profData?.allowance_amount === undefined) {
            setShowIncomeModal(true);
          } else {
            setIncomeCycle(profData.income_cycle);
            setAllowanceAmount(profData.allowance_amount.toString());
          }
        }

        // 2. Fetch Vaults
        const { data: vaultData, error: vaultErr } = await supabase
          .from('vaults')
          .select('*')
          .eq('user_id', session.user.id);

        if (vaultErr) throw vaultErr;
        if (isMounted) setVaults(vaultData || []);

        // 3. Fetch Transactions
        const { data: txData, error: txErr } = await supabase
          .from('transactions')
          .select('*, vaults(name)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (txErr) throw txErr;
        if (isMounted) setTransactions(txData || []);

      } catch (err) {
        console.error('Data loading error:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchDashboardData();
    }

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id]);

  // Save Initial or Updated Base Income Schedule
  const handleSaveIncomeSetup = async (e) => {
    e.preventDefault();
    try {
      const baseAllowance = parseFloat(allowanceAmount) || 0;

      const { data: existingProf } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      let error;
      if (existingProf) {
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({
            income_cycle: incomeCycle,
            allowance_amount: baseAllowance,
          })
          .eq('id', session.user.id);
        error = updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            income_cycle: incomeCycle,
            allowance_amount: baseAllowance,
          });
        error = insertErr;
      }

      if (error) throw error;

      setProfile((prev) => ({ ...prev, income_cycle: incomeCycle, allowance_amount: baseAllowance }));
      setShowIncomeModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Log Top-Up Money
  const handleAddTopUp = async (e) => {
    e.preventDefault();
    if (!topUpAmount) return;

    try {
      const addedAmt = parseFloat(topUpAmount);

      const { data: txData, error: txErr } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: session.user.id,
            amount: addedAmt,
            type: 'income',
            category: 'Top-Up',
            description: topUpSource || 'Top-Up Allowance',
          },
        ])
        .select('*, vaults(name)');

      if (txErr) throw txErr;

      if (txData && txData.length > 0) {
        setTransactions((prev) => [txData[0], ...prev]);
      }

      setTopUpAmount('');
      setTopUpSource('Stipend / Allowance');
      setShowTopUpModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Vault Target
  const handleCreateVault = async (e) => {
    e.preventDefault();
    if (!vaultName || !targetAmount) return;

    try {
      const { data, error } = await supabase.from('vaults').insert([
        {
          user_id: session.user.id,
          name: vaultName,
          target_amount: parseFloat(targetAmount),
          current_amount: 0,
        },
      ]).select();

      if (error) throw error;
      setVaults((prev) => [...prev, ...data]);
      setVaultName('');
      setTargetAmount('');
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Vault
  const handleDeleteVault = async (vaultId) => {
    if (!confirm('Are you sure you want to delete this vault?')) return;

    try {
      const { error } = await supabase
        .from('vaults')
        .delete()
        .eq('id', vaultId);

      if (error) throw error;
      setVaults((prev) => prev.filter((v) => v.id !== vaultId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Log Expense or Income
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount) return;

    const txAmount = parseFloat(amount);

    try {
      // 1. Insert transaction
      const { data: newTx, error: txError } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: session.user.id,
            vault_id: selectedVault || null,
            amount: txAmount,
            type: type,
            category: category,
            description: description,
          },
        ])
        .select('*, vaults(name)');

      if (txError) throw txError;

      // 2. Update vault balance logic
      if (selectedVault) {
        const vaultToUpdate = vaults.find((v) => v.id === selectedVault);
        if (vaultToUpdate) {
          const currentVal = Number(vaultToUpdate.current_amount) || 0;
          const newBalance =
            type === 'income'
              ? currentVal + txAmount
              : Math.max(currentVal - txAmount, 0);

          const { error: updateError } = await supabase
            .from('vaults')
            .update({ current_amount: newBalance })
            .eq('id', selectedVault);

          if (updateError) throw updateError;

          setVaults((prev) =>
            prev.map((v) => (v.id === selectedVault ? { ...v, current_amount: newBalance } : v))
          );
        }
      }

      // 3. Update transaction state locally
      if (newTx && newTx.length > 0) {
        setTransactions((prev) => [newTx[0], ...prev]);
      }

      // Reset form
      setAmount('');
      setDescription('');
      setSelectedVault('');
      setCategory('Food');
      setType('expense');
    } catch (err) {
      alert(err.message);
    }
  };

  // Dynamic Calculation Engine
  const calculateDailySafeSpend = () => {
    const cycle = profile?.income_cycle || 'weekly';
    const baseAllowance = Number(profile?.allowance_amount) || 0;

    const extraIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const remainingBalance = (baseAllowance + extraIncome) - totalExpenses;

    let divisor = 7;
    if (cycle === 'monthly') divisor = 30;
    if (cycle === 'lump_sum') divisor = 112; 
    if (cycle === 'irregular') divisor = 7;

    const dailyLimit = Math.max(remainingBalance / divisor, 0).toFixed(2);

    return {
      remainingBalance: Math.max(remainingBalance, 0),
      dailyLimit,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-700 flex justify-center items-center">
        <p className="text-base font-medium text-slate-500 animate-pulse">Loading UniVault Dashboard...</p>
      </div>
    );
  }

  const { remainingBalance, dailyLimit } = calculateDailySafeSpend();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <Wallet size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              UniVault
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAdmin && (
              <button 
                onClick={() => {
                  fetchAdminMetrics();
                  setShowAdminModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                <ShieldCheck size={16} />
                Admin Panel
              </button>
            )}

            <button 
              type="button"
              onClick={() => setShowTopUpModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <PlusCircle size={16} />
              Top-Up Money
            </button>

            <span className="hidden sm:inline-block text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {session?.user?.email}
            </span>

            <button 
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* 1. Stat Summary Cards (DARK THEME) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Daily Safe-to-Spend */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Daily Safe-to-Spend
              </span>
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg font-bold text-sm">
                ₦
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-400">
                ₦{dailyLimit} <span className="text-xs font-normal text-slate-400">/ day</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Calculated dynamically based on your {profile?.income_cycle || 'weekly'} allowance.
              </p>
            </div>
          </div>

          {/* Available Pool */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Available Pool
              </span>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold text-sm">
                ₦
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">
                ₦{remainingBalance.toFixed(2)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Total allowance minus logged expenses.
              </p>
            </div>
          </div>

          {/* Income Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition-all space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Allowance Profile
              </span>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
                <Calendar size={18} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white capitalize">
                {profile?.income_cycle || 'Weekly'} (₦{profile?.allowance_amount || 0})
              </div>
              <button 
                type="button" 
                onClick={() => setShowIncomeModal(true)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1 transition-colors cursor-pointer"
              >
                Change Schedule <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

        </section>

        {/* 2. Action Grid (Create Vault & Log Entry) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Create Vault Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <PlusCircle className="text-blue-600" size={20} />
              <h2>Create New Vault</h2>
            </div>

            <form onSubmit={handleCreateVault} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Vault Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Textbooks, Handouts, Groceries"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Target Budget Amount (₦)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              >
                Add Vault
              </button>
            </form>
          </div>

          {/* Log Expense / Income Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <ArrowDownCircle className="text-emerald-600" size={20} />
              <h2>Log Expense / Income</h2>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Select Vault
                </label>
                <select 
                  value={selectedVault}
                  onChange={(e) => setSelectedVault(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer"
                >
                  <option value="">No Vault (General Campus Expense)</option>
                  {vaults.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Amount (₦)
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Type
                  </label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Category
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all cursor-pointer"
                  >
                    <option value="Food">Food / Cafeteria</option>
                    <option value="Handouts">Handouts / Books</option>
                    <option value="Hostel">Hostel / Dues</option>
                    <option value="Data">Data & Airtime</option>
                    <option value="Transport">Transportation</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Description (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lunch at Cafeteria"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
              >
                Record Entry
              </button>
            </form>
          </div>

        </section>

        {/* 3. Active Vaults Section (DARK THEME) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <PieChart className="text-purple-400" size={20} />
            <h2>Active Vaults</h2>
          </div>

          {vaults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
              <p className="text-sm">No vaults created yet. Add one above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaults.map((vault) => {
                const current = Number(vault.current_amount) || 0;
                const target = Number(vault.target_amount) || 1;
                const percentage = Math.min(Math.max((current / target) * 100, 0), 100);

                return (
                  <div key={vault.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all relative space-y-3">
                    <button 
                      onClick={() => handleDeleteVault(vault.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete Vault"
                    >
                      <X size={16} />
                    </button>

                    <h4 className="text-base font-semibold text-white pr-6">{vault.name}</h4>
                    <div className="text-2xl font-bold text-white">
                      ₦{current.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ ₦{target.toFixed(2)}</span>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${percentage >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. Recent Transactions List (DARK THEME) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <History className="text-amber-400" size={20} />
              <h2>Recent Transactions</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshAll}
                disabled={refreshing}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded-lg cursor-pointer text-xs transition-colors disabled:opacity-50"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>

              {transactions.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  disabled={clearing}
                  className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 font-semibold px-3 py-1.5 rounded-lg cursor-pointer text-xs transition-colors disabled:opacity-50"
                  title="Wipe out all transaction records"
                >
                  <Trash2 size={13} />
                  {clearing ? 'Clearing...' : 'Clear All History'}
                </button>
              )}
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
              <p className="text-sm">No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80 bg-slate-950">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3.5 px-4 hover:bg-slate-900/60 transition-colors">
                  <div>
                    <div className="font-semibold text-sm text-slate-100">{tx.description || tx.category || tx.vaults?.name || 'Transaction'}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Category: {tx.category} {tx.vaults?.name ? `• Vault: ${tx.vaults.name}` : ''} • {new Date(tx.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}₦{Number(tx.amount).toFixed(2)}
                    </div>

                    <button
                      onClick={() => handleDeleteTransaction(tx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete Entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Admin Panel Modal (DARK THEME) */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-2xl w-full shadow-2xl relative space-y-6 text-white">
            <button 
              onClick={() => setShowAdminModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">UniVault Admin Analytics</h3>
                <p className="text-slate-400 text-xs">Live application performance & user registration stats.</p>
              </div>
            </div>

            {loadingAdmin ? (
              <div className="p-12 text-center text-slate-400 animate-pulse text-sm">
                Fetching app metrics...
              </div>
            ) : adminMetrics ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                    <Users size={14} className="text-blue-400" /> Total Registered
                  </div>
                  <div className="text-2xl font-extrabold text-white">{adminMetrics.total_users || 0}</div>
                  <p className="text-[10px] text-slate-500">Users created via Auth</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                    <Activity size={14} className="text-emerald-400" /> Active Profiles
                  </div>
                  <div className="text-2xl font-extrabold text-white">{adminMetrics.configured_profiles || 0}</div>
                  <p className="text-[10px] text-slate-500">Configured allowances</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                    <Layers size={14} className="text-purple-400" /> Total Vaults
                  </div>
                  <div className="text-2xl font-extrabold text-white">{adminMetrics.total_vaults || 0}</div>
                  <p className="text-[10px] text-slate-500">Created across all users</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                    <History size={14} className="text-amber-400" /> Total Transactions
                  </div>
                  <div className="text-2xl font-extrabold text-white">{adminMetrics.total_transactions || 0}</div>
                  <p className="text-[10px] text-slate-500">Logged app-wide</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                    <span className="text-rose-400 font-bold text-xs">₦</span> Volume Expenses
                  </div>
                  <div className="text-xl font-bold text-rose-400">₦{Number(adminMetrics.total_expenses_logged || 0).toFixed(2)}</div>
                  <p className="text-[10px] text-slate-500">Sum of expenses</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                    <span className="text-emerald-400 font-bold text-xs">₦</span> Volume Income
                  </div>
                  <div className="text-xl font-bold text-emerald-400">₦{Number(adminMetrics.total_income_logged || 0).toFixed(2)}</div>
                  <p className="text-[10px] text-slate-500">Sum of deposits</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center">No metric data available.</p>
            )}
          </div>
        </div>
      )}

      {/* Income Setup / Schedule Modal */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-5 text-slate-900">
            <h3 className="text-xl font-bold">Configure Allowance Schedule</h3>
            <p className="text-sm text-slate-500">Set your stipend structure to calculate your daily safe-to-spend limit.</p>
            
            <form onSubmit={handleSaveIncomeSetup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Funding Cycle</label>
                <select 
                  value={incomeCycle} 
                  onChange={(e) => setIncomeCycle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="weekly">Weekly Allowance</option>
                  <option value="monthly">Monthly Allowance</option>
                  <option value="lump_sum">Semester Lump Sum</option>
                  <option value="irregular">Irregular Top-ups</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Base Amount (₦)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g. 10000" 
                  value={allowanceAmount}
                  onChange={(e) => setAllowanceAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all">
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl relative space-y-5 text-slate-900">
            <button 
              onClick={() => setShowTopUpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold">Log Top-Up Money</h3>
            
            <form onSubmit={handleAddTopUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Top-Up Amount (₦)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Source / Note</label>
                <input 
                  type="text" 
                  placeholder="e.g. Allowance from Parents, Side Gig" 
                  value={topUpSource}
                  onChange={(e) => setTopUpSource(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all">
                Add to Available Pool
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}