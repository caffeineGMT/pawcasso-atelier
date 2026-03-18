/**
 * CSV Parser for Corporate Employee Bulk Upload
 * Parses CSV files and validates email formats
 */

export interface EmployeeRow {
  name: string;
  email: string;
  petPhotoUrl?: string;
}

export interface ParseResult {
  success: boolean;
  data: EmployeeRow[];
  errors: string[];
}

/**
 * Validates email format using regex
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Parses a CSV file and returns an array of employee objects
 * Expected CSV columns: employee_name, employee_email, pet_photo_url (optional)
 */
export async function parseEmployeeCSV(file: File): Promise<ParseResult> {
  const errors: string[] = [];
  const data: EmployeeRow[] = [];

  try {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
      return {
        success: false,
        data: [],
        errors: ['CSV file is empty'],
      };
    }

    // Parse header row
    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => h.trim().toLowerCase());

    // Validate required headers
    const nameIndex = headers.findIndex(h => h === 'employee_name' || h === 'name');
    const emailIndex = headers.findIndex(h => h === 'employee_email' || h === 'email');
    const photoIndex = headers.findIndex(h => h === 'pet_photo_url' || h === 'photo_url' || h === 'photo');

    if (nameIndex === -1) {
      errors.push('Missing required column: employee_name (or name)');
    }
    if (emailIndex === -1) {
      errors.push('Missing required column: employee_email (or email)');
    }

    if (errors.length > 0) {
      return { success: false, data: [], errors };
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing (handles basic cases)
      // For production, consider using a library like papaparse for complex CSVs
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));

      const name = values[nameIndex]?.trim() || '';
      const email = values[emailIndex]?.trim() || '';
      const petPhotoUrl = photoIndex >= 0 ? values[photoIndex]?.trim() : undefined;

      // Validate row
      if (!name) {
        errors.push(`Row ${i + 1}: Missing employee name`);
        continue;
      }

      if (!email) {
        errors.push(`Row ${i + 1}: Missing employee email`);
        continue;
      }

      if (!isValidEmail(email)) {
        errors.push(`Row ${i + 1}: Invalid email format: ${email}`);
        continue;
      }

      // Check for duplicate emails in the CSV
      if (data.some(row => row.email === email)) {
        errors.push(`Row ${i + 1}: Duplicate email: ${email}`);
        continue;
      }

      data.push({
        name,
        email,
        petPhotoUrl: petPhotoUrl && petPhotoUrl.startsWith('http') ? petPhotoUrl : undefined,
      });
    }

    return {
      success: errors.length === 0,
      data,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Generates a sample CSV template string
 */
export function generateSampleCSV(): string {
  return `employee_name,employee_email,pet_photo_url
John Doe,john.doe@company.com,https://example.com/photo1.jpg
Jane Smith,jane.smith@company.com,
Bob Johnson,bob.johnson@company.com,https://example.com/photo2.jpg`;
}
