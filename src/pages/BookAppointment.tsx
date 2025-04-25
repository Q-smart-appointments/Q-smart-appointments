
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Service, Provider, getServices, getProviders } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const BookAppointment = () => {
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

  useEffect(() => {
    const initializeBooking = async () => {
      try {
        setLoading(true);
        const servicesData = await getServices();
        setServices(servicesData);
        
        // If serviceId is in URL, pre-select it
        const serviceId = searchParams.get("serviceId");
        if (serviceId) {
          setSelectedService(serviceId);
          setStep(2);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeBooking();
  }, [searchParams]);

  const handleServiceSelect = async (serviceId: string) => {
    setSelectedService(serviceId);
    try {
      const providersData = await getProviders(serviceId);
      setProviders(providersData);
      setStep(2);
    } catch (error) {
      console.error("Error fetching providers:", error);
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
      // Handle appointment creation
      console.log("Creating appointment...");
    }
  };

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12 fade-up">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Book Your Appointment
          </h1>
          <p className="text-queueless-grey max-w-2xl mx-auto">
            Follow these simple steps to book your appointment with one of our qualified professionals
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-between mb-12 relative fade-up">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex flex-col items-center relative z-10 ${
                  num <= step ? "text-queueless-primary" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                    ${
                      num <= step
                        ? "bg-queueless-primary text-white"
                        : "bg-gray-200"
                    }`}
                >
                  {num}
                </div>
                <span className="text-sm font-medium">
                  {num === 1
                    ? "Service"
                    : num === 2
                    ? "Provider"
                    : num === 3
                    ? "Date"
                    : "Time"}
                </span>
              </div>
            ))}
            {/* Progress line */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-queueless-primary transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="scale-in">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-100 rounded-lg h-64"
                    />
                  ))
                ) : (
                  services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={handleServiceSelect}
                    />
                  ))
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                  Select Your Provider
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => {
                        setSelectedProvider(provider.id);
                        setStep(3);
                      }}
                      className="p-6 rounded-lg hover-lift gradient-border text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-queueless-primary to-queueless-secondary flex items-center justify-center text-white text-xl font-bold">
                          {provider.name[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {provider.name}
                          </h4>
                          <p className="text-queueless-grey text-sm">
                            {provider.specialization}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                  Select Date
                </h3>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-lg shadow-lg bg-white p-4"
                    disabled={{ before: new Date() }}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-gradient">
                  Select Time
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="p-4 rounded-lg hover-lift gradient-border text-center"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep((prev) => prev - 1)}
                className="hover-lift"
              >
                Previous Step
              </Button>
            )}
            {step === 1 && <div />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookAppointment;
