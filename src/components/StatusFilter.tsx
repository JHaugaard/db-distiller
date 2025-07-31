import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ALL_STATUSES = [
  'OSRAA Review',
  'Internal Docs/Info Requested',
  'External Docs/Info Requested',
  'Out for Review',
  'Out for Signature',
  'Set-up in Process',
  'Completed'
];

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
  hasSpreadsheetData?: boolean;
}

export const StatusFilter = ({ selectedStatuses, onStatusChange, hasSpreadsheetData = false }: StatusFilterProps) => {
  const handleStatusToggle = (status: string, checked: boolean) => {
    if (checked) {
      onStatusChange([...selectedStatuses, status]);
    } else {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    }
  };

  const handleSelectAll = () => {
    onStatusChange(ALL_STATUSES);
  };

  const handleClearAll = () => {
    onStatusChange([]);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          Filter by Status
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              disabled={!hasSpreadsheetData}
              className="text-sm text-primary hover:text-primary/80 font-normal disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              Select All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={handleClearAll}
              disabled={!hasSpreadsheetData}
              className="text-sm text-primary hover:text-primary/80 font-normal disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {hasSpreadsheetData 
            ? `Live filtering enabled. Changes apply instantly. (${selectedStatuses.length} of ${ALL_STATUSES.length} selected)`
            : `Select statuses to include when distilling the DB. (${selectedStatuses.length} of ${ALL_STATUSES.length} selected)`
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_STATUSES.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={status}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) => handleStatusToggle(status, checked as boolean)}
                disabled={!hasSpreadsheetData}
              />
              <label
                htmlFor={status}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${hasSpreadsheetData ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};