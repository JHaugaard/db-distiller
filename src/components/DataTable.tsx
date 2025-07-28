import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';

export interface SpreadsheetRow {
  id: string;
  dateReceived: string;
  principalInvestigator: string;
  sponsorContractor: string;
  cayuseId: string;
  status: string;
  statusDate: string;
  oldDbNumber: string;
}

interface DataTableProps {
  data: SpreadsheetRow[];
  uploadTime: Date;
}

export const DataTable = ({ data, uploadTime }: DataTableProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground print-hidden">
        Last upload: {uploadTime.toLocaleString()}
      </div>
      
      <Card className="overflow-hidden print:shadow-none print:border-0">
        <Table className="print:text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium print:font-bold">ID</TableHead>
              <TableHead className="font-medium print:font-bold">Date Received</TableHead>
              <TableHead className="font-medium print:font-bold">Principal Investigator</TableHead>
              <TableHead className="font-medium print:font-bold">Sponsor/Contractor</TableHead>
              <TableHead className="font-medium print:font-bold">Cayuse ID</TableHead>
              <TableHead className="font-medium print:font-bold">Status</TableHead>
              <TableHead className="font-medium print:font-bold">Status Date</TableHead>
              <TableHead className="font-medium print:font-bold">OLD DB#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">{row.id}</TableCell>
                <TableCell className="text-sm">{row.dateReceived}</TableCell>
                <TableCell className="text-sm">{row.principalInvestigator}</TableCell>
                <TableCell className="text-sm">{row.sponsorContractor}</TableCell>
                <TableCell className="font-mono text-sm">{row.cayuseId}</TableCell>
                <TableCell className="text-sm">{row.status}</TableCell>
                <TableCell className="text-sm">{row.statusDate}</TableCell>
                <TableCell className="font-mono text-sm">{row.oldDbNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      {data.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No data matches the filtering criteria
        </div>
      )}
    </div>
  );
};