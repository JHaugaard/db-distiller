import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataTable, SpreadsheetRow } from '@/components/DataTable';
import { processSpreadsheet } from '@/utils/spreadsheetProcessor';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [data, setData] = useState<SpreadsheetRow[]>([]);
  const [uploadTime, setUploadTime] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const processedData = await processSpreadsheet(file);
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
          <h1 className="text-3xl font-bold mb-2">Beaver DB - Distilled</h1>
          <p className="text-muted-foreground">
            Upload and process sponsored agreements database spreadsheets
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="print-hidden">
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
