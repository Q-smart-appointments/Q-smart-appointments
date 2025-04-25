
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Service } from "@/lib/api";

interface ServiceCardProps {
  service: Service;
  onSelect: (serviceId: string) => void;
}

const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-queueless-light text-queueless-primary flex items-center justify-center text-2xl">
            {service.icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
            <CardDescription className="text-sm">{service.providers.length} Providers Available</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-queueless-grey text-sm">{service.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onSelect(service.id)} 
          className="w-full bg-queueless-primary hover:bg-queueless-secondary"
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
