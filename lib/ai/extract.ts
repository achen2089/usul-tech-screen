'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

/**
 * Extracts information from a PDF document using FormData
 * @param formData - The FormData containing the PDF file
 * @returns The extracted text content
 */
export async function extractPdfContent(formData: FormData): Promise<string> {
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
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all the text and information from this PDF document.',
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

    return text;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw new Error('Failed to extract PDF content');
  }
}

/**
 * Alternative version that takes a buffer directly
 * @param buffer - The PDF file buffer
 * @returns The extracted text content
 */
export async function extractPdfFromBuffer(buffer: Buffer): Promise<string> {
  try {
    // Extract PDF content using Google's Gemini model
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all the text and information from this PDF document.',
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

    return text;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw new Error('Failed to extract PDF content');
  }
}


