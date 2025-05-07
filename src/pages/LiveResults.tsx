
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Flag } from "lucide-react";
import { useLiveResults, useOverallStandings } from "@/hooks/useSupabase";

const LiveResults = () => {
  const [selectedRally, setSelectedRally] = useState<string | null>(null);
  const { results, loading: resultsLoading, error: resultsError } = useLiveResults();
  const { standings, loading: standingsLoading, error: standingsError } = useOverallStandings();
  
  const [rallyResults, setRallyResults] = useState<any[]>([]);
  const [rallyStandings, setRallyStandings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Find current ongoing rally
  useEffect(() => {
    if (!resultsLoading && results.length > 0 && !selectedRally) {
      setSelectedRally(results[0].rallyId);
    }
  }, [results, resultsLoading, selectedRally]);

  // Filter results and standings by selected rally
  useEffect(() => {
    setLoading(true);
    
    if (selectedRally) {
      const filteredResults = results.filter(result => result.rallyId === selectedRally);
      setRallyResults(filteredResults);
      
      const filteredStandings = standings.find(standing => standing.rallyId === selectedRally);
      setRallyStandings(filteredStandings || null);
    }
    
    setLoading(false);
  }, [selectedRally, results, standings]);

  // Get current rally name
  const currentRallyName = selectedRally 
    ? results.find(result => result.rallyId === selectedRally)?.rallyName || "Selected Rally"
    : "No Active Rally";

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-gray-100 dark:bg-gray-800 py-16">
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Live Results
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Follow the action as it happens with our real-time results system. 
                  Stay updated on stage times, overall standings, and driver performances.
                </p>
                
                {resultsLoading ? (
                  <div className="mt-6 inline-block">
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-6 w-40 rounded"></div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="mt-6 inline-block">
                    <Badge variant="default" className="bg-green-600 text-white px-3 py-1">
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2"></span>
                        Live Now: {currentRallyName}
                      </span>
                    </Badge>
                  </div>
                ) : (
                  <div className="mt-6 inline-block">
                    <Badge variant="outline" className="text-gray-500 px-3 py-1">
                      No active rallies
                    </Badge>
                  </div>
                )}
              </div>

              {resultsLoading || standingsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rally-purple border-solid mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading results...</p>
                </div>
              ) : resultsError || standingsError ? (
                <div className="p-8 text-center">
                  <p className="text-red-500">Error loading data: {resultsError?.message || standingsError?.message}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center">
                  <Clock className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-gray-500">No rally results available yet.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                  {/* Rally selector if multiple rallies */}
                  {results.length > 1 && (
                    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                      <select 
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        value={selectedRally || ""}
                        onChange={(e) => setSelectedRally(e.target.value)}
                      >
                        {Array.from(new Set(results.map(result => result.rallyId))).map(rallyId => {
                          const rallyName = results.find(r => r.rallyId === rallyId)?.rallyName || rallyId;
                          return (
                            <option key={rallyId} value={rallyId}>{rallyName}</option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                
                  <Tabs defaultValue="stages" className="w-full">
                    <div className="px-4 pt-4 border-b border-gray-200 dark:border-gray-700">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="stages">Stage Results</TabsTrigger>
                        <TabsTrigger value="overall">Overall Standings</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-rally-purple border-solid mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading results...</p>
                      </div>
                    ) : (
                      <>
                        <TabsContent value="stages" className="p-4">
                          {rallyResults.length > 0 ? (
                            rallyResults.map((result) => (
                              <div key={result.id} className="mb-6 last:mb-0">
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="text-lg font-bold">{result.stageName}</h3>
                                  <span className="text-sm text-gray-500">{result.date}</span>
                                </div>
                                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-4 py-3 text-left">Pos</th>
                                        <th className="px-4 py-3 text-left">No</th>
                                        <th className="px-4 py-3 text-left">Driver</th>
                                        <th className="px-4 py-3 text-left">Time</th>
                                        <th className="px-4 py-3 text-left">Gap</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {result.results.map((driver: any) => (
                                        <tr key={`${result.id}-${driver.carNumber}`} className="border-b border-gray-200 dark:border-gray-700 last:border-none">
                                          <td className="px-4 py-3 font-bold">{driver.position}</td>
                                          <td className="px-4 py-3">{driver.carNumber}</td>
                                          <td className="px-4 py-3">{driver.driver}</td>
                                          <td className="px-4 py-3 font-mono">{driver.time}</td>
                                          <td className="px-4 py-3 font-mono">{driver.gap}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <Clock className="mx-auto h-16 w-16 text-gray-400" />
                              <p className="mt-4 text-gray-500">No stage results available yet.</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="overall" className="p-4">
                          {rallyStandings ? (
                            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-3 text-left">Pos</th>
                                    <th className="px-4 py-3 text-left">No</th>
                                    <th className="px-4 py-3 text-left">Driver</th>
                                    <th className="px-4 py-3 text-left">Total Time</th>
                                    <th className="px-4 py-3 text-left">Gap</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rallyStandings.standings.map((driver: any) => (
                                    <tr key={driver.carNumber} className="border-b border-gray-200 dark:border-gray-700 last:border-none">
                                      <td className="px-4 py-3 font-bold">{driver.position}</td>
                                      <td className="px-4 py-3">{driver.carNumber}</td>
                                      <td className="px-4 py-3">{driver.driver}</td>
                                      <td className="px-4 py-3 font-mono">{driver.totalTime}</td>
                                      <td className="px-4 py-3 font-mono">{driver.gap}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <Flag className="mx-auto h-16 w-16 text-gray-400" />
                              <p className="mt-4 text-gray-500">No overall standings available yet.</p>
                            </div>
                          )}
                        </TabsContent>
                      </>
                    )}
                  </Tabs>
                </div>
              )}
              
              <div className="mt-8 text-center text-sm text-gray-500">
                Last updated: <span className="font-semibold">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default LiveResults;
