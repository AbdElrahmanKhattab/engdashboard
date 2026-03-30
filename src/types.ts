export type ProjectStatus = 'Active' | 'Completed' | 'On Hold';
export type SprintStatus = 'Paid' | 'Pending' | 'Late';
export type TransactionStatus = 'New' | 'In Progress' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';
export type PhaseStatus = 'Done' | 'In Progress' | 'Review';
export type PhasePaymentStatus = 'Paid' | 'Pending';

export interface Client {
  id: string;
  name: string;
  phone: string;
  notes: string;
  penalty_percentage: number;
}

export interface Project {
  id: string;
  name: string;
  client_id: string;
  total_price: number;
  status: ProjectStatus;
  notes: string;
  description: string;
  start_date: string;
  end_date: string;
  priority: Priority;
}

export interface Phase {
  id: string;
  name: string;
  status: PhaseStatus;
  payment_status: PhasePaymentStatus;
  description: string;
  description_past: string;
  description_future: string;
  documents: { name: string; url: string; date: string }[];
  links: { title: string; url: string }[];
}

export interface Sprint {
  id: string;
  project_id: string;
  name: string;
  description: string;
  base_amount: number;
  amount_paid: number;
  deadline_date: string; // ISO string
  status: SprintStatus;
  weeks_late: number;
  late_fee_percentage: number;
  final_amount: number;
  phases: Phase[];
  paid_on_time?: boolean;
}

export interface Transaction {
  id: string;
  project_id: string;
  name: string;
  type: string; // e.g., 'Building Permit', 'Site Inspection'
  date: string; // e.g., 'May 12 - Jun 30'
  status: TransactionStatus;
  assignee: {
    name: string;
    avatar: string;
  };
  current_step: string;
  notes: string;
}
