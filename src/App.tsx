
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ListFilter, 
  Settings, 
  ScanLine, 
  Menu, 
  X, 
  Calculator, 
  HeartHandshake, 
  Sparkles, 
  BookOpen, 
  Truck,
  ShoppingBag,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { storageService } from './services/storage';
import { calculateShoppingList } from './services/shoppingListService';
import { runGlobalAutomation } from './services/automationService';
import { INITIAL_DATA } from './constants';
import { Snake, SnakeLog, CollectionData, Pairing, Clutch, InventoryItem } from './types';

// Components
import { Dashboard } from './components/Dashboard';
import { SnakeTable } from './components/SnakeTable';
import { AvailableSnakes } from './components/AvailableSnakes';
import { ShoppingList } from './components/ShoppingList';
import { BreedingManager } from './components/BreedingManager';
import { GeneticCalculator } from './components/GeneticCalculator';
import { DreamComboPlanner } from './components/DreamComboPlanner';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { Logo } from './components/Logo';
import { ActionCenter } from './components/ActionCenter';
import { ThemeToggle } from './components/ThemeToggle';
import { InventoryManager } from './components/InventoryManager';
import { GrowthForecaster } from './components/GrowthForecaster';

// Modals
import { SnakeDetailModal } from './components/SnakeDetailModal';
import { SnakeEditModal } from './components/SnakeEditModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { AILabModal } from './components/AILabModal';
import { ScannerModal } from './components/ScannerModal';
import { CareGuideModal } from './components/CareGuideModal';
import { TermsModal } from './components/TermsModal';
import { SitemapModal } from './components/SitemapModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';

