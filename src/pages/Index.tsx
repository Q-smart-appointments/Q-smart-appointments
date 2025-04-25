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
      <section className="relative px-4 py-20 md:py-32 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="\images\th.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Skip the Wait,<br />
              <span className="text-queueless-light">Keep Your Schedule</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              QueueLess helps you book appointments and track your wait time in real-time.
              No more wasted hours in waiting rooms or uncertainty about when you'll be served.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Button 
                size="lg" 
                asChild
                className="bg-white text-queueless-primary hover:bg-gray-100 text-lg px-8 py-6"
              >
                <Link to="/book">Book an Appointment</Link>
              </Button>
              
              {!isAuthenticated && (
                <Button 
                  size="lg" 
                  asChild
                  className="bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-6"
                >
                  <Link to="/login">Provider Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-queueless-grey text-lg max-w-2xl mx-auto">
              Book appointments for a wide range of services and skip the queue with our real-time tracking system.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose QueueLess?</h2>
            <p className="text-queueless-grey text-lg max-w-2xl mx-auto">
              Our platform provides a seamless experience for both customers and service providers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center mb-6 text-2xl">
                📆
              </div>
              <h3 className="font-semibold text-xl mb-4">Easy Booking</h3>
              <p className="text-queueless-grey text-lg">
                Browse available time slots and book appointments with just a few clicks.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center mb-6 text-2xl">
                ⏱️
              </div>
              <h3 className="font-semibold text-xl mb-4">Real-Time Tracking</h3>
              <p className="text-queueless-grey text-lg">
                Track your position in the queue and get accurate wait time estimations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center mb-6 text-2xl">
                🔄
              </div>
              <h3 className="font-semibold text-xl mb-4">Flexible Management</h3>
              <p className="text-queueless-grey text-lg">
                Easily reschedule or cancel appointments when your plans change.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-queueless-primary to-queueless-secondary text-white">
        <div className="container max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Skip the Queue?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have saved hours of their time using QueueLess.
          </p>
          
          <Button 
            size="lg" 
            asChild
            className="bg-white text-queueless-primary hover:bg-gray-100 text-lg px-8 py-6"
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
