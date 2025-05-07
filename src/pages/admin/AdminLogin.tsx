
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useSupabase";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { success } = await login(email, password);
    
    if (success) {
      navigate("/admin");
    }
    
    setIsLoading(false);
  };

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <Flag className="h-12 w-12 text-rally-purple" />
            </div>
            <CardTitle className="text-2xl">Greek Rally Admin</CardTitle>
            <CardDescription>
              Log in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-rally-purple hover:bg-rally-purple-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ThemeProvider>
  );
};

export default AdminLogin;
