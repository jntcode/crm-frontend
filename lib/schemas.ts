import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  value: z.coerce.number().min(0, "Value must be positive"),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  companyName: z.string().optional(),
  position: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

export const activitySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  customerId: z.string().min(1, "Customer ID is required"),
});

export const emailSchema = z.object({
  toAddress: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
