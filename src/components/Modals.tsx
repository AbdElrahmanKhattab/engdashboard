import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Client, Project, Sprint, Transaction, ProjectStatus, TransactionStatus } from '../types';

interface ModalProps {
  onClose: () => void;
}

export function AddClientModal({ onSubmit, onClose }: { onSubmit: (c: any) => void } & ModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [penalty, setPenalty] = useState('0');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, phone, notes, penalty_percentage: Number(penalty) }); }} className="space-y-4">
      <Input label="Client Name" value={name} onChange={setName} required />
      <Input label="Phone Number" value={phone} onChange={setPhone} required />
      <Input label="Penalty Percentage (%)" type="number" value={penalty} onChange={setPenalty} required />
      <TextArea label="Notes" value={notes} onChange={setNotes} />
      <SubmitButton label="Save Client" />
    </form>
  );
}

export function AddProjectModal({ clients, onSubmit, onClose }: { clients: Client[]; onSubmit: (p: any) => void } & ModalProps) {
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      onSubmit({ 
        name, 
        client_id: clientId, 
        total_price: Number(price), 
        status, 
        notes: '',
        description,
        start_date: startDate,
        end_date: endDate,
        priority
      }); 
    }} className="space-y-4">
      <Input label="Project Name" value={name} onChange={setName} required />
      <Select label="Client" value={clientId} onChange={setClientId} options={clients.map(c => ({ label: c.name, value: c.id }))} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Total Price" type="number" value={price} onChange={setPrice} required />
        <Select label="Priority" value={priority} onChange={(v) => setPriority(v as any)} options={[{ label: 'Low', value: 'Low' }, { label: 'Medium', value: 'Medium' }, { label: 'High', value: 'High' }]} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start Date" type="date" value={startDate} onChange={setStartDate} required />
        <Input label="End Date" type="date" value={endDate} onChange={setEndDate} required />
      </div>
      <Select label="Status" value={status} onChange={(v) => setStatus(v as ProjectStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Completed', value: 'Completed' }, { label: 'On Hold', value: 'On Hold' }]} />
      <TextArea label="Description" value={description} onChange={setDescription} />
      <SubmitButton label="Save Project" />
    </form>
  );
}

export function AddSprintModal({ projects, onSubmit, onClose }: { projects: Project[]; onSubmit: (s: any) => void } & ModalProps) {
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<{ name: string; status: string; payment_status: string; description: string }[]>([]);

  const addPhase = () => {
    setPhases([...phases, { name: '', status: 'In Progress', payment_status: 'Pending', description: '' }]);
  };

  const updatePhase = (index: number, field: string, value: string) => {
    const newPhases = [...phases];
    (newPhases[index] as any)[field] = value;
    setPhases(newPhases);
  };

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={(e) => { 
      e.preventDefault(); 
      onSubmit({ 
        name, 
        project_id: projectId, 
        base_amount: Number(amount), 
        amount_paid: 0, 
        deadline_date: deadline, 
        description,
        phases: phases.map((p, i) => ({ ...p, id: `ph-${Date.now()}-${i}` }))
      }); 
    }} className="space-y-4">
      <Input label="Sprint Name" value={name} onChange={setName} required />
      <Select label="Project" value={projectId} onChange={setProjectId} options={projects.map(p => ({ label: p.name, value: p.id }))} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Base Amount" type="number" value={amount} onChange={setAmount} required />
        <Input label="Deadline Date" type="date" value={deadline} onChange={setDeadline} required />
      </div>
      <TextArea label="Description" value={description} onChange={setDescription} />
      
      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phases / Steps</h4>
          <button type="button" onClick={addPhase} className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline">
            <Plus size={14} /> Add Phase
          </button>
        </div>
        
        {phases.map((phase, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3 relative border border-transparent dark:border-gray-800">
            <button type="button" onClick={() => removePhase(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
              <X size={14} />
            </button>
            <Input label="Phase Name" value={phase.name} onChange={(v) => updatePhase(index, 'name', v)} required />
            <div className="grid grid-cols-2 gap-3">
              <Select 
                label="Status" 
                value={phase.status} 
                onChange={(v) => updatePhase(index, 'status', v)} 
                options={[{ label: 'In Progress', value: 'In Progress' }, { label: 'Review', value: 'Review' }, { label: 'Done', value: 'Done' }]} 
              />
              <Select 
                label="Payment" 
                value={phase.payment_status} 
                onChange={(v) => updatePhase(index, 'payment_status', v)} 
                options={[{ label: 'Pending', value: 'Pending' }, { label: 'Paid', value: 'Paid' }]} 
              />
            </div>
          </div>
        ))}
      </div>

      <SubmitButton label="Save Sprint" />
    </form>
  );
}

export function AddTransactionModal({ projects, onSubmit, onClose }: { projects: Project[]; onSubmit: (t: any) => void } & ModalProps) {
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [type, setType] = useState('Building Permit');
  const [status, setStatus] = useState<TransactionStatus>('New');
  const [step, setStep] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ 
      name, 
      project_id: projectId, 
      type, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      status, 
      assignee: { name: 'Omar Al-Farsi', avatar: 'https://picsum.photos/seed/omar/100/100' },
      current_step: step, 
      notes: '' 
    }); }} className="space-y-4">
      <Input label="Task Name" value={name} onChange={setName} required />
      <Select label="Project" value={projectId} onChange={setProjectId} options={projects.map(p => ({ label: p.name, value: p.id }))} />
      <Input label="Type" value={type} onChange={setType} required />
      <Select label="Status" value={status} onChange={(v) => setStatus(v as TransactionStatus)} options={[{ label: 'New', value: 'New' }, { label: 'In Progress', value: 'In Progress' }, { label: 'Done', value: 'Done' }]} />
      <Input label="Current Step" value={step} onChange={setStep} required />
      <SubmitButton label="Save Transaction" />
    </form>
  );
}

export function AddPaymentModal({ sprint, onSubmit, onClose }: { sprint: Sprint; onSubmit: (amount: number) => void } & ModalProps) {
  const [amount, setAmount] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(Number(amount)); }} className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4 border border-blue-100 dark:border-blue-900/30">
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Paying for</p>
        <p className="text-sm font-bold text-black dark:text-white">{sprint.name}</p>
        <p className="text-xs text-blue-400 dark:text-blue-500">Outstanding: ${(sprint.final_amount - sprint.amount_paid).toFixed(2)}</p>
      </div>
      <Input label="Payment Amount" type="number" value={amount} onChange={setAmount} required />
      <SubmitButton label="Confirm Payment" />
    </form>
  );
}

// --- Internal UI Primitives ---

function Input({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        required={required}
        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</label>
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button type="submit" className="w-full bg-blue-600 dark:bg-blue-700 text-white py-4 rounded-xl font-bold mt-4 hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 dark:shadow-none">
      {label}
    </button>
  );
}

export function ModalWrapper({ title, children, onClose, wide = false }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className={`bg-white dark:bg-[#1A1D23] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${wide ? 'max-w-4xl w-full' : 'max-w-md w-full'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
          <h3 className="text-xl font-bold text-black dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-gray-400"><X size={20} /></button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
