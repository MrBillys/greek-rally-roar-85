
import { Link } from "react-router-dom";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RallyCard from "@/components/rally-card";
import { ThemeProvider } from "@/components/theme-provider";
import { ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRallies, useDrivers, useLiveResults, useOverallStandings } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";

const Index = () => {
  const { rallies, loading: ralliesLoading } = useRallies();
  const { drivers, loading: driversLoading } = useDrivers();
  const { results } = useLiveResults();
  const { standings } = useOverallStandings();
  
  // Filter rallies for upcoming and ongoing events
  const featuredRallies = rallies
    .filter(rally => rally.status === "upcoming" || rally.status === "in-progress")
    .slice(0, 3);

  // Get featured drivers
  const featuredDrivers = drivers.slice(0, 3);
  
  // Get current ongoing rally standings if available
  const ongoingRally = rallies.find(rally => rally.status === "in-progress");
  const ongoingRallyStandings = ongoingRally 
    ? standings.find(s => s.rallyId === ongoingRally._id)
    : null;

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          
          {/* Featured Rallies Section */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Rallies</h2>
                <Link to="/calendar" className="text-rally-purple hover:text-rally-purple-dark flex items-center text-sm font-medium">
                  View All Rallies 
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {ralliesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-80"></div>
                  ))}
                </div>
              ) : featuredRallies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredRallies.map((rally) => (
                    <RallyCard key={rally._id} rally={rally} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming or ongoing rallies found.</p>
                </div>
              )}
            </div>
          </section>
          
          {/* Live Results Promo */}
          <section className="py-16 bg-gray-100 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:w-1/2">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Live Results</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Follow the action as it happens with our real-time results system. 
                    Stay updated on stage times, overall standings, and driver performances.
                  </p>
                  <Link to="/live">
                    <Button className="rally-button">
                      <Flag className="mr-2 h-5 w-5" />
                      Check Live Results
                    </Button>
                  </Link>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                    {ongoingRally && ongoingRallyStandings ? (
                      <>
                        <h3 className="text-lg font-bold mb-4">Current Rally: {ongoingRally.name}</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-2 text-left">Pos</th>
                                <th className="py-2 text-left">Driver</th>
                                <th className="py-2 text-left">Time</th>
                                <th className="py-2 text-left">Gap</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ongoingRallyStandings.standings.slice(0, 3).map((driver: any) => (
                                <tr key={driver.carNumber} className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="py-2 font-bold">{driver.position}</td>
                                  <td className="py-2">{driver.driver}</td>
                                  <td className="py-2">{driver.totalTime}</td>
                                  <td className="py-2">{driver.gap}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No active rallies at the moment.</p>
                        <p className="mt-2 text-sm">Check back during the next event!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Featured Drivers */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Drivers</h2>
                <Link to="/drivers" className="text-rally-purple hover:text-rally-purple-dark flex items-center text-sm font-medium">
                  View All Drivers
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              {driversLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-80"></div>
                  ))}
                </div>
              ) : featuredDrivers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredDrivers.map((driver) => (
                    <div key={driver._id} className="rally-card overflow-hidden">
                      <div className="h-64 overflow-hidden">
                        {driver.image && (
                          <img 
                            src={urlFor(driver.image).width(400).height(300).url()} 
                            alt={driver.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{driver.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {driver.car} | {driver.team}
                        </p>
                        <div className="flex space-x-4 text-sm">
                          <div>
                            <span className="font-bold">{driver.championships}</span> Championships
                          </div>
                          <div>
                            <span className="font-bold">{driver.podiums}</span> Podiums
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No drivers found.</p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
