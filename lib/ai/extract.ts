'use server';

import { generateObject, GenerateObjectResult } from 'ai';
import { google } from '@ai-sdk/google';
import { BudgetDataSchema, BudgetData } from './schemas';

/**
 * Extracts information from a PDF document using FormData
 * @param formData - The FormData containing the PDF file
 * @param classification - The specific classification to extract (e.g., "Department of Defense")
 * @returns The extracted budget data
 */
export async function extractPdfContent(formData: FormData, classification?: string): Promise<BudgetData> {
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
              text: `Extract budget data from this PDF document containing the "Summary of Receipts and Outlays" table.

${classification ? `Focus specifically on extracting data for the classification: "${classification}"` : 'Extract data for all classifications'}

For each row, extract:
- classification: The exact classification name as it appears in the table (e.g., "Department of Defense--Military Programs")
- thisMonth: The value in the "This Month" column (in millions)
- fiscalYearToDate: The value in the "Current Fiscal Year to Date" column (in millions)
- priorPeriodYearToDate: The value in the "Comparable Prior Period Year to Date" column (in millions)
- budgetEstimates: The value in the "Budget Estimates Full Fiscal Year" column (in millions)

Also extract:
- title: The title of the table (e.g., "Summary of Receipts and Outlays of the U.S. Government")
- period: The period mentioned (e.g., "January 2024 and Other Periods")
- year: The fiscal year if mentioned

Convert all numeric values to numbers (not strings). Return null for any missing values.
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
 * @param classification - The specific classification to extract (e.g., "Department of Defense")
 * @returns The extracted budget data
 */
export async function extractPdfFromBuffer(buffer: Buffer, classification?: string): Promise<BudgetData> {
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
              text: `Extract budget data from this PDF document containing the "Summary of Receipts and Outlays" table.

${classification ? `Focus specifically on extracting data for the classification: "${classification}"` : 'Extract data for all classifications'}

For each row, extract:
- classification: The exact classification name as it appears in the table (e.g., "Department of Defense--Military Programs")
- thisMonth: The value in the "This Month" column (in millions)
- fiscalYearToDate: The value in the "Current Fiscal Year to Date" column (in millions)
- priorPeriodYearToDate: The value in the "Comparable Prior Period Year to Date" column (in millions)
- budgetEstimates: The value in the "Budget Estimates Full Fiscal Year" column (in millions)

Also extract:
- title: The title of the table (e.g., "Summary of Receipts and Outlays of the U.S. Government")
- period: The period mentioned (e.g., "January 2024 and Other Periods")
- year: The fiscal year if mentioned

Convert all numeric values to numbers (not strings). Return null for any missing values.
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


