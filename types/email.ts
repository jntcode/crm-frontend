export type Email = {
  id: string;
  customerId: string;
  subject: string;
  body: string;
  fromAddress: string;
  toAddress: string;
  status: "RECEIVED" | "SENT" | "OPENED" | "REPLIED";
  sentAt: string;
  createdAt: string;
};

export type DashboardStats = {
  totalCustomers: number;
  totalDeals: number;
  openTasks: number;
  totalEmails: number;
  monthlyRevenue: number;
  conversionRate: number;
};

export type PipelineBreakdown = {
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  won: number;
  lost: number;
};
