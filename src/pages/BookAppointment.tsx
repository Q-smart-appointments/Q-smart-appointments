
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Service, Provider, getServices } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import BookingSteps from "@/components/booking/BookingSteps";
import ProvidersList from "@/components/booking/ProvidersList";
import TimeSlots from "@/components/booking/TimeSlots";

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

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  useEffect(() => {
    const initializeBooking = async () => {
      try {
        setLoading(true);
        const servicesData = await getServices();
        setServices(servicesData);
        
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
      const providersData = await getProviders();
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
      console.log("Creating appointment...");
    }
  };

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
          <BookingSteps currentStep={step} />

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
              <ProvidersList
                providers={providers}
                onSelect={(providerId) => {
                  setSelectedProvider(providerId);
                  setStep(3);
                }}
              />
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
              <TimeSlots
                availableTimes={availableTimes}
                onSelect={handleTimeSelect}
              />
            )}
          </div>

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
