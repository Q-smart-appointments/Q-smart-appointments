
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Service } from "@/lib/api";

interface ServiceCardProps {
  service: Service;
  onSelect: (serviceId: string) => void;
}

const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  return (
    <Card className="w-full transition-all hover:scale-105 duration-300 bg-gradient-to-br from-white to-gray-50 border border-gray-100">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-queueless-primary to-queueless-secondary text-white flex items-center justify-center text-2xl shadow-lg">
            {service.icon}
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-queueless-dark to-queueless-primary bg-clip-text text-transparent">
              {service.name}
            </CardTitle>
            <CardDescription className="text-sm font-medium text-queueless-grey">
              {service.providers.length} Providers Available
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-queueless-grey text-sm leading-relaxed">
          {service.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onSelect(service.id)} 
          className="w-full bg-gradient-to-r from-queueless-primary to-queueless-secondary hover:opacity-90 transition-opacity shadow-md"
        >
          Book Appointment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
