import React, { useState } from 'react';
import { Client, Project, Sprint, Transaction } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Layers,
  Bot,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText as FileTextIcon,
  ExternalLink,
  History,
  FastForward,
  Link as LinkIcon
} from 'lucide-react';
import { formatCurrency } from '../lib/logic';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

export function ClientsPage({ clients, setDrillDown }: { clients: Client[], setDrillDown: (d: any) => void }) {
  const [search, setSearch] = useState('');

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center glass-card p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search clients..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(client => (
          <div 
            key={client.id} 
            onClick={() => setDrillDown({ type: 'client', id: client.id })}
            className="glass-card p-6 cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg border border-blue-100 dark:border-blue-800/50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">
                Penalty: {client.penalty_percentage}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">{client.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{client.phone}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Briefcase size={14} />
                <span className="text-xs font-bold">Active Projects</span>
              </div>
              <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsPage({ projects, clients, setDrillDown }: { projects: Project[], clients: Client[], setDrillDown: (d: any) => void }) {
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('all');

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesClient = clientFilter === 'all' || p.client_id === clientFilter;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 glass-card p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 focus:outline-none"
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
        >
          <option value="all">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(project => {
          const client = clients.find(c => c.id === project.client_id);
          return (
            <div 
              key={project.id} 
              onClick={() => setDrillDown({ type: 'project', id: project.id })}
              className="glass-card p-6 flex items-center justify-between cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">{project.name}</h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{client?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                  <p className="text-sm font-bold text-black dark:text-white">{formatCurrency(project.total_price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                    project.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/50' : 
                    project.status === 'On Hold' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50' : 
                    'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SprintsPage({ sprints, projects, setDrillDown }: { sprints: Sprint[], projects: Project[], setDrillDown: (d: any) => void }) {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');

  const filtered = sprints.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || s.project_id === projectFilter;
    return matchesSearch && matchesProject;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 glass-card p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search sprints..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 focus:outline-none"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(sprint => {
          const project = projects.find(p => p.id === sprint.project_id);
          return (
            <div 
              key={sprint.id} 
              onClick={() => setDrillDown({ type: 'sprint', id: sprint.id })}
              className="glass-card p-6 flex items-center justify-between cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/50 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">{sprint.name}</h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{project?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Deadline</p>
                  <p className="text-sm font-bold text-black dark:text-white flex items-center gap-2">
                    <Clock size={14} className="text-gray-500 dark:text-gray-400" />
                    {sprint.deadline_date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                  <p className="text-sm font-bold text-black dark:text-white">{formatCurrency(sprint.amount_paid)} / {formatCurrency(sprint.final_amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                    sprint.status === 'Paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/50' : 
                    sprint.status === 'Late' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50' : 
                    'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50'
                  }`}>
                    {sprint.status}
                  </span>
                </div>
                <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TransactionsPage({ transactions, projects, setDrillDown }: { transactions: Transaction[], projects: Project[], setDrillDown: (d: any) => void }) {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');

  const filtered = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || t.project_id === projectFilter;
    return matchesSearch && matchesProject;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 glass-card p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 focus:outline-none"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <th className="p-6">Transaction</th>
              <th className="p-6">Project</th>
              <th className="p-6">Date</th>
              <th className="p-6">Status</th>
              <th className="p-6">Assignee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(t => {
              const project = projects.find(p => p.id === t.project_id);
              return (
                <tr key={t.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer" onClick={() => setDrillDown({ type: 'project', id: t.project_id })}>
                  <td className="p-6">
                    <p className="text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">{t.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Step: {t.current_step}</p>
                  </td>
                  <td className="p-6">
                    <span className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-100 dark:border-gray-700">{project?.name}</span>
                  </td>
                  <td className="p-6 text-xs font-bold text-gray-500 dark:text-gray-400">{t.date}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${
                      t.status === 'Done' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800/50' : 
                      t.status === 'In Progress' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50' : 
                      'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <img src={t.assignee.avatar} alt={t.assignee.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" referrerPolicy="no-referrer" />
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.assignee.name}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ReportsPage({ clients, projects, sprints }: { clients: Client[], projects: Project[], sprints: Sprint[] }) {
  const totalValue = projects.reduce((acc, p) => acc + p.total_price, 0);
  const totalPaid = sprints.reduce((acc, s) => acc + s.amount_paid, 0);
  const totalPending = sprints.reduce((acc, s) => acc + (s.final_amount - s.amount_paid), 0);
  const lateSprints = sprints.filter(s => s.status === 'Late');

  const clientRevenueData = clients.map(c => {
    const cProjects = projects.filter(p => p.client_id === c.id);
    const cValue = cProjects.reduce((acc, p) => acc + p.total_price, 0);
    return { name: c.name, value: cValue };
  }).sort((a, b) => b.value - a.value).slice(0, 5);

  const statusData = [
    { name: 'Active', value: projects.filter(p => p.status === 'Active').length },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length },
    { name: 'On Hold', value: projects.filter(p => p.status === 'On Hold').length },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-blue-600 dark:bg-[#1A1D23] dark:border-blue-500">
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Total Project Value</p>
          <p className="text-2xl font-bold text-black dark:text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-green-600 dark:bg-[#1A1D23] dark:border-green-500">
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Total Collected</p>
          <p className="text-2xl font-bold text-black dark:text-white">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-yellow-600 dark:bg-[#1A1D23] dark:border-yellow-500">
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Total Pending</p>
          <p className="text-2xl font-bold text-black dark:text-white">{formatCurrency(totalPending)}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-red-600 dark:bg-[#1A1D23] dark:border-red-500">
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Late Payments</p>
          <p className="text-2xl font-bold text-black dark:text-white">{lateSprints.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <section className="glass-card p-8 dark:bg-[#1A1D23]">
          <h3 className="text-lg font-bold mb-8 text-black dark:text-white">Revenue by Client <span className="text-gray-500 dark:text-gray-400 font-normal">الإيرادات حسب العميل</span></h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientRevenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={150} 
                  tick={{ fontSize: 12, fontWeight: 'bold', fill: '#9ca3af' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                  itemStyle={{ color: '#f9fafb' }}
                  cursor={{ fill: '#374151', opacity: 0.4 }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass-card p-8 dark:bg-[#1A1D23]">
          <h3 className="text-lg font-bold mb-8 text-black dark:text-white">Project Status <span className="text-gray-500 dark:text-gray-400 font-normal">حالة المشاريع</span></h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                  itemStyle={{ color: '#f9fafb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-card p-8 dark:bg-[#1A1D23]">
        <h3 className="text-lg font-bold mb-8 text-black dark:text-white">Client Financial Summary <span className="text-gray-500 dark:text-gray-400 font-normal">ملخص مالي للعملاء</span></h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                <th className="pb-4">Client</th>
                <th className="pb-4">Projects</th>
                <th className="pb-4">Total Value</th>
                <th className="pb-4">Paid</th>
                <th className="pb-4">Pending</th>
                <th className="pb-4">Penalty %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {clients.map(client => {
                const clientProjects = projects.filter(p => p.client_id === client.id);
                const clientSprints = sprints.filter(s => clientProjects.some(p => p.id === s.project_id));
                const cValue = clientProjects.reduce((acc, p) => acc + p.total_price, 0);
                const cPaid = clientSprints.reduce((acc, s) => acc + s.amount_paid, 0);
                const cPending = clientSprints.reduce((acc, s) => acc + (s.final_amount - s.amount_paid), 0);

                return (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                    <td className="py-5 font-bold text-black dark:text-white">{client.name}</td>
                    <td className="py-5 text-sm text-gray-600 dark:text-gray-400">{clientProjects.length}</td>
                    <td className="py-5 text-sm font-bold text-black dark:text-white">{formatCurrency(cValue)}</td>
                    <td className="py-5 text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(cPaid)}</td>
                    <td className="py-5 text-sm font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(cPending)}</td>
                    <td className="py-5">
                      <span className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 rounded text-[10px] font-bold border border-red-100 dark:border-red-900/30">{client.penalty_percentage}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export function ClientDetailPage({ id, clients, projects, sprints, transactions, onNavigate }: { 
  id: string; 
  clients: Client[]; 
  projects: Project[]; 
  sprints: Sprint[]; 
  transactions: Transaction[];
  onNavigate: (type: 'client' | 'project' | 'sprint', id: string) => void;
}) {
  const client = clients.find(c => c.id === id);
  if (!client) return <div>Client not found</div>;

  const clientProjects = projects.filter(p => p.client_id === id);
  const clientSprints = sprints.filter(s => clientProjects.some(p => p.id === s.project_id));
  const clientTransactions = transactions.filter(t => clientProjects.some(p => p.id === t.project_id));

  const totalValue = clientProjects.reduce((acc, p) => acc + p.total_price, 0);
  const totalPaid = clientSprints.reduce((acc, s) => acc + s.amount_paid, 0);
  const totalPending = totalValue - totalPaid;

  const chartData = clientProjects.map(p => ({
    name: p.name,
    value: p.total_price,
    paid: sprints.filter(s => s.project_id === p.id).reduce((acc, s) => acc + s.amount_paid, 0)
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-6">
          <div className="glass-card p-8 bg-blue-600 dark:bg-blue-700 text-white border-none">
            <h3 className="text-2xl font-bold mb-2">{client.name}</h3>
            <p className="text-blue-100 mb-6">{client.phone}</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase opacity-70">Total Contract</span>
                <span className="text-xl font-bold">{formatCurrency(totalValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase opacity-70">Total Paid</span>
                <span className="text-xl font-bold text-green-300">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="pt-4 border-t border-blue-500 flex justify-between items-center">
                <span className="text-xs font-bold uppercase opacity-70">Outstanding</span>
                <span className="text-xl font-bold text-yellow-300">{formatCurrency(totalPending)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 dark:bg-[#1A1D23]">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">Project Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                    itemStyle={{ color: '#f9fafb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-8 space-y-8">
          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <h3 className="text-lg font-bold mb-6 dark:text-gray-100">Linked Projects</h3>
            <div className="grid grid-cols-2 gap-4">
              {clientProjects.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => onNavigate('project', p.id)}
                  className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-all">{p.name}</h5>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      p.status === 'Active' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                    }`}>{p.status}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(p.total_price)}</p>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <h3 className="text-lg font-bold mb-6 dark:text-gray-100">Client Transactions</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {clientTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                      <FileTextIcon size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">{t.type}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                    t.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                  }`}>{t.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailPage({ id, clients, projects, sprints, transactions, onNavigate, onAddPayment, onAnalyze }: {
  id: string;
  clients: Client[];
  projects: Project[];
  sprints: Sprint[];
  transactions: Transaction[];
  onNavigate: (type: 'client' | 'project' | 'sprint', id: string) => void;
  onAddPayment: (sId: string) => void;
  onAnalyze: (pId: string) => void;
}) {
  const project = projects.find(p => p.id === id);
  if (!project) return <div>Project not found</div>;

  const client = clients.find(c => c.id === project.client_id);
  const projectSprints = sprints.filter(s => s.project_id === id);
  const projectTransactions = transactions.filter(t => t.project_id === id);

  const totalPaid = projectSprints.reduce((acc, s) => acc + s.amount_paid, 0);
  const totalValue = project.total_price;

  const sprintData = projectSprints.map(s => ({
    name: s.name,
    paid: s.amount_paid,
    total: s.final_amount
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-6">
          <div className="glass-card p-8 bg-indigo-600 dark:bg-indigo-700  border-none">
            <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">{project.name}</h3>
            <p 
              onClick={() => onNavigate('client', client!.id)}
              className="text-indigo-100 mb-6 cursor-pointer hover:underline flex items-center gap-2"
            >
              <Users size={14} /> {client?.name}
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase opacity-70">Project Value</span>
                <span className="text-xl font-bold">{formatCurrency(totalValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase opacity-70">Total Collected</span>
                <span className="text-xl font-bold text-green-300">{formatCurrency(totalPaid)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 space-y-4 dark:bg-[#1A1D23]">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Project Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Priority</span>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                  project.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' : 
                  project.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30' : 
                  'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                }`}>{project.priority}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Start Date</span>
                <span className="text-sm font-bold text-black dark:text-white">{project.start_date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">End Date</span>
                <span className="text-sm font-bold text-black dark:text-white">{project.end_date}</span>
              </div>
              <div className="pt-2">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Description</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">"{project.description || 'No description provided.'}"</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onAnalyze(project.id)}
            className="w-full p-6 bg-white dark:bg-[#1A1D23] border-2 border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-center justify-between group hover:border-indigo-600 dark:hover:border-indigo-500 transition-all"
          >
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">AI Insights</p>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Analyze with Gemini</p>
            </div>
            <Bot className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
          </button>

          <div className="glass-card p-6 dark:bg-[#1A1D23]">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">Payment Progress</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sprintData}>
                  <CartesianGrid strokeDasharray="3" vertical={false} stroke="var(--chart-grid-stroke)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: 'var(--chart-axis-tick)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: 'var(--chart-axis-tick)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: 'none', borderRadius: '12px', color: 'var(--chart-tooltip-color)' }}
                    itemStyle={{ color: 'var(--chart-tooltip-color)' }}
                    cursor={{ fill: 'var(--chart-grid-stroke)', opacity: 0.4 }}
                  />
                  <Bar dataKey="paid" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-8 space-y-8">
          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <h3 className="text-lg font-bold mb-6 dark:text-gray-100">Payment Sprints</h3>
            <div className="space-y-4">
              {projectSprints.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => onNavigate('sprint', s.id)}
                  className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer group flex justify-between items-center"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30 group-hover:bg-orange-600 dark:group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-black dark:text-white group-hover:text-blue-600 transition-all">{s.name}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                        <Clock size={12} /> {s.deadline_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Paid</p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(s.amount_paid)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                      s.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                    }`}>{s.status}</span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <h3 className="text-lg font-bold mb-6 dark:text-gray-100">Project Transactions</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {projectTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                      <FileTextIcon size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">{t.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Step: {t.current_step}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <img src={t.assignee.avatar} alt={t.assignee.name} className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700" referrerPolicy="no-referrer" />
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{t.assignee.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                      t.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
                    }`}>{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function SprintDetailPage({ id, clients, projects, sprints, onAddPayment, onNavigate }: {
  id: string;
  clients: Client[];
  projects: Project[];
  sprints: Sprint[];
  onAddPayment: (sId: string) => void;
  onNavigate: (type: string, id: string) => void;
}) {
  const sprint = sprints.find(s => s.id === id);
  if (!sprint) return <div>Sprint not found</div>;

  const project = projects.find(p => p.id === sprint.project_id);
  const client = clients.find(c => c.id === project?.client_id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card p-8 bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2">Sprint Details</p>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{sprint.name}</h3>
            <p className="text-orange-400 dark:text-orange-500 font-bold uppercase tracking-widest mt-1">{project?.name} — {client?.name}</p>
            {sprint.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">"{sprint.description}"</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
              sprint.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 
              sprint.status === 'Late' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' : 
              'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30'
            }`}>
              {sprint.status}
            </span>
            {sprint.paid_on_time && <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Paid On Time</span>}
            {sprint.weeks_late > 0 && <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase flex items-center gap-1"><AlertCircle size={12} /> {sprint.weeks_late} Weeks Late</span>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-orange-200 dark:border-orange-900/30">
          <div>
            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase mb-2">Deadline</p>
            <p className="text-xl font-bold flex items-center gap-2 dark:text-gray-100"><Calendar size={20} className="text-orange-400 dark:text-orange-500" /> {sprint.deadline_date}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase mb-2">Base Amount</p>
            <p className="text-xl font-bold dark:text-gray-100">{formatCurrency(sprint.base_amount)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase mb-2">Final Amount</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(sprint.final_amount)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="glass-card p-8 space-y-6 dark:bg-[#1A1D23]">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Financial Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(sprint.amount_paid)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Late Fee ({sprint.late_fee_percentage}%)</span>
                <span className="text-xl font-bold text-red-600 dark:text-red-400">+{formatCurrency(sprint.final_amount - sprint.base_amount)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Outstanding</span>
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(sprint.final_amount - sprint.amount_paid)}</span>
              </div>
            </div>
            
            {sprint.status !== 'Paid' && (
              <button 
                onClick={() => onAddPayment(sprint.id)}
                className="w-full bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 dark:shadow-none flex items-center justify-center gap-2"
              >
                <CreditCard size={18} /> Record Payment سجل الدفعة
              </button>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 space-y-8">
          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <h3 className="text-lg font-bold mb-6 dark:text-gray-100">Sprint Phases <span className="text-gray-500 dark:text-gray-400 font-normal">مراحل التنفيذ</span></h3>
            <div className="space-y-4">
              {sprint.phases && sprint.phases.length > 0 ? sprint.phases.map(phase => (
                <div 
                  key={phase.id} 
                  onClick={() => onNavigate('phase', phase.id)}
                  className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/30 dark:bg-gray-800/20 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-white dark:hover:bg-gray-800/40 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-all">{phase.name}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{phase.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        phase.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 
                        phase.status === 'Review' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30' : 
                        'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
                      }`}>{phase.status}</span>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        phase.payment_status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 
                        'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                      }`}>{phase.payment_status}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              )) : (
                <p className="text-center py-12 text-gray-500 dark:text-gray-400 font-bold italic">No phases defined for this sprint.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function PhaseDetailPage({ id, sprints }: { id: string; sprints: Sprint[] }) {
  let phase: any = null;
  let parentSprint: Sprint | null = null;

  for (const s of sprints) {
    const p = s.phases?.find(ph => ph.id === id);
    if (p) {
      phase = p;
      parentSprint = s;
      break;
    }
  }

  if (!phase) return <div>Phase not found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-[#1A1D23] p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Phase Details • {parentSprint?.name}</p>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{phase.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">{phase.description}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${
              phase.status === 'Done' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 
              phase.status === 'Review' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30' : 
              'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30'
            }`}>{phase.status}</span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${
              phase.payment_status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 
              'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
            }`}>{phase.payment_status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                <History size={20} />
              </div>
              <h3 className="text-lg font-bold dark:text-gray-100">What Happened (Past) <span className="text-gray-500 dark:text-gray-400 font-normal">ما تم إنجازه</span></h3>
            </div>
            <div className="prose prose-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {phase.description_past || 'No historical data recorded for this phase yet.'}
            </div>
          </section>

          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <FastForward size={20} />
              </div>
              <h3 className="text-lg font-bold dark:text-gray-100">What's Next (Future) <span className="text-gray-500 dark:text-gray-400 font-normal">الخطوات القادمة</span></h3>
            </div>
            <div className="prose prose-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {phase.description_future || 'Future steps for this phase are still being planned.'}
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Documents</h3>
              <FileTextIcon size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <div className="space-y-3">
              {phase.documents && phase.documents.length > 0 ? phase.documents.map((doc: any, i: number) => (
                <a 
                  key={i} 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FileTextIcon size={16} className="text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-all">{doc.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{doc.date}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-300 group-hover:text-blue-600" />
                </a>
              )) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">No documents uploaded.</p>
              )}
            </div>
          </section>

          <section className="glass-card p-8 dark:bg-[#1A1D23]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Relevant Links</h3>
              <LinkIcon size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <div className="space-y-3">
              {phase.links && phase.links.length > 0 ? phase.links.map((link: any, i: number) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink size={16} className="text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-all">{link.title}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-300 group-hover:text-blue-600" />
                </a>
              )) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">No links available.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
