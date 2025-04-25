
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Appointment, 
  getAppointmentsByProvider, 
  updateAppointmentStatus,
  getProviderStats
} from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppointmentCard from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ProviderDashboard = () => {
  const { user, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    noShows: 0,
    averageWaitTime: 0
  });
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  useEffect(() => {
    // Redirect if not authenticated or wrong role
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (role !== "provider") {
      navigate("/");
      return;
    }

    // Fetch appointments and stats
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const [appointmentsData, statsData] = await Promise.all([
            getAppointmentsByProvider(user.id),
            getProviderStats(user.id)
          ]);
          
          setAppointments(appointmentsData);
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, role, navigate, user, toast]);

  const handleStatusChange = async (id: string, status: Appointment["status"]) => {
    try {
      await updateAppointmentStatus(id, status);
      
      // Update local state
      setAppointments(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status } : app
        )
      );
      
      // Refresh stats for completed appointments
      if (status === "completed" && user?.id) {
        const statsData = await getProviderStats(user.id);
        setStats(statsData);
      }
      
      toast({
        title: "Status updated",
        description: `Appointment status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  // Filter appointments by date and status
  const todayAppointments = appointments.filter(
    app => app.date === selectedDate && 
    (app.status === "scheduled" || app.status === "in-progress")
  ).sort((a, b) => {
    // Sort by queue position first
    if ((a.queuePosition || 0) !== (b.queuePosition || 0)) {
      return (a.queuePosition || 0) - (b.queuePosition || 0);
    }
    // Then by start time
    return a.startTime.localeCompare(b.startTime);
  });
  
  const completedAppointments = appointments.filter(
    app => app.date === selectedDate && app.status === "completed"
  );
  
  const missedAppointments = appointments.filter(
    app => app.date === selectedDate && 
    (app.status === "no-show" || app.status === "cancelled")
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Provider Dashboard</h1>
            <p className="text-queueless-grey">
              {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-queueless-grey">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-queueless-primary" />
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-queueless-grey">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold">{stats.completedAppointments}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-queueless-grey">
                No-Shows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-red-500" />
                <div className="text-2xl font-bold">{stats.noShows}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-queueless-grey">
                Avg. Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-queueless-primary" />
                <div className="text-2xl font-bold">{stats.averageWaitTime} min</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="queue" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="queue">Current Queue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="missed">Missed/Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="queue">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64"></div>
                ))}
              </div>
            ) : todayAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                    showActions={true}
                    showQueue={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-queueless-grey">No appointments in queue for today.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {loading ? (
              <div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>
            ) : completedAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedAppointments.map((appointment) => (
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
                <p className="text-queueless-grey">No completed appointments for today.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="missed">
            {loading ? (
              <div className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>
            ) : missedAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missedAppointments.map((appointment) => (
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
                <p className="text-queueless-grey">No missed or cancelled appointments for today.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
