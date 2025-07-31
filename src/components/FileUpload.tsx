import { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileSelect, isProcessing }: FileUploadProps) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <Card 
      className="border-2 border-dashed border-muted-foreground/25 p-8 text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <Upload className="h-12 w-12 text-muted-foreground" />
        <div>
          <h3 className="text-lg font-medium mb-2">DB as Excel Spreadsheet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drop your FY26 Sponsored Agreements DataBase.xlsx file here or click to browse
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <Button 
            asChild 
            disabled={isProcessing}
            variant="outline"
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {isProcessing ? 'Processing...' : 'Select File'}
            </label>
          </Button>
        </div>
      </div>
    </Card>
  );
};