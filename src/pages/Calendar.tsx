
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { rallies } from "@/data/mock-data";
import RallyCard from "@/components/rally-card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

const Calendar = () => {
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  const [viewMode, setViewMode] = useState<"list" | "month">("list");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const filteredRallies = rallies.filter(rally => {
    if (filter === "all") return true;
    return rally.status === filter;
  });

  // Get rallies for the selected month when in month view
  const ralliesInSelectedMonth = date 
    ? filteredRallies.filter(rally => {
        const rallyDate = new Date(rally.date);
        return rallyDate.getMonth() === date.getMonth() && 
               rallyDate.getFullYear() === date.getFullYear();
      })
    : [];

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
              
              <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mb-8">
                <div className="flex justify-center space-x-2 overflow-x-auto pb-2 mb-4 md:mb-0">
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
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">View:</span>
                  <Select value={viewMode} onValueChange={(value: "list" | "month") => setViewMode(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="month">Monthly Calendar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {viewMode === "list" ? (
                filteredRallies.length === 0 ? (
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
                )
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 w-full max-w-md">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="pointer-events-auto"
                      modifiers={{
                        rally: filteredRallies.map(rally => new Date(rally.date)),
                      }}
                      modifiersStyles={{
                        rally: { 
                          fontWeight: 'bold', 
                          color: '#9b87f5',
                          backgroundColor: 'rgba(155, 135, 245, 0.1)',
                          border: '2px solid #9b87f5'
                        }
                      }}
                    />
                  </div>
                  
                  {date && (
                    <div className="w-full">
                      <h2 className="text-xl font-semibold text-center mb-4">
                        Rallies in {format(date, 'MMMM yyyy')}
                      </h2>
                      
                      {ralliesInSelectedMonth.length === 0 ? (
                        <div className="text-center py-8">
                          <CalendarDays className="mx-auto h-16 w-16 text-gray-400" />
                          <p className="mt-4 text-gray-600 dark:text-gray-400">No rallies scheduled for this month.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {ralliesInSelectedMonth.map((rally) => (
                            <RallyCard key={rally.id} rally={rally} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
