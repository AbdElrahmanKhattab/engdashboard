import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Briefcase, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Plus, 
  ChevronRight, 
  Bot,
  Send,
  X,
  Search,
  Filter,
  Download,
  FileText,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Client, 
  Project, 
  Sprint, 
  Transaction, 
  ProjectStatus, 
  SprintStatus, 
  TransactionStatus 
} from './types';
import { calculateSprintMetrics, formatCurrency } from './lib/logic';
import { analyzeProject } from './services/aiService';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { FinancialsChart, EfficiencyGauge } from './components/Charts';
import { 
  AddClientModal, 
  AddProjectModal, 
  AddSprintModal, 
  AddTransactionModal,
  AddPaymentModal,
  ModalWrapper
} from './components/Modals';
import { 
  ClientsPage, 
  ProjectsPage, 
  SprintsPage, 
  TransactionsPage, 
  ReportsPage,
  ClientDetailPage,
  ProjectDetailPage,
  SprintDetailPage,
  PhaseDetailPage
} from './components/Pages';

// --- Mock Initial Data ---
const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'Al-Bader Construction', phone: '+971 50 123 4567', notes: 'Major infrastructure client.', penalty_percentage: 5 },
  { id: 'c2', name: 'Zayed Real Estate', phone: '+971 55 987 6543', notes: 'Residential developer.', penalty_percentage: 2 },
  { id: 'c3', name: 'Emirates Logistics', phone: '+971 52 444 8888', notes: 'Supply chain partner.', penalty_percentage: 0 },
];

const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'p1', client_id: 'c1', name: 'Bridge Alpha Design', total_price: 150000, status: 'Active', notes: 'Main span engineering.',
    description: 'Structural design and engineering for the new Alpha Bridge in Dubai.', start_date: '2026-01-01', end_date: '2026-12-31', priority: 'High'
  },
  { 
    id: 'p2', client_id: 'c2', name: 'Villa Complex HVAC', total_price: 45000, status: 'Active', notes: 'Phase 1 installation.',
    description: 'HVAC system design and installation for the new villa complex.', start_date: '2026-02-01', end_date: '2026-06-30', priority: 'Medium'
  },
  { 
    id: 'p3', client_id: 'c3', name: 'Port Terminal Expansion', total_price: 850000, status: 'Active', notes: 'Structural audit and design.',
    description: 'Expansion of the main port terminal including structural audit.', start_date: '2025-11-01', end_date: '2027-01-01', priority: 'High'
  },
];

const INITIAL_SPRINTS: Sprint[] = [
  { 
    id: 's1', project_id: 'p1', name: 'Concept Design', description: 'Initial concept and sketches.', base_amount: 30000, amount_paid: 30000, deadline_date: '2026-02-15',
    ...calculateSprintMetrics({ base_amount: 30000, amount_paid: 30000, deadline_date: '2026-02-15' }),
    phases: [
      { 
        id: 'ph1', name: 'Sketches', status: 'Done', payment_status: 'Paid', 
        description: 'Initial sketches and conceptual layout.',
        description_past: 'Completed initial client briefing and site survey. Drafted 3 preliminary sketches.',
        description_future: 'Move to 3D modeling based on selected sketch.',
        documents: [{ name: 'Site Survey.pdf', url: '#', date: '2026-01-10' }],
        links: [{ title: 'Design Inspiration', url: 'https://pinterest.com' }]
      },
      { 
        id: 'ph2', name: '3D Model', status: 'Done', payment_status: 'Paid', 
        description: 'Basic 3D model and volumetric study.',
        description_past: 'Developed 3D model in Revit. Performed volumetric analysis.',
        description_future: 'Render final views for client approval.',
        documents: [{ name: 'Volumetric Study.dwg', url: '#', date: '2026-02-01' }],
        links: []
      }
    ],
    paid_on_time: true
  },
  { 
    id: 's2', project_id: 'p1', name: 'Detailed Engineering', description: 'Full engineering blueprints.', base_amount: 50000, amount_paid: 10000, deadline_date: '2026-03-20',
    ...calculateSprintMetrics({ base_amount: 50000, amount_paid: 10000, deadline_date: '2026-03-20' }),
    phases: [
      { 
        id: 'ph3', name: 'Structural Analysis', status: 'In Progress', payment_status: 'Pending', 
        description: 'Load calculations and structural integrity check.',
        description_past: 'Gathered material specifications. Started load distribution analysis.',
        description_future: 'Finalize structural report and submit for permit.',
        documents: [],
        links: [{ title: 'Structural Standards', url: 'https://standards.org' }]
      }
    ]
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
    id: 't1', project_id: 'p1', name: 'Al-Bader Construction', type: 'Building Permit', date: 'May 12 - Jun 30', status: 'In Progress', 
    assignee: { name: 'Sarah J.', avatar: 'https://picsum.photos/seed/sarah/100/100' }, current_step: 'Permit Review', notes: '' 
  },
  { 
    id: 't2', project_id: 'p2', name: 'Zayed Real Estate', type: 'Site Inspection', date: 'May 20 - May 22', status: 'Done', 
    assignee: { name: 'Mark T.', avatar: 'https://picsum.photos/seed/mark/100/100' }, current_step: 'Final Report', notes: '' 
  },
  { 
    id: 't3', project_id: 'p3', name: 'Emirates Logistics', type: 'Structure Audit', date: 'May 25 - Jun 10', status: 'New', 
    assignee: { name: 'Ahmed M.', avatar: 'https://picsum.photos/seed/ahmed/100/100' }, current_step: 'On-site Survey', notes: '' 
  },
];

