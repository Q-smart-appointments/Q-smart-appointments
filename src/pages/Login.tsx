
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Define the form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"customer" | "provider">("customer");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: activeTab === "customer" ? "customer@example.com" : "provider@example.com",
      password: "password",
    },
  });

  // Update form values when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as "customer" | "provider");
    form.setValue("email", value === "customer" ? "customer@example.com" : "provider@example.com");
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to QueueLess!",
      });
      
      // Redirect based on user role
      navigate(activeTab === "customer" ? "/customer-dashboard" : "/provider-dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Choose your account type and enter your credentials
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="customer" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-2 mx-4">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="provider">Service Provider</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer" className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-xs text-queueless-grey">
                      <p>Demo Customer Credentials:</p>
                      <p>Email: customer@example.com</p>
                      <p>Password: password</p>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-queueless-primary hover:bg-queueless-secondary" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="provider" className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-xs text-queueless-grey">
                      <p>Demo Provider Credentials:</p>
                      <p>Email: provider@example.com</p>
                      <p>Password: password</p>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-queueless-primary hover:bg-queueless-secondary" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
