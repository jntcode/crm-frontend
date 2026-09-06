export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "WON"
  | "LOST";

export type Lead = {
  id: number;
  name: string;
  company: string;
  value: number;
  status: LeadStatus;
};
