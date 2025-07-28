import * as XLSX from 'xlsx';
import { SpreadsheetRow } from '@/components/DataTable';

const VALID_STATUSES = [
  'OSSRA Review',
  'Internal Docs/Info Requested',
  'External Docs/Info Requested',
  'Out for Review',
  'Out for Signature'
];

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
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        if (jsonData.length < 2) {
          resolve([]);
          return;
        }
        
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        // Create column index mapping
        const columnIndices: { [key: string]: number } = {};
        headers.forEach((header, index) => {
          const mappedKey = Object.keys(COLUMN_MAPPING).find(key => 
            header.toLowerCase().includes(key.toLowerCase()) || 
            key.toLowerCase().includes(header.toLowerCase())
          );
          if (mappedKey) {
            columnIndices[COLUMN_MAPPING[mappedKey as keyof typeof COLUMN_MAPPING]] = index;
          }
        });
        
        // Process and filter rows
        const filteredData: SpreadsheetRow[] = [];
        
        rows.forEach(row => {
          const gcoGcaScco = row[columnIndices.gcoGcaScco]?.toString().trim();
          const status = row[columnIndices.status]?.toString().trim();
          
          // Filter criteria: GCO/GCA/SCCO exactly "Haugaard" and valid status
          if (gcoGcaScco === 'Haugaard' && VALID_STATUSES.includes(status)) {
            filteredData.push({
              id: row[columnIndices.id]?.toString() || '',
              dateReceived: row[columnIndices.dateReceived]?.toString() || '',
              principalInvestigator: row[columnIndices.principalInvestigator]?.toString() || '',
              sponsorContractor: row[columnIndices.sponsorContractor]?.toString() || '',
              cayuseId: row[columnIndices.cayuseId]?.toString() || '',
              status: status,
              statusDate: row[columnIndices.statusDate]?.toString() || '',
              oldDbNumber: row[columnIndices.oldDbNumber]?.toString() || ''
            });
          }
        });
        
        // Sort by ID in descending order
        filteredData.sort((a, b) => {
          const idA = parseInt(a.id) || 0;
          const idB = parseInt(b.id) || 0;
          return idB - idA;
        });
        
        resolve(filteredData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};