const AppContent = () => {
  const { user } = useAuth();
  const isAdmin = !!user;

  // -- State --
  const [activeTab, setActiveTab] = useState<'home' | 'collection' | 'available' | 'breeding' | 'calculator' | 'logistics'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Data State
  const [data, setData] = useState<CollectionData>(INITIAL_DATA);
  
  // Modal State
  const [selectedSnake, setSelectedSnake] = useState<Snake | null>(null);
  const [editingSnake, setEditingSnake] = useState<Snake | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAILab, setShowAILab] = useState(false);
  const [aiLabInitialTab, setAiLabInitialTab] = useState<'copy' | 'advisor' | 'newsletter'>('copy');
  const [showCareGuide, setShowCareGuide] = useState(false);
  const [showInventoryManager, setShowInventoryManager] = useState(false);
  const [showGrowthForecaster, setShowGrowthForecaster] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // -- Effects --

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('progenix_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('progenix_theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const load = async () => {
      const loaded = await storageService.loadData();
      if (loaded) {
        setData(prev => ({ ...prev, ...loaded }));
      }
    };
    load();
  }, []);
  
  // Recalculate shopping list when snake or inventory data changes
  useEffect(() => {
    const newShoppingList = calculateShoppingList(data.snakes, data.inventory);
    // Use stringify for a simple deep-ish comparison to prevent infinite loops
    if (JSON.stringify(newShoppingList) !== JSON.stringify(data.preyShoppingList)) {
      setData(prev => ({ ...prev, preyShoppingList: newShoppingList }));
    }
  }, [data.snakes, data.inventory]);

  useEffect(() => {
    // Save whenever data changes - ONLY if Admin to prevent local corruption by visitors
    // Note: LocalStorage is client-side, so saving there is fine, but we restrict logical updates below.
    if (data.snakes !== INITIAL_DATA.snakes) storageService.save('progenix_snakes', data.snakes);
    if (data.pairings !== INITIAL_DATA.pairings) storageService.save('progenix_pairings', data.pairings);
    if (data.clutches !== INITIAL_DATA.clutches) storageService.save('progenix_clutches', data.clutches);
    if (data.inventory !== INITIAL_DATA.inventory) storageService.save('progenix_inventory', data.inventory);
    // Note: subscribers saved explicitly via handleSubscribe to allow public access
  }, [data.snakes, data.pairings, data.clutches, data.inventory]);

  // Security: Redirect if on restricted tab and logged out
  // NOTE: Breeding is now public (Read Only), Logistics remains Admin Only
  useEffect(() => {
      if (!isAdmin && activeTab === 'logistics') {
          setActiveTab('home');
      }
  }, [isAdmin, activeTab]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // -- Handlers (SECURED) --

  const handleAddSnake = (newSnake: Snake) => {
    if (!isAdmin) return; // Security Guard
    setData(prev => ({ ...prev, snakes: [...prev.snakes, newSnake] }));
  };

  const handleUpdateSnake = (updatedSnake: Snake) => {
    if (!isAdmin) return; // Security Guard
    setData(prev => ({
      ...prev,
      snakes: prev.snakes.map(s => s.id === updatedSnake.id ? updatedSnake : s)
    }));
    // If updating currently viewed snake
    if (selectedSnake?.id === updatedSnake.id) {
        setSelectedSnake(updatedSnake);
    }
  };

  const handleDeleteSnake = (id: string) => {
    if (!isAdmin) return; // Security Guard
    if (window.confirm(`Are you sure you want to delete ${id}?`)) {
      setData(prev => ({
        ...prev,
        snakes: prev.snakes.filter(s => s.id !== id)
      }));
      setSelectedSnake(null);
    }
  };

  const handleAddLog = (snakeId: string, log: SnakeLog) => {
    if (!isAdmin) return; // Security Guard
    setData(prev => ({
      ...prev,
      snakes: prev.snakes.map(s => {
        if (s.id === snakeId) {
           // Also update stats if needed
           const updates: Partial<Snake> = {};
           if (log.type === 'Weight') updates.currentWeight = log.weight;
           if (log.type === 'Feeding') {
               updates.feeding = { ...s.feeding, dueFeed: false }; // Reset feed flag
           }
           
           return {
             ...s,
             ...updates,
             logs: [log, ...s.logs]
           };
        }
        return s;
      })
    }));
    
    // Update local selected state to reflect changes immediately
    if (selectedSnake?.id === snakeId) {
        const current = data.snakes.find(s => s.id === snakeId);
        if (current) {
            const updates: Partial<Snake> = {};
            if (log.type === 'Weight') updates.currentWeight = log.weight;
            if (log.type === 'Feeding') updates.feeding = { ...current.feeding, dueFeed: false };
            
            setSelectedSnake({ ...current, ...updates, logs: [log, ...current.logs] });
        }
    }
  };

  const handleUpdateLog = (snakeId: string, updatedLog: SnakeLog) => {
    if (!isAdmin) return;
    setData(prev => ({
      ...prev,
      snakes: prev.snakes.map(s => {
        if (s.id === snakeId) {
          const newLogs = s.logs.map(l => l.id === updatedLog.id ? updatedLog : l);
          
          // Re-update currentWeight if the most recent weight log was updated
          const weightLogs = newLogs.filter(l => l.type === 'Weight') as WeightLogEntry[];
          const sortedWeights = [...weightLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const currentWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : s.currentWeight;

          return { ...s, logs: newLogs, currentWeight };
        }
        return s;
      })
    }));

    if (selectedSnake?.id === snakeId) {
      setSelectedSnake(prev => {
        if (!prev) return null;
        const newLogs = prev.logs.map(l => l.id === updatedLog.id ? updatedLog : l);
        const weightLogs = newLogs.filter(l => l.type === 'Weight') as WeightLogEntry[];
        const sortedWeights = [...weightLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const currentWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : prev.currentWeight;
        return { ...prev, logs: newLogs, currentWeight };
      });
    }
  };

  const handleDeleteLog = (snakeId: string, logId: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this log entry?")) return;

    setData(prev => ({
      ...prev,
      snakes: prev.snakes.map(s => {
        if (s.id === snakeId) {
          const newLogs = s.logs.filter(l => l.id !== logId);
          
          // Re-update currentWeight
          const weightLogs = newLogs.filter(l => l.type === 'Weight') as WeightLogEntry[];
          const sortedWeights = [...weightLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const currentWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : s.currentWeight;

          return { ...s, logs: newLogs, currentWeight };
        }
        return s;
      })
    }));

    if (selectedSnake?.id === snakeId) {
      setSelectedSnake(prev => {
        if (!prev) return null;
        const newLogs = prev.logs.filter(l => l.id !== logId);
        const weightLogs = newLogs.filter(l => l.type === 'Weight') as WeightLogEntry[];
        const sortedWeights = [...weightLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const currentWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : prev.currentWeight;
        return { ...prev, logs: newLogs, currentWeight };
      });
    }
  };

  const handleBulkAction = (ids: string[], logTemplate: Partial<SnakeLog>) => {
      if (!isAdmin) return; // Security Guard
      setData(prev => ({
          ...prev,
          snakes: prev.snakes.map(s => {
              if (ids.includes(s.id)) {
                  const newLog: SnakeLog = {
                      id: `${logTemplate.type}-${Date.now()}-${Math.random()}`,
                      date: logTemplate.date || new Date().toISOString().split('T')[0],
                      notes: logTemplate.notes,
                      ...(logTemplate as any)
                  };
                  
                  const updates: Partial<Snake> = {};
                  if (newLog.type === 'Weight') updates.currentWeight = newLog.weight;
                  if (newLog.type === 'Feeding') updates.feeding = { ...s.feeding, dueFeed: false };

                  return { ...s, ...updates, logs: [newLog, ...s.logs] };
              }
              return s;
          })
      }));
  };
  
  // Breeding Handlers (SECURED)
  const handleAddPairing = (p: Pairing) => {
      if (!isAdmin) return;
      setData(prev => ({ ...prev, pairings: [...prev.pairings, p] }));
  };
  const handleUpdatePairing = (p: Pairing) => {
      if (!isAdmin) return;
      setData(prev => ({ ...prev, pairings: prev.pairings.map(x => x.id === p.id ? p : x) }));
  };
  const handleDeletePairing = (id: string) => {
      if (!isAdmin) return;
      setData(prev => ({ ...prev, pairings: prev.pairings.filter(x => x.id !== id) }));
  };

  const handleAddClutch = (c: Clutch) => {
      if (!isAdmin) return;
      setData(prev => ({ ...prev, clutches: [...prev.clutches, c] }));
  };
  const handleUpdateClutch = (c: Clutch) => {
      if (!isAdmin) return;
      setData(prev => ({ ...prev, clutches: prev.clutches.map(x => x.id === c.id ? c : x) }));
  };
  const handleDeleteClutch = (id: string) => {
      if (!isAdmin) return;
      setData(prev => ({ ...prev, clutches: prev.clutches.filter(x => x.id !== id) }));
  };
  
  const handleScan = (text: string) => {
      // Scanning is read-only action, but generally admin only feature
      try {
          const json = JSON.parse(text);
          if (json.id) {
              const snake = data.snakes.find(s => s.id === json.id);
              if (snake) {
                  setSelectedSnake(snake);
                  setShowScanner(false);
              } else {
                  alert("Reptile ID not found in collection.");
              }
          }
      } catch (e) {
          const snake = data.snakes.find(s => s.id === text);
          if (snake) {
               setSelectedSnake(snake);
               setShowScanner(false);
          } else {
              alert("Invalid QR Code.");
          }
      }
  };

  const handleSubscribe = async (email: string) => {
      const currentSubscribers = data.subscribers || [];
      if (!currentSubscribers.includes(email)) {
          const updatedSubscribers = [...currentSubscribers, email];
          setData(prev => ({ ...prev, subscribers: updatedSubscribers }));
          // Explicit save for public access (assuming backend allows it)
          await storageService.save('progenix_subscribers', updatedSubscribers);
      }
  };
  
  const handleRunAutomation = () => {
    if (!isAdmin) return;
    if (window.confirm("This will overwrite existing feeding schedules for all non-sold animals based on their current weight. Are you sure?")) {
        const updatedSnakes = runGlobalAutomation(data.snakes);
        setData(prev => ({ ...prev, snakes: updatedSnakes }));
        alert(`${updatedSnakes.filter(s => s.status !== 'Sold').length} animal schedules have been updated.`);
    }
  };

  const handleUpdateInventory = (newInventory: InventoryItem[]) => {
    if (!isAdmin) return;
    setData(prev => ({ ...prev, inventory: newInventory }));
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'collection', label: 'Collection', icon: ListFilter },
    { id: 'available', label: 'Available', icon: ShoppingBag }, // New Public Tab
    { id: 'breeding', label: 'Breeding', icon: HeartHandshake }, // Now Public
    { id: 'calculator', label: 'Genetics', icon: Calculator },
    // Logistics remains Admin Only
    ...(isAdmin ? [
        { id: 'logistics', label: 'Logistics', icon: Truck }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30 transition-colors duration-300">
       
       {/* --- HEADER --- */}
       <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 transition-colors duration-300 shadow-sm shadow-black/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               
               {/* Logo */}
               <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('home')}>
                  <Logo />
               </div>

               {/* Desktop Nav */}
               <nav className="hidden md:flex items-center gap-0.5">
                  {navItems.map(item => (
                     <button
                       key={item.id}
                       onClick={() => setActiveTab(item.id as any)}
                       className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                         activeTab === item.id 
                           ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                           : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                       }`}
                     >
                        <item.icon size={15} />
                        {item.label}
                     </button>
                  ))}
                  <button
                    onClick={() => setShowCareGuide(true)}
                    className="px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <BookOpen size={15} />
                    Care Guide
                  </button>
               </nav>

               {/* Actions */}
               <div className="flex items-center gap-2">
                  <ThemeToggle theme={theme} setTheme={setTheme} />
                  {isAdmin && (
                    <>
                        <button 
                            onClick={() => setShowScanner(true)}
                            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            title="Scan QR"
                        >
                            <ScanLine size={20} />
                        </button>
                        <button 
                            onClick={() => {
                                setAiLabInitialTab('copy');
                                setShowAILab(true);
                            }}
                            className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors"
                            title="AI Lab"
                        >
                            <Sparkles size={20} />
                        </button>
                        <button 
                            onClick={() => setShowSettings(true)}
                            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <Settings size={20} />
                        </button>
                    </>
                  )}
                  
                  {/* Auth Indicator */}
                  {!isAdmin && (
                      <button 
                        onClick={() => setShowAuth(true)} 
                        className="text-xs font-bold px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg ml-2 hover:opacity-90 transition-all"
                      >
                        Login
                      </button>
                  )}

                   {/* Mobile Menu Btn */}
                   <button 
                     className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                     onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                   >
                      {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                   </button>
               </div>
            </div>
         </div>
       </header>

       {/* --- MOBILE MENU --- */}
       {mobileMenuOpen && (
         <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="px-4 pt-2 pb-4 space-y-1">
               {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors ${
                            activeTab === item.id 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                            : 'text-slate-500'
                        }`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}
                 <button
                    onClick={() => { setShowCareGuide(true); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <BookOpen size={20} />
                    New Keeper Guide
                </button>
            </div>
         </div>
       )}

       {/* --- MAIN CONTENT --- */}
       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-140px)]">
          
          {activeTab === 'home' && (
             <div className="animate-fade-in">
                <Hero 
                    metrics={data.keyMetrics} 
                    pairingCount={data.pairings.length}
                    onViewCollection={() => setActiveTab('collection')} 
                />
                <div className="mb-8"></div>
                <Dashboard 
                    snakes={data.snakes} 
                    clutches={data.clutches} 
                    onViewCollection={() => setActiveTab('collection')}
                />
             </div>
          )}

          {activeTab === 'collection' && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Collection Manager</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Browse inventory, weights, and genetics.</p>
                    </div>
                </div>
                <SnakeTable 
                   snakes={data.snakes} 
                   onSnakeClick={setSelectedSnake} 
                   onAddSnake={() => setEditingSnake({} as any)} 
                   onBulkAction={handleBulkAction}
                   isReadOnly={!isAdmin}
                />
             </div>
          )}

          {activeTab === 'available' && (
             <AvailableSnakes 
                snakes={data.snakes} 
                onSnakeClick={setSelectedSnake} // Enable detail view on click
             />
          )}

          {activeTab === 'breeding' && (
             <div className="animate-fade-in">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Breeding Projects</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track pairings, clutches, and incubation.</p>
                </div>
                <BreedingManager 
                   pairings={data.pairings}
                   clutches={data.clutches}
                   snakes={data.snakes}
                   onAddPairing={handleAddPairing}
                   onUpdatePairing={handleUpdatePairing}
                   onDeletePairing={handleDeletePairing}
                   onAddClutch={handleAddClutch}
                   onUpdateClutch={handleUpdateClutch}
                   onDeleteClutch={handleDeleteClutch}
                   onAddSnake={handleAddSnake}
                   onUpdateSnake={handleUpdateSnake} // Passed for Holdback Evaluator
                   isReadOnly={!isAdmin} // Enforce Read Only for visitors
                />
             </div>
          )}

          {activeTab === 'calculator' && (
             <div className="animate-fade-in">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Genetic Tools</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Predict outcomes and plan future projects.</p>
                </div>
                <GeneticCalculator snakes={data.snakes} />
                <DreamComboPlanner snakes={data.snakes} />
             </div>
          )}

          {activeTab === 'logistics' && isAdmin && (
              <div className="animate-fade-in">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Logistics & Supply</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Shopping lists and care resources.</p>
                </div>
                <div className="mb-8">
                    <ActionCenter 
                        snakes={data.snakes} 
                        clutches={data.clutches} 
                        subscribers={data.subscribers}
                        onOpenNewsletter={() => {
                            setAiLabInitialTab('newsletter');
                            setShowAILab(true);
                        }}
                        onRunAutomation={handleRunAutomation}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ShoppingList data={data.preyShoppingList} />
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                          <BookOpen className="text-emerald-500" size={20} />
                          Resources
                      </h3>
                      <div className="space-y-3">
                          <button onClick={() => setShowCareGuide(true)} className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                              <span className="font-bold text-slate-700 dark:text-slate-300">New Keeper Guide</span>
                              <ArrowRight size={16} className="text-slate-400" />
                          </button>
                          <button onClick={() => setShowInventoryManager(true)} className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                              <span className="font-bold text-slate-700 dark:text-slate-300">Manage Inventory</span>
                              <ArrowRight size={16} className="text-slate-400" />
                          </button>
                          <button onClick={() => setShowGrowthForecaster(true)} className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                              <span className="font-bold text-slate-700 dark:text-slate-300">Smart Growth Forecaster</span>
                              <TrendingUp size={16} className="text-slate-400" />
                          </button>
                      </div>
                    </div>
                </div>
              </div>
          )}

       </main>

       {/* --- FOOTER --- */}
       <Footer 
        onNavigate={setActiveTab} 
        onSubscribe={handleSubscribe} 
        onOpenTerms={() => setShowTerms(true)}
        onOpenSitemap={() => setShowSitemap(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
       />

       {/* --- MODALS --- */}
       
       {/* Detail Modal */}
       {selectedSnake && !editingSnake && (
        <SnakeDetailModal 
          snake={selectedSnake} 
          onClose={() => setSelectedSnake(null)} 
          onEdit={() => setEditingSnake(selectedSnake)}
          onDelete={() => handleDeleteSnake(selectedSnake.id)}
          onAddLog={handleAddLog}
          onUpdateLog={handleUpdateLog}
          onDeleteLog={handleDeleteLog}
          isReadOnly={!isAdmin}
        />
      )}

      {/* Edit/Add Modal - Guarded against non-admins even if logic calls it */}
      {editingSnake && isAdmin && (
        <SnakeEditModal 
          snake={editingSnake.id ? editingSnake : null} 
          allSnakes={data.snakes} // Passed for ID generation logic
          onSave={(s) => {
             if (editingSnake.id) handleUpdateSnake(s);
             else handleAddSnake(s);
          }} 
          onClose={() => setEditingSnake(null)} 
        />
      )}

      {/* Settings Modal - Admin Only */}
      {showSettings && isAdmin && (
         <SettingsModal 
           currentData={data} 
           onDataImported={(d) => setData(prev => ({ ...prev, ...d }))} 
           onClose={() => setShowSettings(false)} 
         />
      )}

      {/* Auth Modal */}
      {showAuth && (
         <AuthModal 
            isOpen={showAuth} 
            onClose={() => setShowAuth(false)} 
            onLoginSuccess={() => setShowAuth(false)} 
         />
      )}

      {/* Scanner Modal - Admin Only */}
      {showScanner && isAdmin && (
         <ScannerModal 
            onClose={() => setShowScanner(false)} 
            onScan={handleScan} 
         />
      )}

      {/* AI Lab Modal - Admin Only */}
      {showAILab && isAdmin && (
         <AILabModal 
            snakes={data.snakes}
            subscribers={data.subscribers || []}
            initialTab={aiLabInitialTab}
            onClose={() => setShowAILab(false)}
         />
      )}

      {/* Care Guide Modal */}
      {showCareGuide && (
          <CareGuideModal onClose={() => setShowCareGuide(false)} />
      )}

      {/* Inventory Manager Modal - Admin Only */}
      {showInventoryManager && isAdmin && (
          <InventoryManager
              inventory={data.inventory}
              onUpdateInventory={handleUpdateInventory}
              onClose={() => setShowInventoryManager(false)}
          />
      )}

      {/* Growth Forecaster Modal - Admin Only */}
      {showGrowthForecaster && isAdmin && (
          <GrowthForecaster 
              snakes={data.snakes}
              onClose={() => setShowGrowthForecaster(false)}
          />
      )}

      {/* Terms of Sale Modal */}
      {showTerms && (
          <TermsModal onClose={() => setShowTerms(false)} />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
          <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />
      )}

      {/* Sitemap Modal */}
      {showSitemap && (
          <SitemapModal 
            onClose={() => setShowSitemap(false)}
            onNavigate={(tab) => { setActiveTab(tab); setShowSitemap(false); }}
            onOpenCareGuide={() => { setShowCareGuide(true); setShowSitemap(false); }}
            onOpenTerms={() => { setShowTerms(true); setShowSitemap(false); }}
            onOpenLogin={() => { setShowAuth(true); setShowSitemap(false); }}
            onOpenPrivacy={() => { setShowPrivacy(true); setShowSitemap(false); }}
          />
      )}

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
