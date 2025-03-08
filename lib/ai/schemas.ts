import { z } from 'zod';

// Define the schema for budget data
export const BudgetItemSchema = z.object({
  classification: z.string(),
  thisMonth: z.number().nullable(),
  fiscalYearToDate: z.number().nullable(),
  priorPeriodYearToDate: z.number().nullable(),
  budgetEstimates: z.number().nullable(),
});

export type BudgetItem = z.infer<typeof BudgetItemSchema>;

export const BudgetDataSchema = z.object({
  title: z.string(),
  period: z.string(),
  year: z.string().optional(),
  items: z.array(BudgetItemSchema),
});

export type BudgetData = z.infer<typeof BudgetDataSchema>; 