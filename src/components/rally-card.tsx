
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarIcon, Flag, MapIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity";

interface RallyCardProps {
  rally: {
    _id: string;
    name: string;
    location: string;
    date: string;
    image: any; // Sanity image
    status: "upcoming" | "in-progress" | "completed";
    slug: {
      current: string;
    };
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

  return (
    <Link to={`/rallies/${rally.slug.current}`}>
      <Card className="rally-card h-full hover:translate-y-[-5px] transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          {rally.image && (
            <img
              src={urlFor(rally.image).width(600).url()}
              alt={rally.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          )}
          <div className="absolute top-2 right-2">{getStatusBadge()}</div>
        </div>
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{rally.name}</h3>
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
