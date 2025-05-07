
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Edit,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const AdminTeams = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading, error } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data || [];
    }
  });

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!teamToDelete) return;
    
    setIsDeleting(true);
    try {
      // Check if the team has associated drivers or cars
      const { data: drivers, error: driversError } = await supabase
        .from("drivers")
        .select("id")
        .eq("team_id", teamToDelete);
      
      if (driversError) throw driversError;
      
      const { data: cars, error: carsError } = await supabase
        .from("cars")
        .select("id")
        .eq("team_id", teamToDelete);
      
      if (carsError) throw carsError;
      
      if ((drivers && drivers.length > 0) || (cars && cars.length > 0)) {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: t("team.cannotDeleteWithRelations"),
        });
        return;
      }
      
      const { error } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamToDelete);
      
      if (error) throw error;
      
      toast({
        title: t("common.success"),
        description: t("team.deleteSuccess"),
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: String(error),
      });
    } finally {
      setIsDeleting(false);
      setTeamToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.teams')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('admin.manageTeams')}
          </p>
        </div>
        <Button asChild className="bg-rally-purple hover:bg-rally-purple-dark">
          <Link to="/admin/teams/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('admin.addTeam')}
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder={t('common.search')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rally-purple" />
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-red-500">{t('common.error')}: {String(error)}</p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">{t('team.noTeamsFound')}</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('team.name')}</TableHead>
                <TableHead>{t('team.country')}</TableHead>
                <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {team.logo_url && (
                        <img 
                          src={team.logo_url}
                          alt={team.name}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <span>{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{team.country}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/admin/teams/${team.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{t('common.edit')}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setTeamToDelete(team.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t('common.delete')}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!teamToDelete} onOpenChange={(open) => !open && setTeamToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTeams;
