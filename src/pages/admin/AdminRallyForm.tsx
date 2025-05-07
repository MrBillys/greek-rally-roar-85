
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, SaveIcon } from "lucide-react";
import { useAdminRallies } from "@/hooks/useSupabase";
import { cn } from "@/lib/utils";

const AdminRallyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRally, createRally, updateRally } = useAdminRallies();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<"upcoming" | "in-progress" | "completed">("upcoming");
  const [organizer, setOrganizer] = useState("");
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");

  // Load rally data if editing
  useEffect(() => {
    const loadRally = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const rally = await getRally(id);
        if (rally) {
          setTitle(rally.title || "");
          setShortCode(rally.short_code || "");
          setLocation(rally.location || "");
          setDate(rally.date ? new Date(rally.date) : undefined);
          setStatus(rally.status || "upcoming");
          setOrganizer(rally.organizer || "");
          setWebsite(rally.website || "");
          setImageUrl(rally.image_url || "");
          setDescription(rally.description || "");
          setSlug(rally.slug || "");
        }
      } catch (error) {
        console.error("Error loading rally:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRally();
  }, [id, getRally]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!id && title) {
      setSlug(title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  }, [title, id]);

  // Auto-generate short code from title
  useEffect(() => {
    if (!id && title) {
      // Take first letter of each word and make uppercase
      const code = title
        .split(" ")
        .map(word => word.charAt(0).toUpperCase())
        .join("");
      setShortCode(code);
    }
  }, [title, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !location || !date || !status || !organizer || !slug) {
      alert("Please fill out all required fields");
      return;
    }
    
    setSaving(true);
    
    const rallyData = {
      title,
      short_code: shortCode,
      location,
      date: format(date, "yyyy-MM-dd"),
      status,
      organizer,
      website: website || null,
      image_url: imageUrl || null,
      description: description || null,
      slug
    };
    
    try {
      if (id) {
        await updateRally(id, rallyData);
      } else {
        await createRally(rallyData);
      }
      navigate("/admin/rallies");
    } catch (error) {
      console.error("Error saving rally:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-rally-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {id ? "Edit Rally" : "Add New Rally"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {id ? "Update an existing rally" : "Create a new rally event"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rally Details</CardTitle>
          <CardDescription>
            Enter the information for the rally event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Acropolis Rally 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-code">Short Code *</Label>
                <Input
                  id="short-code"
                  placeholder="ACR"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Athens, Greece"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as any)}
                  required
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer *</Label>
                <Input
                  id="organizer"
                  placeholder="Hellenic Motorsport Federation"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://www.rally-event.gr"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="acropolis-rally-2025"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description for the rally..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/rallies")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-rally-purple hover:bg-rally-purple-dark"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRallyForm;
