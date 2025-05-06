
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, Flag, MapIcon, Trophy } from "lucide-react";
import NotFound from "./NotFound";
import { useRallyById, useLiveResults, useOverallStandings, useStageResults } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

const RallyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  
  const { rally, loading: rallyLoading, error: rallyError } = useRallyById(slug);
  const { results, loading: resultsLoading, error: resultsError } = useLiveResults();
  const { standings, loading: standingsLoading, error: standingsError } = useOverallStandings();
  
  // Filter results and standings for this rally
  const rallyResults = rally ? results.filter(result => result.rallyId === rally._id) : [];
  const rallyStandings = rally ? standings.find(standing => standing.rallyId === rally._id) : null;
  
  // Fetch results for the selected stage
  const { results: stageResults, loading: stageResultsLoading, error: stageResultsError } = 
    useStageResults(selectedStageId);

  useEffect(() => {
    if (rally?.specialStages && rally.specialStages.length > 0 && !selectedStageId) {
      console.log("Setting initial selected stage:", rally.specialStages[0]?._id);
      setSelectedStageId(rally.specialStages[0]?._id || null);
    }
  }, [rally]);

  // Handle stage selection
  const handleStageSelect = (stageId: string) => {
    console.log("Stage selected:", stageId);
    setSelectedStageId(stageId);
  };

  // Handle switching to results tab with selected stage
  const handleStageClick = (stageId: string) => {
    setSelectedStageId(stageId);
    // Find and click the results tab
    const resultsTab = document.querySelector('[data-state="inactive"][value="results"]') as HTMLElement;
    if (resultsTab) {
      resultsTab.click();
    }
  };

  // Handling loading and error states
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

  console.log("Rally data:", rally);
  console.log("Special stages:", rally.specialStages);

  // Helper function to get status badge
  const getStatusBadge = () => {
    switch (rally.status) {
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

  // Helper function to get stage status badge
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

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "TBD";
    return dateString;
  };

  // Format time for display
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "TBD";
    return timeString;
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Rally Header */}
          <div 
            className="relative h-64 md:h-96 bg-cover bg-center"
            style={{ backgroundImage: rally.image ? `url(${urlFor(rally.image).width(1600).url()})` : 'url(/placeholder.svg)' }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
              <div className="max-w-5xl mx-auto w-full text-white">
                <div className="mb-4">{getStatusBadge()}</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{rally.name}</h1>
                <div className="flex flex-wrap gap-4 items-center text-sm md:text-base">
                  <div className="flex items-center">
                    <MapIcon className="h-5 w-5 mr-2" />
                    {rally.location}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    {rally.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rally Content */}
          <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About the Rally</h2>
              <p className="text-gray-700 dark:text-gray-300">{rally.description}</p>
            </div>
            
            <Tabs defaultValue="stages">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="stages">Special Stages</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="standings">Standings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stages">
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  {rally.specialStages && rally.specialStages.length > 0 ? (
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
                        {rally.specialStages.map((stage: any, index: number) => (
                          <TableRow 
                            key={index} 
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => handleStageClick(stage._id)}
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
                {resultsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rally-purple border-solid mx-auto"></div>
                    <p className="mt-4">Loading results...</p>
                  </div>
                ) : resultsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Error loading results!</p>
                  </div>
                ) : (
                  <>
                    {/* Stage Selection Bar */}
                    {rally.specialStages && rally.specialStages.length > 0 && (
                      <div className="mb-6 overflow-x-auto">
                        <div className="flex space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          {rally.specialStages.map((stage: any, index: number) => (
                            <Button 
                              key={index}
                              variant={selectedStageId === stage._id ? "default" : "outline"}
                              onClick={() => handleStageSelect(stage._id)}
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
                      ) : stageResults && stageResults.length > 0 ? (
                        <div className="mb-6">
                          <h3 className="text-lg font-bold mb-3">
                            {stageResults[0]?.stageName || "Stage"} Results
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
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {stageResults[0]?.results && stageResults[0]?.results.map((driver: any, idx: number) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-bold">{driver.position}</TableCell>
                                    <TableCell>{driver.carNumber}</TableCell>
                                    <TableCell>{driver.driver}</TableCell>
                                    <TableCell className="font-mono">{driver.time}</TableCell>
                                    <TableCell className="font-mono">{driver.gap}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                          <Clock className="mx-auto h-16 w-16 text-gray-400" />
                          <p className="mt-4 text-gray-600 dark:text-gray-400">No results available for this stage yet.</p>
                        </div>
                      )
                    ) : rallyResults.length > 0 ? (
                      // Show overall results if no specific stage is selected
                      <div>
                        <h3 className="text-lg font-bold mb-3">Overall Rally Results</h3>
                        {rallyResults.map((result) => (
                          <div key={result._id} className="mb-6">
                            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Pos</TableHead>
                                    <TableHead>No</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Gap</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {result.results && result.results.map((driver: any, idx: number) => (
                                    <TableRow key={idx}>
                                      <TableCell className="font-bold">{driver.position}</TableCell>
                                      <TableCell>{driver.carNumber}</TableCell>
                                      <TableCell>{driver.driver}</TableCell>
                                      <TableCell className="font-mono">{driver.time}</TableCell>
                                      <TableCell className="font-mono">{driver.gap}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <Clock className="mx-auto h-16 w-16 text-gray-400" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">No results available yet. Please select a stage or wait for results to be published.</p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="standings">
                {standingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rally-purple border-solid mx-auto"></div>
                    <p className="mt-4">Loading standings...</p>
                  </div>
                ) : standingsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Error loading standings!</p>
                  </div>
                ) : rallyStandings ? (
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      Rally Standings
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
                            <TableHead>Points</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rallyStandings.standings && rallyStandings.standings.map((driver: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell className="font-bold">{driver.position}</TableCell>
                              <TableCell>{driver.carNumber}</TableCell>
                              <TableCell>{driver.driver}</TableCell>
                              <TableCell className="font-mono">{driver.totalTime}</TableCell>
                              <TableCell className="font-mono">{driver.gap}</TableCell>
                              <TableCell className="font-bold">{driver.points}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <Flag className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">No standings available yet.</p>
                  </div>
                )}
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
