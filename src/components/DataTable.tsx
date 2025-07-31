import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export interface SpreadsheetRow {
  id: string;
  dateReceived: string;
  principalInvestigator: string;
  sponsorContractor: string;
  cayuseId: string;
  status: string;
  statusDate: string;
  oldDbNumber: string;
  gcoGcaScco?: string; // Optional field used for filtering
}

interface DataTableProps {
  data: SpreadsheetRow[];
  uploadTime: Date;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OSSRA Review':
      return 'bg-purple-50 border-purple-100';
    case 'OSRAA Review':
      return 'bg-indigo-50 border-indigo-100';
    case 'Internal Docs/Info Requested':
      return 'bg-blue-50 border-blue-100';
    case 'External Docs/Info Requested':
      return 'bg-emerald-50 border-emerald-100';
    case 'Out for Review':
      return 'bg-yellow-50 border-yellow-100';
    case 'Out for Signature':
      return 'bg-green-50 border-green-100';
    case 'Set-up in Process':
      return 'bg-orange-50 border-orange-100';
    case 'Completed':
      return 'bg-slate-50 border-slate-100';
    default:
      return '';
  }
};

export const DataTable = ({ data, uploadTime }: DataTableProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center print-hidden">
        <div className="text-sm text-muted-foreground">
          Last upload: {uploadTime.toLocaleString()}
        </div>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="h-4 w-4" />
          Print
        </Button>
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
              <TableRow key={index} className={getStatusColor(row.status)}>
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