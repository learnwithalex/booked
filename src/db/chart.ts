// Booked — fixed chart of accounts, v1 (US solo-founder SaaS, USD-only).
//
// The chart is FIXED: orgs don't edit accounts in v1. The categorisation
// agent (and users, via review UI) pick from these codes. Stability of the
// code list is what makes rules portable across orgs and lets the agent
// reuse learnt patterns.

export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export interface ChartAccount {
  code: string;
  name: string;
  type: AccountType;
  parentCode?: string;
}

export const CHART_OF_ACCOUNTS: ChartAccount[] = [
  // Assets 1000–1999
  { code: "1000", name: "Cash — Operating", type: "ASSET" },
  { code: "1010", name: "Cash — Savings", type: "ASSET" },
  { code: "1100", name: "Stripe Clearing", type: "ASSET" },
  { code: "1200", name: "Accounts Receivable", type: "ASSET" },
  // Liabilities 2000–2999
  { code: "2000", name: "Credit Card", type: "LIABILITY" },
  { code: "2100", name: "Accounts Payable", type: "LIABILITY" },
  { code: "2200", name: "Sales Tax Payable", type: "LIABILITY" },
  // Equity 3000–3999
  { code: "3000", name: "Owner Capital", type: "EQUITY" },
  { code: "3100", name: "Owner Draw", type: "EQUITY" },
  { code: "3900", name: "Retained Earnings", type: "EQUITY" },
  // Revenue 4000–4999
  { code: "4000", name: "Revenue — Subscriptions", type: "REVENUE" },
  { code: "4100", name: "Revenue — Services", type: "REVENUE" },
  { code: "4200", name: "Revenue — Other", type: "REVENUE" },
  { code: "4900", name: "Refunds & Chargebacks", type: "REVENUE" },
  // Expenses 5000–7999
  { code: "5000", name: "Contractors", type: "EXPENSE" },
  { code: "5010", name: "Payroll & Salaries", type: "EXPENSE" },
  { code: "5020", name: "Founder Draw (comp)", type: "EXPENSE" },
  { code: "5100", name: "Software & SaaS", type: "EXPENSE" },
  { code: "5110", name: "Hosting & Infrastructure", type: "EXPENSE" },
  { code: "5120", name: "AI & API Costs", type: "EXPENSE" },
  { code: "5200", name: "Advertising & Marketing", type: "EXPENSE" },
  { code: "5210", name: "Content & Freelancers", type: "EXPENSE" },
  { code: "5300", name: "Office & Coworking", type: "EXPENSE" },
  { code: "5310", name: "Home Office", type: "EXPENSE" },
  { code: "5400", name: "Travel", type: "EXPENSE" },
  { code: "5410", name: "Meals & Entertainment", type: "EXPENSE" },
  { code: "5500", name: "Professional Services", type: "EXPENSE" },
  { code: "5510", name: "Legal", type: "EXPENSE" },
  { code: "5520", name: "Accounting & Tax", type: "EXPENSE" },
  { code: "5600", name: "Insurance", type: "EXPENSE" },
  { code: "5700", name: "Bank & Payment Fees", type: "EXPENSE" },
  { code: "5710", name: "Stripe Fees", type: "EXPENSE" },
  { code: "5720", name: "Interest Expense", type: "EXPENSE" },
  { code: "5800", name: "Equipment", type: "EXPENSE" },
  { code: "5900", name: "Taxes & Licenses", type: "EXPENSE" },
  { code: "5910", name: "Subscriptions (business)", type: "EXPENSE" },
  { code: "6000", name: "Education & Books", type: "EXPENSE" },
  { code: "6100", name: "Miscellaneous", type: "EXPENSE" },
  { code: "6200", name: "Transfers (non-expense)", type: "EXPENSE" },
];

export const CHART_CODES = new Set(CHART_OF_ACCOUNTS.map((a) => a.code));
