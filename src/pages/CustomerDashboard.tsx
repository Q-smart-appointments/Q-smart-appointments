
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Appointment, getAppointmentsByCustomer, updateAppointmentStatus } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppointmentCard from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const CustomerDashboard = () => {
  const { user, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or wrong role
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (role !== "customer") {
      navigate("/");
      return;
    }

    // Fetch appointments
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const data = await getAppointmentsByCustomer(user.id);
          setAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load your appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isAuthenticated, role, navigate, user, toast]);

  const handleReschedule = (appointment: Appointment) => {
    // For demo purposes, just navigate to booking page with pre-filled service
    navigate(`/book?serviceId=${appointment.serviceId}&reschedule=${appointment.id}`);
  };

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    
    try {
      await updateAppointmentStatus(selectedAppointment.id, "cancelled");
      
      // Update local state
      setAppointments(prev => 
        prev.map(app => 
          app.id === selectedAppointment.id ? { ...app, status: "cancelled" } : app
        )
      );
      
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel your appointment",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  // Filter appointments by status for tabs
  const upcomingAppointments = appointments.filter(
    app => app.status === "scheduled" || app.status === "in-progress"
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === "completed" || app.status === "cancelled" || app.status === "no-show"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">My Appointments</h1>
          <Button 
            onClick={() => navigate("/book")}
            className="bg-queueless-primary hover:bg-queueless-secondary"
          >
            Book New Appointment
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64"></div>
                ))}
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onReschedule={handleReschedule}
                    onCancel={handleCancelClick}
                    showActions={true}
                    showQueue={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-queueless-grey mb-4">You don't have any upcoming appointments.</p>
                <Button 
                  onClick={() => navigate("/book")}
                  className="bg-queueless-primary hover:bg-queueless-secondary"
                >
                  Book an Appointment
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64"></div>
                ))}
              </div>
            ) : pastAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showActions={false}
                    showQueue={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-queueless-grey">You don't have any past appointments.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-red-500 hover:bg-red-600">
              Yes, cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerDashboard;
