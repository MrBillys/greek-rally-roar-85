
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { drivers } from "@/data/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";

const Drivers = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-gray-100 dark:bg-gray-800 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Rally Drivers
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Meet the talented drivers competing in the Greek Rally Championship. 
                  Explore their profiles, achievements, and current vehicles.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                  <Card key={driver.id} className="overflow-hidden rally-card hover:scale-[1.01] transition-all">
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={driver.image} 
                        alt={driver.name}
                        className="w-full h-full object-cover"
                      />
                      {driver.championships > 0 && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-rally-purple text-white border-0 flex items-center gap-1">
                            <Flag className="w-3 h-3" /> {driver.championships}x Champion
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                        {driver.name}
                      </h2>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {driver.nationality}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="font-medium">Car:</span> {driver.car}
                        </div>
                        <div>
                          <span className="font-medium">Team:</span> {driver.team}
                        </div>
                      </div>
                      
                      <div className="flex gap-6 text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div>
                          <span className="font-bold text-lg">{driver.championships}</span>
                          <div className="text-gray-600 dark:text-gray-400">Championships</div>
                        </div>
                        <div>
                          <span className="font-bold text-lg">{driver.podiums}</span>
                          <div className="text-gray-600 dark:text-gray-400">Podiums</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        {driver.bio}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Drivers;
