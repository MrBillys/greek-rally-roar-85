
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { rallies, liveResults, overallStandings } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, Flag, MapIcon } from "lucide-react";
import NotFound from "./NotFound";

const RallyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [rally, setRally] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rallyResults, setRallyResults] = useState<any[]>([]);
  const [rallyStandings, setRallyStandings] = useState<any>(null);

  useEffect(() => {
    // Simulating data fetch
    setTimeout(() => {
      const foundRally = rallies.find(r => r.id === id);
      setRally(foundRally || null);
      
      // Get rally results
      const results = liveResults.filter(result => result.rallyId === id);
      setRallyResults(results);
      
      // Get rally standings
      const standings = overallStandings.find(standing => standing.rallyId === id);
      setRallyStandings(standings || null);
      
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
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

  if (!rally) {
    return <NotFound />;
  }

  // Helper function to get status badge
  const getStatusBadge = () => {
    switch (rally.status) {
      case "upcoming":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Upcoming</Badge>;
      case "ongoing":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ongoing</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {/* Rally Header */}
          <div 
            className="relative h-64 md:h-96 bg-cover bg-center"
            style={{ backgroundImage: `url(${rally.image})` }}
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
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left">Stage</th>
                        <th className="px-4 py-3 text-left">Distance</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rally.specialStages.map((stage: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="px-4 py-3 font-medium">{stage.name}</td>
                          <td className="px-4 py-3">{stage.distance}</td>
                          <td className="px-4 py-3">{stage.date}</td>
                          <td className="px-4 py-3">{stage.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="results">
                {rallyResults.length > 0 ? (
                  rallyResults.map((result) => (
                    <div key={result.stageId} className="mb-6">
                      <h3 className="text-lg font-bold mb-3">{result.stageName}</h3>
                      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
                              <tr key={driver.carNumber} className="border-b border-gray-200 dark:border-gray-700">
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
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <Clock className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">No results available yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="standings">
                {rallyStandings ? (
                  <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
                          <tr key={driver.carNumber} className="border-b border-gray-200 dark:border-gray-700">
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
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <Flag className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">No standings available yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-center">
              <Link to="/calendar">
                <Button variant="outline">
                  Back to Calendar
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default RallyDetail;
