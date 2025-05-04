import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { rallies } from "@/data/mock-data";
import RallyCard from "@/components/rally-card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

const Calendar = () => {
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all");
  const [viewMode, setViewMode] = useState<"list" | "month" | "week">("list");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  
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
  
  // Generate week days for the week view
  const weekDays = date ? Array(7).fill(0).map((_, i) => {
    const dayDate = startOfWeek(date, { weekStartsOn: 0 });
    return addDays(dayDate, i);
  }) : [];
  
  // Get current week's start and end dates
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
  
  // Get rallies for the current week
  const ralliesInCurrentWeek = filteredRallies.filter(rally => {
    const rallyDate = new Date(rally.date);
    return rallyDate >= weekStart && rallyDate <= weekEnd;
  });
  
  // Map rallies to their corresponding weekday
  const rallyEventsByDay = weekDays.map(day => {
    return filteredRallies.filter(rally => {
      const rallyDate = new Date(rally.date);
      return isSameDay(rallyDate, day);
    });
  });
  
  // Handle week navigation
  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };
  
  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };
  
  const goToToday = () => {
    setCurrentWeek(new Date());
  };

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
                  <Select value={viewMode} onValueChange={(value: "list" | "month" | "week") => setViewMode(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="list">List View</SelectItem>
                      <SelectItem value="month">Monthly Calendar</SelectItem>
                      <SelectItem value="week">Weekly Calendar</SelectItem>
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
              ) : viewMode === "month" ? (
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
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                  {/* Weekly Calendar Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={goToToday}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md text-sm font-medium"
                      >
                        Today
                      </button>
                      <div className="flex items-center">
                        <button 
                          onClick={prevWeek} 
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={nextWeek}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      <h2 className="text-lg font-semibold">
                        {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
                      </h2>
                    </div>
                    
                    <Menubar className="border-none bg-transparent">
                      <MenubarMenu>
                        <MenubarTrigger className="cursor-pointer">Day</MenubarTrigger>
                      </MenubarMenu>
                      <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${viewMode === "week" ? "bg-rally-purple text-white" : ""}`}>Week</MenubarTrigger>
                      </MenubarMenu>
                      <MenubarMenu>
                        <MenubarTrigger className={`cursor-pointer ${viewMode === "month" ? "bg-gray-200 dark:bg-gray-700" : ""}`}>Month</MenubarTrigger>
                      </MenubarMenu>
                    </Menubar>
                  </div>
                  
                  {/* Weekly Calendar Grid */}
                  <div className="grid grid-cols-7">
                    {/* Day headings */}
                    {weekDays.map((day, i) => (
                      <div key={i} className="text-center p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                          {format(day, 'EEE')}
                        </p>
                        <p className={`text-lg font-medium ${isSameDay(day, new Date()) ? 'text-rally-purple' : ''}`}>
                          {format(day, 'd')}
                        </p>
                      </div>
                    ))}
                    
                    {/* Time slots for each day */}
                    {weekDays.map((day, dayIndex) => (
                      <div key={dayIndex} className="min-h-[600px] border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                        {/* Rally events for this day */}
                        <div className="p-1">
                          {rallyEventsByDay[dayIndex].map((rally) => (
                            <div 
                              key={rally.id}
                              className={`my-1 p-2 rounded-md text-sm ${
                                rally.status === "upcoming" ? "bg-blue-100 dark:bg-blue-900" : 
                                rally.status === "ongoing" ? "bg-green-100 dark:bg-green-900" : 
                                "bg-gray-100 dark:bg-gray-700"
                              }`}
                            >
                              <p className="font-medium truncate">{rally.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {format(new Date(rally.date), 'HH:mm')} - {rally.location}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        {/* Time slots visualization */}
                        {Array(12).fill(0).map((_, i) => (
                          <div key={i} className="border-t border-gray-100 dark:border-gray-800 h-12">
                            <span className="text-xs text-gray-400 pl-1">{i + 8}:00</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
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
