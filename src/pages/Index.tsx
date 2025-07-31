import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { DataTable, SpreadsheetRow } from '@/components/DataTable';
import { StatusFilter } from '@/components/StatusFilter';
import { UserMenu } from '@/components/UserMenu';
import { processSpreadsheet } from '@/utils/spreadsheetProcessor';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [data, setData] = useState<SpreadsheetRow[]>([]);
  const [uploadTime, setUploadTime] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  // Fetch user profile when user is loaded
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setUserProfile(profile);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

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

    if (!userProfile?.last_name) {
      toast({
        title: "Profile incomplete",
        description: "Please ensure your profile has a last name set up",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const processedData = await processSpreadsheet(file, selectedStatuses, userProfile.last_name);
      setData(processedData);
      setUploadTime(new Date());
      
      toast({
        title: "File processed successfully",
        description: `Found ${processedData.length} matching records for ${userProfile.last_name}`,
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 print-hidden flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">ACT Database Distiller</h1>
            <div className="text-muted-foreground space-y-1">
              <p>
                FY 2026 Sponsored Agreements Database spreadsheet distilled
                {userProfile?.last_name && ` for ${userProfile.last_name}`}
              </p>
              <p>
                Drop in the FY26 Sponsored Agreements DB as an Excel Spreadsheet. Choose the Statuses you want to show.
              </p>
            </div>
          </div>
          <UserMenu />
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
