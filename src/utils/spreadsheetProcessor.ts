import * as XLSX from 'xlsx';
import { SpreadsheetRow } from '@/components/DataTable';

// This is now passed as a parameter instead of hardcoded

const COLUMN_MAPPING = {
  'ID': 'id',
  'Date Received': 'dateReceived',
  'Principal Investigator': 'principalInvestigator',
  'Sponsor/Contractor': 'sponsorContractor',
  'Cayuse ID': 'cayuseId',
  'Status': 'status',
  'Status Date': 'statusDate',
  'OLD DB#': 'oldDbNumber',
  'GCO/GCA/SCCO': 'gcoGcaScco'
};

export const processSpreadsheet = async (file: File): Promise<SpreadsheetRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row, preserving raw values for proper date/text conversion
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, dateNF: 'mm/dd/yyyy' }) as string[][];
        
        if (jsonData.length < 2) {
          resolve([]);
          return;
        }
        
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        console.log('All headers with indices:', headers.map((h, i) => `${i}: "${h}"`));
        
        // Create column index mapping with better logic for Status vs Status Date
        const columnIndices: { [key: string]: number } = {};
        headers.forEach((header, index) => {
          const headerLower = header.toLowerCase().trim();
          
          // Check for Status Date FIRST (before Status) to avoid conflicts
          if (headerLower.includes('status date')) {
            columnIndices['statusDate'] = index;
          } else if (headerLower === 'status' || (headerLower.includes('status') && !headerLower.includes('date'))) {
            columnIndices['status'] = index;
          } else if (headerLower.includes('cayuse')) {
            columnIndices['cayuseId'] = index;
          } else {
            // Handle other mappings
            const mappedKey = Object.keys(COLUMN_MAPPING).find(key => 
              headerLower.includes(key.toLowerCase()) || 
              key.toLowerCase().includes(headerLower)
            );
            if (mappedKey && !['Status', 'Status Date', 'Cayuse ID'].includes(mappedKey)) {
              columnIndices[COLUMN_MAPPING[mappedKey as keyof typeof COLUMN_MAPPING]] = index;
            }
          }
        });
        
        // Override ID to always use Column A (index 0) regardless of header matching
        columnIndices['id'] = 0;
        
        console.log('Column indices found:', columnIndices);
        console.log('Headers around Status area:', headers.slice(10, 20).map((h, i) => `${i+10}: "${h}"`));
        
        // Process all rows and return them all (filtering will happen later)
        const allData: SpreadsheetRow[] = [];
        
        console.log('Column indices found:', columnIndices);
        console.log('Total rows to process:', rows.length);
        
        rows.forEach((row, rowIndex) => {
          // Ensure Status is always treated as text string
          let status = '';
          const statusValue = row[columnIndices.status];
          if (statusValue !== undefined && statusValue !== null) {
            status = String(statusValue).trim();
          }
          
          // Format date received properly
          const dateReceived = row[columnIndices.dateReceived];
          let formattedDateReceived = '';
          if (dateReceived) {
            // Handle Excel date serial numbers
            if (typeof dateReceived === 'number') {
              const excelDate = new Date((dateReceived - 25569) * 86400 * 1000);
              formattedDateReceived = excelDate.toLocaleDateString('en-US');
            } else {
              formattedDateReceived = dateReceived.toString();
            }
          }

          // Format status date properly
          const statusDate = row[columnIndices.statusDate];
          let formattedStatusDate = '';
          if (statusDate) {
            if (typeof statusDate === 'number') {
              const excelDate = new Date((statusDate - 25569) * 86400 * 1000);
              formattedStatusDate = excelDate.toLocaleDateString('en-US');
            } else {
              formattedStatusDate = statusDate.toString();
            }
          }

          allData.push({
            id: row[columnIndices.id]?.toString() || '',
            dateReceived: formattedDateReceived,
            principalInvestigator: row[columnIndices.principalInvestigator]?.toString() || '',
            sponsorContractor: row[columnIndices.sponsorContractor]?.toString() || '',
            cayuseId: row[columnIndices.cayuseId]?.toString() || '',
            status: status,
            statusDate: formattedStatusDate,
            oldDbNumber: row[columnIndices.oldDbNumber]?.toString() || '',
            gcoGcaScco: row[columnIndices.gcoGcaScco]?.toString() || '' // Add this for filtering
          });
        });
        
        resolve(allData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};