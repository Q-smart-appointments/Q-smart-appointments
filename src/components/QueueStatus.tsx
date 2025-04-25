
import { useState, useEffect } from "react";
import { getQueueInfo } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface QueueStatusProps {
  appointmentId: string;
}

const QueueStatus = ({ appointmentId }: QueueStatusProps) => {
  const [queueInfo, setQueueInfo] = useState<{
    position: number;
    estimatedWaitTime: number;
    appointmentsAhead: number;
    status: 'waiting' | 'in-progress' | 'ready' | 'completed';
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueueInfo = async () => {
      try {
        setLoading(true);
        const info = await getQueueInfo(appointmentId);
        setQueueInfo(info);
        setError(null);
      } catch (err) {
        setError("Could not fetch queue status");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueInfo();
    
    // Setup polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchQueueInfo, 30000);
    
    return () => clearInterval(intervalId);
  }, [appointmentId]);

  if (loading) {
    return (
      <div className="animate-pulse flex flex-col space-y-2 p-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (error || !queueInfo) {
    return (
      <div className="text-red-500 text-sm p-2">
        Could not retrieve queue status
      </div>
    );
  }

  const { position, estimatedWaitTime, appointmentsAhead, status } = queueInfo;

  // Status messages and colors
  const getStatusInfo = () => {
    switch (status) {
      case 'ready':
        return {
          message: "It's your turn!",
          color: "text-green-600",
          progressColor: "bg-green-600"
        };
      case 'in-progress':
        return {
          message: "Currently being served",
          color: "text-yellow-600",
          progressColor: "bg-yellow-600"
        };
      case 'completed':
        return {
          message: "Appointment completed",
          color: "text-blue-600",
          progressColor: "bg-blue-600"
        };
      default:
        return {
          message: "Waiting",
          color: "text-queueless-primary",
          progressColor: "bg-queueless-primary"
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
      <div className={`text-sm font-medium mb-2 ${statusInfo.color}`}>
        {statusInfo.message}
      </div>
      
      {status === 'waiting' && (
        <>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Queue Position: {position}</span>
              <span>{appointmentsAhead} ahead of you</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - (appointmentsAhead / position) * 100)} 
              className="h-2"
            />
          </div>
          
          <div className="text-xs text-gray-600 flex justify-between">
            <span>Estimated wait:</span>
            <span className="font-medium">
              {estimatedWaitTime < 60 ? 
                `${estimatedWaitTime} minutes` : 
                `${Math.floor(estimatedWaitTime/60)} hr ${estimatedWaitTime%60} min`
              }
            </span>
          </div>
        </>
      )}
      
      {(status === 'ready' || status === 'in-progress') && (
        <div className="animate-pulse-light">
          <Progress value={100} className={`h-2 ${statusInfo.progressColor}`} />
        </div>
      )}
      
      {status === 'completed' && (
        <div className="text-xs text-gray-600">
          Thank you for your visit!
        </div>
      )}
    </div>
  );
};

export default QueueStatus;
