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
  receipts: z.array(BudgetItemSchema),
  outlays: z.array(BudgetItemSchema),
  totalReceipts: z.object({
    thisMonth: z.number().nullable(),
    fiscalYearToDate: z.number().nullable(),
    priorPeriodYearToDate: z.number().nullable(),
    budgetEstimates: z.number().nullable(),
  }),
  totalOutlays: z.object({
    thisMonth: z.number().nullable(),
    fiscalYearToDate: z.number().nullable(),
    priorPeriodYearToDate: z.number().nullable(),
    budgetEstimates: z.number().nullable(),
  }),
});

export type BudgetData = z.infer<typeof BudgetDataSchema>; 