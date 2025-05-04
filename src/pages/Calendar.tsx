
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { rallies } from "@/data/mock-data";
import RallyCard from "@/components/rally-card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => {
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  
  const filteredRallies = rallies.filter(rally => {
    if (filter === "all") return true;
    return rally.status === filter;
  });

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <div className="bg-gray-100 dark:bg-gray-800 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Rally Calendar 2024-2025
                </h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  View the complete schedule of upcoming and past Greek rally events. 
                  Click on any event for detailed information, special stages, and results.
                </p>
              </div>
              
              <div className="flex justify-center mb-8 space-x-2 overflow-x-auto pb-2">
                <Badge 
                  variant={filter === "all" ? "default" : "outline"} 
                  className={`cursor-pointer px-4 py-2 text-sm ${filter === "all" ? "bg-rally-purple hover:bg-rally-purple-dark" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All Events
                </Badge>
                <Badge 
                  variant={filter === "upcoming" ? "default" : "outline"} 
                  className={`cursor-pointer px-4 py-2 text-sm ${filter === "upcoming" ? "bg-rally-purple hover:bg-rally-purple-dark" : ""}`}
                  onClick={() => setFilter("upcoming")}
                >
                  Upcoming
                </Badge>
                <Badge 
                  variant={filter === "ongoing" ? "default" : "outline"} 
                  className={`cursor-pointer px-4 py-2 text-sm ${filter === "ongoing" ? "bg-rally-purple hover:bg-rally-purple-dark" : ""}`}
                  onClick={() => setFilter("ongoing")}
                >
                  Ongoing
                </Badge>
                <Badge 
                  variant={filter === "completed" ? "default" : "outline"} 
                  className={`cursor-pointer px-4 py-2 text-sm ${filter === "completed" ? "bg-rally-purple hover:bg-rally-purple-dark" : ""}`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </Badge>
              </div>
              
              {filteredRallies.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">No rallies found matching your filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRallies.map((rally) => (
                    <RallyCard key={rally.id} rally={rally} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Calendar;