export default function App() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'projects' | 'sprints' | 'transactions' | 'reports'>('dashboard');
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<{ type: 'client' | 'project' | 'sprint' | 'phase'; id: string } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ projectId: string; text: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // --- KPIs ---
  const kpis = useMemo(() => {
    const totalTransactions = transactions.length;
    const transactionsToday = 14; // Mocked
    const financialValue = projects.reduce((acc, p) => acc + p.total_price, 0);
    const delayedTransactions = transactions.filter(t => t.status === 'Late').length;

    return { totalTransactions, transactionsToday, financialValue, delayedTransactions };
  }, [transactions, projects]);

  // --- Handlers ---
  const handleAddPayment = (sprintId: string, amount: number) => {
    setSprints(prev => prev.map(s => {
      if (s.id === sprintId) {
        const newPaid = s.amount_paid + amount;
        const now = new Date();
        const deadline = new Date(s.deadline_date);
        
        // If it reaches base_amount before deadline, mark as paid_on_time
        const paid_on_time = s.paid_on_time || (newPaid >= s.base_amount && now <= deadline);
        
        return { 
          ...s, 
          amount_paid: newPaid, 
          paid_on_time,
          ...calculateSprintMetrics({ ...s, amount_paid: newPaid, paid_on_time }) 
        };
      }
      return s;
    }));
    setShowAddModal(null);
  };

  const handleAddClient = (c: any) => {
    setClients([{ ...c, id: `c${Date.now()}` }, ...clients]);
    setShowAddModal(null);
  };

  const handleAddProject = (p: any) => {
    setProjects([{ ...p, id: `p${Date.now()}` }, ...projects]);
    setShowAddModal(null);
  };

  const handleAddSprint = (s: any) => {
    const project = projects.find(p => p.id === s.project_id);
    if (!project) return;

    const projectSprints = sprints.filter(sp => sp.project_id === s.project_id);
    const allocatedAmount = projectSprints.reduce((acc, sp) => acc + sp.base_amount, 0);
    
    // Validation: Cannot exceed total project price
    if (allocatedAmount + s.base_amount > project.total_price) {
      alert(`Cannot add sprint. Total allocated amount (${formatCurrency(allocatedAmount + s.base_amount)}) exceeds project total price (${formatCurrency(project.total_price)}).`);
      return;
    }

    const metrics = calculateSprintMetrics(s);
    setSprints([{ ...s, ...metrics, id: `s${Date.now()}`, phases: s.phases || [] }, ...sprints]);
    setShowAddModal(null);
  };

  const handleAddTransaction = (t: any) => {
    setTransactions([{ ...t, id: `t${Date.now()}` }, ...transactions]);
    setShowAddModal(null);
  };

  const handleAiAnalysis = async (projectId: string) => {
    setIsAnalyzing(true);
    const project = projects.find(p => p.id === projectId);
    const client = clients.find(c => c.id === project?.client_id);
    const projectSprints = sprints.filter(s => s.project_id === projectId);
    const projectTransactions = transactions.filter(t => t.project_id === projectId);

    if (project && client) {
      const result = await analyzeProject(project, client, projectSprints, projectTransactions);
      setAiAnalysis({ projectId, text: result || 'No analysis available.' });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] dark:bg-[#0F1115] flex transition-colors duration-300`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedDetail(null);
        }} 
        onNewTransaction={() => setShowAddModal('transaction')} 
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar theme={theme} toggleTheme={toggleTheme} />

        <main className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3 capitalize text-black dark:text-white">
                {activeTab} <span className="text-gray-400 dark:text-gray-500 font-normal">{activeTab === 'dashboard' ? 'لوحة التحكم' : ''}</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                {activeTab === 'dashboard' ? 'Operational Overview for Project Alpha Engineering Cluster.' : `Manage your ${activeTab} and track performance.`}
              </p>
            </div>
            <div className="flex gap-3">
              {activeTab === 'clients' && <button onClick={() => setShowAddModal('client')} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-2"><Plus size={18} /> Add Client</button>}
              {activeTab === 'projects' && <button onClick={() => setShowAddModal('project')} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-2"><Plus size={18} /> Add Project</button>}
              {activeTab === 'sprints' && <button onClick={() => setShowAddModal('sprint')} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-2"><Plus size={18} /> Add Sprint</button>}
              <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Export CSV</button>
            </div>
          </header>

          {selectedDetail ? (
            <div className="space-y-6">
              <button 
                onClick={() => setSelectedDetail(null)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all mb-4"
              >
                <ChevronRight className="rotate-180" size={16} /> Back to {activeTab}
              </button>
              {selectedDetail.type === 'client' && (
                <ClientDetailPage 
                  id={selectedDetail.id}
                  clients={clients}
                  projects={projects}
                  sprints={sprints}
                  transactions={transactions}
                  onNavigate={(type, id) => setSelectedDetail({ type, id })}
                />
              )}
              {selectedDetail.type === 'project' && (
                <ProjectDetailPage 
                  id={selectedDetail.id}
                  clients={clients}
                  projects={projects}
                  sprints={sprints}
                  transactions={transactions}
                  onNavigate={(type, id) => setSelectedDetail({ type, id })}
                  onAddPayment={(sId) => setShowAddModal(`payment-${sId}`)}
                  onAnalyze={handleAiAnalysis}
                />
              )}
              {selectedDetail.type === 'sprint' && (
                <SprintDetailPage 
                  id={selectedDetail.id}
                  clients={clients}
                  projects={projects}
                  sprints={sprints}
                  onAddPayment={(sId) => setShowAddModal(`payment-${sId}`)}
                  onNavigate={(type, id) => setSelectedDetail({ type, id })}
                />
              )}
              {selectedDetail.type === 'phase' && (
                <PhaseDetailPage 
                  id={selectedDetail.id}
                  sprints={sprints}
                />
              )}
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: Main Content */}
                  <div className="col-span-12 lg:col-span-8 space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-4">
                      <KpiCard icon={<TrendingUp className="text-blue-600" />} label="Total Transactions" value={kpis.totalTransactions.toLocaleString()} subValue="+12.5%" />
                      <KpiCard icon={<Clock className="text-gray-600" />} label="Transactions Today" value={kpis.transactionsToday} subValue="Active" />
                      <KpiCard icon={<DollarSign className="text-indigo-600" />} label="Financial Value" value={formatCurrency(kpis.financialValue)} subValue="قيمة مالية" />
                      <KpiCard icon={<AlertCircle className="text-red-600" />} label="Delayed Transactions" value={`${kpis.delayedTransactions} Overdue`} subValue="Critical" color="red" />
                    </div>

                    {/* Recent Transactions Table */}
                    <section className="glass-card p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-3 text-black dark:text-white">
                          Recent Transactions <span className="text-gray-400 dark:text-gray-500 font-normal">المعاملات الأخيرة</span>
                        </h3>
                        <div className="flex gap-4 text-gray-400 dark:text-gray-500">
                          <button className="hover:text-gray-600 dark:hover:text-gray-300"><Filter size={20} /></button>
                          <button className="hover:text-gray-600 dark:hover:text-gray-300"><Search size={20} /></button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                              <th className="pb-4">Client Name</th>
                              <th className="pb-4">Type</th>
                              <th className="pb-4">Date</th>
                              <th className="pb-4">Status</th>
                              <th className="pb-4">Assignee</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {transactions.slice(0, 5).map(t => (
                              <tr key={t.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer" onClick={() => setSelectedDetail({ type: 'project', id: t.project_id })}>
                                <td className="py-5">
                                  <p className="text-sm font-bold text-black dark:text-white">{t.name}</p>
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">ID: #{t.id.slice(-5)}</p>
                                </td>
                                <td className="py-5">
                                  <span className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-100 dark:border-gray-700">{t.type}</span>
                                </td>
                                <td className="py-5 text-xs font-bold text-gray-400 dark:text-gray-500">{t.date}</td>
                                <td className="py-5">
                                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${
                                    t.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 
                                    t.status === 'In Progress' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30' : 
                                    'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                  }`}>
                                    {t.status}
                                  </span>
                                </td>
                                <td className="py-5">
                                  <div className="flex items-center gap-2">
                                    <img src={t.assignee.avatar} alt={t.assignee.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" referrerPolicy="no-referrer" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.assignee.name}</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button onClick={() => setActiveTab('transactions')} className="w-full mt-8 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest hover:text-blue-700 dark:hover:text-blue-300 transition-all">View All Transactions عرض كافة المعاملات</button>
                    </section>

                    {/* Recent Engineering Logs */}
                    <section className="glass-card p-8">
                      <h3 className="text-lg font-bold mb-8 text-black dark:text-white">Recent Engineering Logs <span className="text-gray-500 dark:text-gray-400 font-normal">سجلات العمل</span></h3>
                      <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gray-100 dark:before:bg-gray-800">
                        <LogItem title="Transaction #49210 Completed" desc="Site inspection approved for Zayed Real Estate." time="2 hours ago" status="completed" />
                        <LogItem title="Blueprint Revision" desc="Sarah uploaded new structural drafts for the Dubai Port terminal project." time="Yesterday, 4:15 PM" status="active" />
                        <LogItem title="Scheduled: Final Inspection" desc="System will automatically trigger reminder for Inspector Khalid." time="Tomorrow, 9:00 AM" status="pending" />
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Analytics Sidebar */}
                  <div className="col-span-12 lg:col-span-4 space-y-8">
                    {/* Efficiency Rate */}
                    <section className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100 dark:shadow-none">
                      <div className="relative z-10">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-white/80">Efficiency Rate</h3>
                        <EfficiencyGauge rate={94} />
                        <div className="text-center mt-8">
                          <p className="text-sm font-bold text-white">On-time Completion Rate</p>
                          <p className="text-[10px] text-white/60 font-bold uppercase mt-1">معدل الإنجاز في الوقت المحدد</p>
                        </div>
                      </div>
                      <Bot className="absolute -top-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
                    </section>

                    {/* Monthly Financials */}
                    <section className="glass-card p-8">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-gray-400 dark:text-gray-500 flex justify-between items-center">
                        Monthly Financials <span className="text-black dark:text-white font-bold">الأرباح والمصاريف</span>
                      </h3>
                      <FinancialsChart />
                      <div className="flex justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Profit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-200 dark:bg-blue-900/40"></div>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Expenses</span>
                        </div>
                      </div>
                    </section>

                    {/* Top 5 Clients */}
                    <section className="glass-card p-8">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-8 text-gray-400 dark:text-gray-500 flex justify-between items-center">
                        Top 5 Clients <span className="text-black dark:text-white font-bold">كبار العملاء</span>
                      </h3>
                      <div className="space-y-6">
                        {clients.slice(0, 5).map((c, i) => (
                          <div key={c.id} className="space-y-2 cursor-pointer group" onClick={() => setSelectedDetail({ type: 'client', id: c.id })}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">{c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                                <span className="text-xs font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">{c.name}</span>
                              </div>
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">${(84.2 - i * 20).toFixed(1)}k</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 dark:bg-blue-500" style={{ width: `${85 - i * 20}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setActiveTab('clients')} className="w-full mt-8 py-3 border border-gray-100 dark:border-gray-800 rounded-xl text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">View All Analytics</button>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === 'clients' && <ClientsPage clients={clients} setDrillDown={(d) => setSelectedDetail(d)} />}
              {activeTab === 'projects' && <ProjectsPage projects={projects} clients={clients} setDrillDown={(d) => setSelectedDetail(d)} />}
              {activeTab === 'sprints' && <SprintsPage sprints={sprints} projects={projects} setDrillDown={(d) => setSelectedDetail(d)} />}
              {activeTab === 'transactions' && <TransactionsPage transactions={transactions} projects={projects} setDrillDown={(d) => setSelectedDetail(d)} />}
              {activeTab === 'reports' && <ReportsPage clients={clients} projects={projects} sprints={sprints} />}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>

        {showAddModal === 'transaction' && (
          <ModalWrapper title="New Transaction" onClose={() => setShowAddModal(null)}>
            <AddTransactionModal projects={projects} onSubmit={handleAddTransaction} onClose={() => setShowAddModal(null)} />
          </ModalWrapper>
        )}

        {showAddModal === 'client' && (
          <ModalWrapper title="Add New Client" onClose={() => setShowAddModal(null)}>
            <AddClientModal onSubmit={handleAddClient} onClose={() => setShowAddModal(null)} />
          </ModalWrapper>
        )}

        {showAddModal === 'project' && (
          <ModalWrapper title="Add New Project" onClose={() => setShowAddModal(null)}>
            <AddProjectModal clients={clients} onSubmit={handleAddProject} onClose={() => setShowAddModal(null)} />
          </ModalWrapper>
        )}

        {showAddModal === 'sprint' && (
          <ModalWrapper title="Add New Sprint" onClose={() => setShowAddModal(null)}>
            <AddSprintModal projects={projects} onSubmit={handleAddSprint} onClose={() => setShowAddModal(null)} />
          </ModalWrapper>
        )}

        {showAddModal?.startsWith('payment-') && (
          <ModalWrapper title="Add Payment" onClose={() => setShowAddModal(null)}>
            <AddPaymentModal 
              sprint={sprints.find(s => s.id === showAddModal.split('-')[1])!} 
              onSubmit={(amt) => handleAddPayment(showAddModal.split('-')[1], amt)} 
              onClose={() => setShowAddModal(null)} 
            />
          </ModalWrapper>
        )}

        {aiAnalysis && (
          <ModalWrapper title="AI Project Analysis" onClose={() => setAiAnalysis(null)} wide>
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {aiAnalysis.text}
            </div>
          </ModalWrapper>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-white dark:bg-[#1A1D23] p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-transparent dark:border-gray-800">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="font-bold text-gray-600 dark:text-gray-400">Gemini is analyzing project data...</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-components ---

function KpiCard({ icon, label, value, subValue, color = 'blue' }: { icon: React.ReactNode; label: string; value: string | number; subValue: string; color?: string }) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="bg-gray-50 dark:bg-gray-800 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-gray-100 dark:border-gray-700">
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
          color === 'red' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30' : 
          'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30'
        }`}>
          {subValue}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-black dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function LogItem({ title, desc, time, status }: { title: string; desc: string; time: string; status: 'completed' | 'active' | 'pending' }) {
  const colors = {
    completed: 'bg-blue-600',
    active: 'bg-blue-400',
    pending: 'bg-gray-200 dark:bg-gray-700'
  };

  return (
    <div className="flex gap-6 relative">
      <div className={`w-6 h-6 rounded-full border-4 border-white dark:border-[#1A1D23] shadow-sm z-10 flex-shrink-0 ${colors[status]}`}></div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-black dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{desc}</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-2 tracking-wider">{time}</p>
      </div>
    </div>
  );
}
