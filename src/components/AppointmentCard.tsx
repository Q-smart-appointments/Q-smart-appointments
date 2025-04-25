
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Appointment, getQueueInfo } from "@/lib/api";
import { Clock, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import QueueStatus from "./QueueStatus";

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: (id: string, status: Appointment["status"]) => void;
  onReschedule?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  showActions?: boolean;
  showQueue?: boolean;
}

const AppointmentCard = ({
  appointment,
  onStatusChange,
  onReschedule,
  onCancel,
  showActions = true,
  showQueue = true,
}: AppointmentCardProps) => {
  const { role } = useAuth();
  const [showQueueDetails, setShowQueueDetails] = useState(false);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      case "no-show": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  // Format status text
  const formatStatus = (status: Appointment["status"]) => {
    switch (status) {
      case "in-progress": return "In Progress";
      case "no-show": return "No Show";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Check if the appointment is today
  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  };

  // Check if appointment can be modified (only if it's scheduled and not today)
  const canModify = appointment.status === "scheduled" && !isToday(appointment.date);

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{appointment.serviceName}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <User className="w-4 h-4 mr-1" /> {appointment.providerName}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(appointment.status)}`}>
            {formatStatus(appointment.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-queueless-grey">
            <Calendar className="w-4 h-4 mr-2" /> 
            {formatDate(appointment.date)}
          </div>
          <div className="flex items-center text-queueless-grey">
            <Clock className="w-4 h-4 mr-2" /> 
            {appointment.startTime} - {appointment.endTime}
          </div>
        </div>

        {showQueue && appointment.status === "scheduled" && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowQueueDetails(!showQueueDetails)}
              className="w-full text-queueless-primary border-queueless-primary hover:bg-queueless-light"
            >
              {showQueueDetails ? "Hide Queue Status" : "View Queue Status"}
            </Button>
            
            {showQueueDetails && (
              <div className="mt-3">
                <QueueStatus appointmentId={appointment.id} />
              </div>
            )}
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="pt-0 flex flex-wrap gap-2">
          {role === "provider" && appointment.status === "scheduled" && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange?.(appointment.id, "in-progress")}
              className="bg-queueless-primary hover:bg-queueless-secondary"
            >
              Start Appointment
            </Button>
          )}

          {role === "provider" && appointment.status === "in-progress" && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange?.(appointment.id, "completed")}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete
            </Button>
          )}

          {role === "provider" && (appointment.status === "scheduled" || appointment.status === "in-progress") && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onStatusChange?.(appointment.id, "no-show")}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              Mark No-Show
            </Button>
          )}

          {role === "customer" && canModify && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onReschedule?.(appointment)}
                className="text-queueless-primary border-queueless-primary hover:bg-queueless-light"
              >
                Reschedule
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onCancel?.(appointment)}
                className="text-red-500 border-red-500 hover:bg-red-50"
              >
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;
