
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Service, Provider, getServices } from "@/lib/api";

interface UseBookingReturn {
  step: number;
  setStep: (step: number) => void;
  services: Service[];
  providers: Provider[];
  selectedService: string;
  selectedProvider: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  loading: boolean;
  availableTimes: string[];
  handleServiceSelect: (serviceId: string) => Promise<void>;
  handleDateSelect: (date: Date | undefined) => void;
  handleTimeSelect: (time: string) => void;
}

export const useBooking = (): UseBookingReturn => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleServiceSelect = async (serviceId: string) => {
    setSelectedService(serviceId);
    try {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setProviders(service.providers);
        setStep(2);
      }
    } catch (error) {
      console.error("Error setting providers:", error);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) setStep(4);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      console.log("Creating appointment...");
    }
  };

  return {
    step,
    setStep,
    services,
    providers,
    selectedService,
    selectedProvider,
    selectedDate,
    selectedTime,
    loading,
    availableTimes,
    handleServiceSelect,
    handleDateSelect,
    handleTimeSelect,
  };
};
