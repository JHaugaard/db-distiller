import { SpreadsheetRow } from '@/components/DataTable';

export const filterSpreadsheetData = (
  rawData: SpreadsheetRow[],
  validStatuses: string[],
  userLastName: string
): SpreadsheetRow[] => {
  if (!rawData || rawData.length === 0 || validStatuses.length === 0) {
    return [];
  }

  return rawData
    .filter(row => {
      // Filter by user's last name
      const gcoField = row.gcoGcaScco?.toLowerCase() || '';
      const userLastNameLower = userLastName.toLowerCase();
      const hasUserName = gcoField.includes(userLastNameLower);

      // Filter by valid statuses
      const hasValidStatus = validStatuses.includes(row.status);

      return hasUserName && hasValidStatus;
    })
    .sort((a, b) => {
      // Sort by ID in descending order
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      return idB - idA;
    });
};