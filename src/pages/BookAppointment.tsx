import { useEffect } from "react";
import { getServices } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import BookingSteps from "@/components/booking/BookingSteps";
import ProvidersList from "@/components/booking/ProvidersList";
import TimeSlots from "@/components/booking/TimeSlots";
import { useBooking } from "@/hooks/useBooking";

const BookAppointment = () => {
  const {
    step,
    setStep,
    services,
    providers,
    loading,
    availableTimes,
    handleServiceSelect,
    handleDateSelect,
    handleTimeSelect,
  } = useBooking();

  useEffect(() => {
    const initializeBooking = async () => {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    initializeBooking();
  }, []);

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
