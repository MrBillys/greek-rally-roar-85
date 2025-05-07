
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarIcon, Flag, MapIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RallyCardProps {
  rally: {
    id: string;
    title: string;
    location: string;
    date: string;
    image_url?: string | null;
    status: "upcoming" | "in-progress" | "completed";
    slug: string;
  };
}

export default function RallyCard({ rally }: RallyCardProps) {
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

  const placeholderImage = "https://images.unsplash.com/photo-1617886322168-72b886573c35?q=80&w=1600&auto=format&fit=crop";

  return (
    <Link to={`/rallies/${rally.slug}`}>
      <Card className="rally-card h-full hover:translate-y-[-5px] transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={rally.image_url || placeholderImage}
            alt={rally.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2">{getStatusBadge()}</div>
        </div>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{rally.title}</h3>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <MapIcon className="mr-2 h-4 w-4" />
            <span>{rally.location}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{rally.date}</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full text-rally-purple hover:underline text-sm font-medium flex items-center">
            View Details
            <Flag className="ml-2 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
