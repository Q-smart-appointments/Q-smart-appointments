
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Service,
  Provider,
  TimeSlot,
  getServices,
  getServiceById,
  getProvidersByService,
  getAvailableTimeSlots,
  createAppointment,
  getAppointmentById,
  updateAppointmentStatus
} from "@/lib/api";
import ServiceCard from "@/components/ServiceCard";
import { format } from "date-fns";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const serviceIdParam = searchParams.get("serviceId");
  const rescheduleParam = searchParams.get("reschedule");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step tracking for the booking process
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const servicesData = await getServices();
        setServices(servicesData);

        // If serviceId is provided in URL, pre-select that service
        if (serviceIdParam) {
          const service = servicesData.find(s => s.id === serviceIdParam);
          if (service) {
            setSelectedService(service);
            setCurrentStep(2);
            const providersData = await getProvidersByService(service.id);
            setProviders(providersData);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load services data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [serviceIdParam, toast]);

  // Handle service selection
  const handleServiceSelect = async (serviceId: string) => {
    try {
      setLoading(true);
      const service = await getServiceById(serviceId);
      if (service) {
        setSelectedService(service);
        const providersData = await getProvidersByService(serviceId);
        setProviders(providersData);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Error selecting service:", error);
      toast({
        title: "Error",
        description: "Failed to load service details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle provider selection
  const handleProviderSelect = async (provider: Provider) => {
    setSelectedProvider(provider);
    
    try {
      setLoading(true);
      const slots = await getAvailableTimeSlots(provider.id);
      
      // Extract unique dates from slots
      const uniqueDates = Array.from(
        new Set(slots.map(slot => slot.date))
      ).sort();
      
      setAvailableDates(uniqueDates);
      setTimeSlots(slots);
      setCurrentStep(3);
      
      // Auto-select the first date if available
      if (uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]);
      }
    } catch (error) {
      console.error("Error selecting provider:", error);
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setCurrentStep(4);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!user || !selectedService || !selectedProvider || !selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please complete all booking steps",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // If reschedule param exists, cancel the old appointment
      if (rescheduleParam) {
        await updateAppointmentStatus(rescheduleParam, "cancelled");
      }

      // Create the new appointment
      const newAppointment = await createAppointment({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        customerId: user.id,
        customerName: user.name,
        date: selectedTimeSlot.date,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime
      });

      toast({
        title: "Booking confirmed!",
        description: "Your appointment has been successfully booked.",
      });

      // Navigate to the customer dashboard
      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get available time slots for selected date
  const getAvailableSlotsForDate = () => {
    return timeSlots.filter(
      slot => slot.date === selectedDate && slot.isAvailable
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">
          {rescheduleParam ? "Reschedule Appointment" : "Book an Appointment"}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Booking Steps Progress */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              <h2 className="font-semibold mb-4">Booking Steps</h2>
              
              <div className="space-y-4">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-queueless-dark' : 'text-queueless-grey'}`}>
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs ${
                    currentStep > 1 ? 'bg-green-500 text-white' : 
                    currentStep === 1 ? 'bg-queueless-primary text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 1 ? '✓' : '1'}
                  </div>
                  <span className="font-medium">Select Service</span>
                </div>
                
                <div className={`flex items-center ${currentStep >= 2 ? 'text-queueless-dark' : 'text-queueless-grey'}`}>
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs ${
                    currentStep > 2 ? 'bg-green-500 text-white' : 
                    currentStep === 2 ? 'bg-queueless-primary text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 2 ? '✓' : '2'}
                  </div>
                  <span className="font-medium">Select Provider</span>
                </div>
                
                <div className={`flex items-center ${currentStep >= 3 ? 'text-queueless-dark' : 'text-queueless-grey'}`}>
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs ${
                    currentStep > 3 ? 'bg-green-500 text-white' : 
                    currentStep === 3 ? 'bg-queueless-primary text-white' : 'bg-gray-200'
                  }`}>
                    {currentStep > 3 ? '✓' : '3'}
                  </div>
                  <span className="font-medium">Select Time</span>
                </div>
                
                <div className={`flex items-center ${currentStep >= 4 ? 'text-queueless-dark' : 'text-queueless-grey'}`}>
                  <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs ${
                    currentStep === 4 ? 'bg-queueless-primary text-white' : 'bg-gray-200'
                  }`}>
                    4
                  </div>
                  <span className="font-medium">Confirm</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-2">
                {currentStep > 1 && (
                  <div className="flex items-center text-sm">
                    <span className="text-queueless-grey">Service:</span>
                    <span className="font-medium ml-2">{selectedService?.name}</span>
                  </div>
                )}
                
                {currentStep > 2 && selectedProvider && (
                  <div className="flex items-center text-sm">
                    <span className="text-queueless-grey">Provider:</span>
                    <span className="font-medium ml-2">{selectedProvider.name}</span>
                  </div>
                )}
                
                {currentStep > 3 && selectedDate && selectedTimeSlot && (
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <span className="text-queueless-grey">Date:</span>
                      <span className="font-medium ml-2">
                        {format(new Date(selectedDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-queueless-grey">Time:</span>
                      <span className="font-medium ml-2">
                        {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Booking Area */}
          <div className="flex-1">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Select a Service</h2>
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-48"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onSelect={handleServiceSelect}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Provider Selection */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-2" 
                    onClick={() => setCurrentStep(1)}
                  >
                    ← Back
                  </Button>
                  <h2 className="text-xl font-semibold">Select a Provider</h2>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-36"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {providers.map((provider) => (
                      <Card 
                        key={provider.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleProviderSelect(provider)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center text-xl">
                              👤
                            </div>
                            <div>
                              <h3 className="font-semibold">{provider.name}</h3>
                              <p className="text-sm text-queueless-grey">{provider.specialization}</p>
                              <p className="text-xs text-queueless-grey mt-1">
                                Avg. wait time: {provider.averageWaitTime} min
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Date and Time Selection */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-2" 
                    onClick={() => setCurrentStep(2)}
                  >
                    ← Back
                  </Button>
                  <h2 className="text-xl font-semibold">Select Date & Time</h2>
                </div>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Available Dates</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date) => (
                      <Button
                        key={date}
                        variant={selectedDate === date ? "default" : "outline"}
                        className={selectedDate === date ? "bg-queueless-primary hover:bg-queueless-secondary" : ""}
                        onClick={() => handleDateSelect(date)}
                      >
                        {format(new Date(date), "MMM d")}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Time Slot Selection */}
                {selectedDate && (
                  <div>
                    <h3 className="font-medium mb-3">Available Time Slots for {formatDate(selectedDate)}</h3>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {getAvailableSlotsForDate().map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                          className={`
                            ${selectedTimeSlot?.id === slot.id ? "bg-queueless-primary hover:bg-queueless-secondary" : ""}
                          `}
                          onClick={() => handleTimeSlotSelect(slot)}
                        >
                          {slot.startTime}
                        </Button>
                      ))}
                      
                      {getAvailableSlotsForDate().length === 0 && (
                        <p className="text-queueless-grey col-span-full p-4 text-center">
                          No available time slots for this date.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-2" 
                    onClick={() => setCurrentStep(3)}
                  >
                    ← Back
                  </Button>
                  <h2 className="text-xl font-semibold">Confirm Your Appointment</h2>
                </div>
                
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-queueless-grey">Service</p>
                          <p className="font-medium">{selectedService?.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-queueless-grey">Provider</p>
                          <p className="font-medium">{selectedProvider?.name}</p>
                          <p className="text-xs text-queueless-grey">{selectedProvider?.specialization}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-queueless-grey">Date & Time</p>
                          <p className="font-medium">
                            {selectedDate && formatDate(selectedDate)}
                          </p>
                          <p className="text-sm">
                            {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-queueless-grey">Estimated Wait Time</p>
                          <p className="font-medium">
                            {selectedProvider?.averageWaitTime || 15} minutes
                          </p>
                        </div>
                      </div>
                      
                      {!isAuthenticated && (
                        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mt-4">
                          <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> You're not logged in. To manage your appointment later, please{" "}
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-queueless-primary"
                              onClick={() => navigate("/login")}
                            >
                              login
                            </Button>
                            {" "}before booking.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button
                    className="bg-queueless-primary hover:bg-queueless-secondary"
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting || !isAuthenticated}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookAppointment;
