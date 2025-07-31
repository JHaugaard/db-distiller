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
      return 'bg-purple-50 border-purple-100 status-purple';
    case 'OSRAA Review':
      return 'bg-indigo-50 border-indigo-100 status-indigo';
    case 'Internal Docs/Info Requested':
      return 'bg-blue-50 border-blue-100 status-blue';
    case 'External Docs/Info Requested':
      return 'bg-emerald-50 border-emerald-100 status-emerald';
    case 'Out for Review':
      return 'bg-yellow-50 border-yellow-100 status-yellow';
    case 'Out for Signature':
      return 'bg-green-50 border-green-100 status-green';
    case 'Set-up in Process':
      return 'bg-orange-50 border-orange-100 status-orange';
    case 'Completed':
      return 'bg-slate-50 border-slate-100 status-slate';
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
            <TableRow className="h-8">
              <TableHead className="font-medium print:font-bold w-16 px-2 py-1 text-xs">ID</TableHead>
              <TableHead className="font-medium print:font-bold w-24 px-2 py-1 text-xs">Date Received</TableHead>
              <TableHead className="font-medium print:font-bold px-2 py-1 text-xs">Principal Investigator</TableHead>
              <TableHead className="font-medium print:font-bold px-2 py-1 text-xs">Sponsor/Contractor</TableHead>
              <TableHead className="font-medium print:font-bold px-2 py-1 text-xs">Cayuse ID</TableHead>
              <TableHead className="font-medium print:font-bold px-2 py-1 text-xs">Status</TableHead>
              <TableHead className="font-medium print:font-bold w-24 px-2 py-1 text-xs">Status Date</TableHead>
              <TableHead className="font-medium print:font-bold px-2 py-1 text-xs">OLD DB#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className={`${getStatusColor(row.status)} h-8`}>
                <TableCell className="font-mono text-xs px-2 py-1 w-16">{row.id}</TableCell>
                <TableCell className="text-xs px-2 py-1 w-24">{row.dateReceived}</TableCell>
                <TableCell className="text-xs px-2 py-1">{row.principalInvestigator}</TableCell>
                <TableCell className="text-xs px-2 py-1">{row.sponsorContractor}</TableCell>
                <TableCell className="font-mono text-xs px-2 py-1">{row.cayuseId}</TableCell>
                <TableCell className="text-xs px-2 py-1">{row.status}</TableCell>
                <TableCell className="text-xs px-2 py-1 w-24">{row.statusDate}</TableCell>
                <TableCell className="font-mono text-xs px-2 py-1">{row.oldDbNumber}</TableCell>
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