
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import ServiceCard from "@/components/ServiceCard";
import { useState, useEffect } from "react";
import { getServices, Service } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (serviceId: string) => {
    navigate(`/book?serviceId=${serviceId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg px-4 py-16 md:py-24 text-white">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Skip the Wait, Keep Your Schedule
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              QueueLess helps you book appointments and track your wait time in real-time.
              No more wasted hours in waiting rooms or uncertainty about when you'll be served.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-white text-queueless-primary hover:bg-gray-100"
              >
                <Link to="/book">Book an Appointment</Link>
              </Button>
              
              {!isAuthenticated && (
                <Button 
                  size="lg" 
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link to="/login">Provider Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Our Services</h2>
          <p className="text-queueless-grey text-center mb-12 max-w-2xl mx-auto">
            Book appointments for a wide range of services and skip the queue with our real-time tracking system.
          </p>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Why Choose QueueLess?</h2>
          <p className="text-queueless-grey text-center mb-12 max-w-2xl mx-auto">
            Our platform provides a seamless experience for both customers and service providers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center mb-4 text-xl">
                📆
              </div>
              <h3 className="font-semibold text-lg mb-3">Easy Booking</h3>
              <p className="text-queueless-grey">
                Browse available time slots and book appointments with just a few clicks.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center mb-4 text-xl">
                ⏱️
              </div>
              <h3 className="font-semibold text-lg mb-3">Real-Time Tracking</h3>
              <p className="text-queueless-grey">
                Track your position in the queue and get accurate wait time estimations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center mb-4 text-xl">
                🔄
              </div>
              <h3 className="font-semibold text-lg mb-3">Flexible Management</h3>
              <p className="text-queueless-grey">
                Easily reschedule or cancel appointments when your plans change.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Skip the Queue?</h2>
          <p className="text-queueless-grey mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have saved hours of their time using QueueLess.
          </p>
          
          <Button 
            size="lg" 
            asChild
            className="bg-queueless-primary hover:bg-queueless-secondary"
          >
            <Link to="/book">Book Your First Appointment</Link>
          </Button>
        </div>
      </section>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
