'use server';

import { generateObject, GenerateObjectResult } from 'ai';
import { google } from '@ai-sdk/google';
import { BudgetDataSchema, BudgetData } from './schemas';

/**
 * Extracts information from a PDF document using FormData
 * @param formData - The FormData containing the PDF file
 * @returns The extracted budget data
 */
export async function extractPdfContent(formData: FormData): Promise<BudgetData> {
  try {
    // Get the PDF file from FormData
    const pdfFile = formData.get('pdf') as File;
    if (!pdfFile) {
      throw new Error('No PDF file found in FormData');
    }

    // Convert file to buffer
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Extract PDF content using Google's Gemini model
    const result = await generateObject({
      model: google('gemini-2.0-flash-001'),
      schema: BudgetDataSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract the budget data from this PDF document containing the "Summary of Receipts and Outlays" table.

Please carefully parse the table and organize it into:
1. receipts - All items under "Budget Receipts" section
2. outlays - All items under "Budget Outlays" section
3. totalReceipts - The "Total Receipts" row values
4. totalOutlays - The "Total Outlays" row values (if present)

For each row, extract:
- classification: The department or category name (e.g., "Department of Defense")
- thisMonth: The value in the "This Month" column (in millions)
- fiscalYearToDate: The value in the "Current Fiscal Year to Date" column (in millions)
- priorPeriodYearToDate: The value in the "Comparable Prior Period Year to Date" column (in millions)
- budgetEstimates: The value in the "Budget Estimates Full Fiscal Year" column (in millions)

Convert all numeric values to numbers (not strings). Return null for any missing values.
Include the title and period from the table header.

Return the data as structured JSON matching the required schema.`,
            },
            {
              type: 'file',
              data: buffer,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return result.object;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw new Error('Failed to extract PDF content');
  }
}

/**
 * Alternative version that takes a buffer directly
 * @param buffer - The PDF file buffer
 * @returns The extracted budget data
 */
export async function extractPdfFromBuffer(buffer: Buffer): Promise<BudgetData> {
  try {
    // Extract PDF content using Google's Gemini model
    const result = await generateObject({
      model: google('gemini-2.0-flash-001'),
      schema: BudgetDataSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract the budget data from this PDF document containing the "Summary of Receipts and Outlays" table.

Please carefully parse the table and organize it into:
1. receipts - All items under "Budget Receipts" section
2. outlays - All items under "Budget Outlays" section
3. totalReceipts - The "Total Receipts" row values
4. totalOutlays - The "Total Outlays" row values (if present)

For each row, extract:
- classification: The department or category name (e.g., "Department of Defense")
- thisMonth: The value in the "This Month" column (in millions)
- fiscalYearToDate: The value in the "Current Fiscal Year to Date" column (in millions)
- priorPeriodYearToDate: The value in the "Comparable Prior Period Year to Date" column (in millions)
- budgetEstimates: The value in the "Budget Estimates Full Fiscal Year" column (in millions)

Convert all numeric values to numbers (not strings). Return null for any missing values.
Include the title and period from the table header.

Return the data as structured JSON matching the required schema.`,
            },
            {
              type: 'file',
              data: buffer,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    return result.object;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw new Error('Failed to extract PDF content');
  }
}


