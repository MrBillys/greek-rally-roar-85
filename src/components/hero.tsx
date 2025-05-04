
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              <span className="block">Greek Rally</span>
              <span className="block text-rally-purple">Championship</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 dark:text-gray-300">
              Experience the thrill of Greek rally racing with live results, 
              detailed event information, and driver profiles.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/calendar">
                <Button className="rally-button">
                  <Flag className="mr-2 h-5 w-5" />
                  View Calendar
                </Button>
              </Link>
              <Link to="/live">
                <Button variant="outline" className="hover:text-rally-purple">
                  Live Results
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </div>
  );
}
