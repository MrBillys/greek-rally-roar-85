
import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Flag, MapIcon, Trophy, CalendarIcon } from "lucide-react";
import NotFound from "./NotFound";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const RallyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // State declarations
  const [rally, setRally] = useState<any | null>(null);
  const [rallyLoading, setRallyLoading] = useState(true);
  const [rallyError, setRallyError] = useState<Error | null>(null);

  const [stages, setStages] = useState<any[]>([]);
  const [stagesLoading, setStagesLoading] = useState(true);

  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [stageResults, setStageResults] = useState<any[]>([]);
  const [stageResultsLoading, setStageResultsLoading] = useState(false);

  // Fetch rally data
  useEffect(() => {
    const fetchRally = async () => {
      if (!slug) return;

      setRallyLoading(true);
      try {
        const { data, error } = await supabase
          .from('rallies')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        setRally(data);
      } catch (error) {
        console.error("Error fetching rally:", error);
        setRallyError(error instanceof Error ? error : new Error('Failed to fetch rally'));
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load rally information",
        });
      } finally {
        setRallyLoading(false);
      }
    };

    fetchRally();
  }, [slug]);

  // Fetch stages when rally is loaded
  useEffect(() => {
    const fetchStages = async () => {
      if (!rally) return;

      setStagesLoading(true);
      try {
        const { data, error } = await supabase
          .from('stages')
          .select('*')
          .eq('rally_id', rally.id)
          .order('start_time', { ascending: true });
          
        if (error) throw error;
        setStages(data || []);
        
        // Select first stage by default
        if (data && data.length > 0 && !selectedStageId) {
          setSelectedStageId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching stages:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load stages",
        });
      } finally {
        setStagesLoading(false);
      }
    };

    fetchStages();
  }, [rally, selectedStageId]);

  // Fetch stage results when a stage is selected
  useEffect(() => {
    const fetchStageResults = async () => {
      if (!selectedStageId) return;

      setStageResultsLoading(true);
      try {
        const { data, error } = await supabase
          .from('stage_results')
          .select(`
            *,
            driver:drivers(*),
            co_driver:drivers(*)
          `)
          .eq('stage_id', selectedStageId)
          .order('position', { ascending: true });
          
        if (error) throw error;
        setStageResults(data || []);
      } catch (error) {
        console.error("Error fetching stage results:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load stage results",
        });
      } finally {
        setStageResultsLoading(false);
      }
    };

    if (selectedStageId) {
      fetchStageResults();
    }
  }, [selectedStageId]);

  // Handle stage selection
  const handleStageSelect = (stageId: string) => {
    setSelectedStageId(stageId);
  };

  const handleStageClick = (stageId: string) => {
    handleStageSelect(stageId);
    const resultsTab = document.querySelector('[data-state="inactive"][value="results"]') as HTMLElement;
    if (resultsTab) {
      resultsTab.click();
    }
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Upcoming</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ongoing</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Completed</Badge>;
      default:
        return null;
    }
  };

  const getStageStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "TBA";
    try {
      return format(parseISO(dateStr), "dd MMM yyyy");
    } catch (e) {
      // Fallback for non-ISO strings
      return dateStr;
    }
  };
  
  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return "TBA";
    return timeStr;
  };

  // Loading and error states
  if (rallyLoading) {
    return (
      <ThemeProvider defaultTheme="light">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-rally-purple border-solid mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading rally information...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }

  if (rallyError || !rally) {
    console.error("Rally error:", rallyError);
    return <NotFound />;
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Rally Header */}
          <div 
            className="relative h-64 md:h-96 bg-cover bg-center"
            style={{ backgroundImage: rally.image_url ? `url(${rally.image_url})` : 'url(/placeholder.svg)' }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
              <div className="max-w-5xl mx-auto w-full text-white">
                <div className="mb-4">{getStatusBadge(rally.status)}</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{rally.title}</h1>
                <div className="flex flex-wrap gap-4 items-center text-sm md:text-base">
                  <div className="flex items-center">
                    <MapIcon className="h-5 w-5 mr-2" />
                    {rally.location}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    {formatDate(rally.date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rally Content */}
          <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About the Rally</h2>
              <p className="text-gray-700 dark:text-gray-300">{rally.description || "No description available."}</p>
            </div>
            
            <Tabs defaultValue="stages">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="stages">Special Stages</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="standings">Standings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stages">
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  {stages.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Stage</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stages.map((stage) => (
                          <TableRow 
                            key={stage.id} 
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleStageClick(stage.id)}
                          >
                            <TableCell className="font-medium">{stage.name}</TableCell>
                            <TableCell>{stage.distance} km</TableCell>
                            <TableCell>{formatDate(stage.date)}</TableCell>
                            <TableCell>{formatTime(stage.time)}</TableCell>
                            <TableCell>
                              {getStageStatusBadge(stage.status)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <p>No special stages defined for this rally yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="results">
                {stagesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rally-purple border-solid mx-auto"></div>
                    <p className="mt-4">Loading stages...</p>
                  </div>
                ) : (
                  <>
                    {/* Stage Selection Bar */}
                    {stages.length > 0 && (
                      <div className="mb-6 overflow-x-auto">
                        <div className="flex space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          {stages.map((stage) => (
                            <Button 
                              key={stage.id}
                              variant={selectedStageId === stage.id ? "default" : "outline"}
                              onClick={() => handleStageSelect(stage.id)}
                              className="whitespace-nowrap"
                            >
                              {stage.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Stage Results */}
                    {selectedStageId ? (
                      stageResultsLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rally-purple border-solid mx-auto"></div>
                          <p className="mt-4">Loading stage results...</p>
                        </div>
                      ) : stageResults.length > 0 ? (
                        <div className="mb-6">
                          <h3 className="text-lg font-bold mb-3">
                            {stages.find(s => s.id === selectedStageId)?.name || "Stage"} Results
                          </h3>
                          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Pos</TableHead>
                                  <TableHead>No</TableHead>
                                  <TableHead>Driver</TableHead>
                                  <TableHead>Time</TableHead>
                                  <TableHead>Gap</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {stageResults.map((result) => (
                                  <TableRow key={result.id}>
                                    <TableCell className="font-bold">{result.position}</TableCell>
                                    <TableCell>{result.car_number}</TableCell>
                                    <TableCell>
                                      {result.driver?.name || "Unknown Driver"}
                                      {result.co_driver?.name && (
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                                          {result.co_driver.name}
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell className="font-mono">{result.time || "-"}</TableCell>
                                    <TableCell className="font-mono">{result.gap || "-"}</TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          result.status === "finished" 
                                            ? "default" 
                                            : "destructive"
                                        }
                                        className="text-xs"
                                      >
                                        {result.status?.toUpperCase() || "UNKNOWN"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                          <Clock className="mx-auto h-16 w-16 text-gray-400" />
                          <p className="mt-4 text-gray-600 dark:text-gray-400">
                            No results available for this stage yet.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <Clock className="mx-auto h-16 w-16 text-gray-400" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Please select a stage to view results.</p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="standings">
                <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <Flag className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Standings feature coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default RallyDetail;
