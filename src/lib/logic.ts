import { Sprint, SprintStatus } from '../types';

export function calculateSprintMetrics(sprint: Partial<Sprint> & { base_amount: number; amount_paid: number; deadline_date: string; paid_on_time?: boolean }): {
  weeks_late: number;
  late_fee_percentage: number;
  final_amount: number;
  status: SprintStatus;
} {
  const now = new Date();
  const deadline = new Date(sprint.deadline_date);
  
  let weeks_late = 0;
  // Only calculate weeks_late if it was NOT paid on time.
  if (now > deadline && !sprint.paid_on_time) {
    const diffTime = Math.abs(now.getTime() - deadline.getTime());
    weeks_late = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  const late_fee_percentage = Math.min(weeks_late * 1, 10); // 1% per week, max 10%
  const final_amount = sprint.base_amount * (1 + late_fee_percentage / 100);

  let status: SprintStatus = 'Pending';
  if (sprint.amount_paid >= final_amount) {
    status = 'Paid';
  } else if (now > deadline) {
    status = 'Late';
  }

  return {
    weeks_late,
    late_fee_percentage,
    final_amount,
    status
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
