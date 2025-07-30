import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataTable, SpreadsheetRow } from '@/components/DataTable';
import { StatusFilter } from '@/components/StatusFilter';
import { processSpreadsheet } from '@/utils/spreadsheetProcessor';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [data, setData] = useState<SpreadsheetRow[]>([]);
  const [uploadTime, setUploadTime] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { toast } = useToast();

  // Load saved statuses from localStorage on component mount
  useEffect(() => {
    const savedStatuses = localStorage.getItem('act-selected-statuses');
    if (savedStatuses) {
      try {
        const parsed = JSON.parse(savedStatuses);
        setSelectedStatuses(parsed);
      } catch (error) {
        // If parsing fails, default to all statuses
        const allStatuses = [
          'OSRAA Review',
          'Internal Docs/Info Requested',
          'External Docs/Info Requested',
          'Out for Review',
          'Out for Signature',
          'Set-up in Process',
          'Completed'
        ];
        setSelectedStatuses(allStatuses);
      }
    } else {
      // Default to all statuses for first-time users
      const allStatuses = [
        'OSRAA Review',
        'Internal Docs/Info Requested',
        'External Docs/Info Requested',
        'Out for Review',
        'Out for Signature',
        'Set-up in Process',
        'Completed'
      ];
      setSelectedStatuses(allStatuses);
    }
  }, []);

  // Save selected statuses to localStorage whenever they change
  useEffect(() => {
    if (selectedStatuses.length > 0) {
      localStorage.setItem('act-selected-statuses', JSON.stringify(selectedStatuses));
    }
  }, [selectedStatuses]);

  const handleFileSelect = async (file: File) => {
    if (selectedStatuses.length === 0) {
      toast({
        title: "No statuses selected",
        description: "Please select at least one status to filter by before uploading",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const processedData = await processSpreadsheet(file, selectedStatuses);
      setData(processedData);
      setUploadTime(new Date());
      
      toast({
        title: "File processed successfully",
        description: `Found ${processedData.length} matching records`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: "Please check that the file format is correct",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 print-hidden">
          <h1 className="text-3xl font-bold mb-2">ACT Database Distiller</h1>
          <p className="text-muted-foreground">
            Upload and process sponsored agreements database spreadsheets
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="print-hidden space-y-6">
            <StatusFilter 
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
            />
            <FileUpload 
              onFileSelect={handleFileSelect} 
              isProcessing={isProcessing}
            />
          </div>
          
          {uploadTime && data && (
            <DataTable data={data} uploadTime={uploadTime} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
