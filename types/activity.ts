export type Activity = {
  id: string;
  customerId: string;
  title: string;
  description: string;
  type: "CALL" | "EMAIL" | "MEETING" | "NOTE";
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  customerId: string | null;
  dueDate: string | null;
  assignedTo: string;
  createdAt: string;
};
