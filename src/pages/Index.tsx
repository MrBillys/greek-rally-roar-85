
import { Link } from "react-router-dom";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RallyCard from "@/components/rally-card";
import { rallies, drivers } from "@/data/mock-data";
import { ThemeProvider } from "@/components/theme-provider";
import { ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Filter rallies for upcoming and ongoing events
  const featuredRallies = rallies
    .filter(rally => rally.status === "upcoming" || rally.status === "ongoing")
    .slice(0, 3);

  // Get featured drivers
  const featuredDrivers = drivers.slice(0, 3);

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredRallies.map((rally) => (
                  <RallyCard key={rally.id} rally={rally} />
                ))}
              </div>
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
                    <h3 className="text-lg font-bold mb-4">Current Rally: Crete Rally 2024</h3>
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
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 font-bold">1</td>
                            <td className="py-2">Elena Andreou</td>
                            <td className="py-2">35:44.8</td>
                            <td className="py-2">-</td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <td className="py-2 font-bold">2</td>
                            <td className="py-2">Nikos Papadopoulos</td>
                            <td className="py-2">35:43.8</td>
                            <td className="py-2">+1.0s</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-bold">3</td>
                            <td className="py-2">Andreas Dimitriou</td>
                            <td className="py-2">35:49.5</td>
                            <td className="py-2">+6.7s</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDrivers.map((driver) => (
                  <div key={driver.id} className="rally-card overflow-hidden">
                    <div className="h-64 overflow-hidden">
                      <img src={driver.image} alt={driver.name} className="w-full h-full object-cover" />
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
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
