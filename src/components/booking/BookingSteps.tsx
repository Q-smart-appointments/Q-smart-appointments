
import { cn } from "@/lib/utils";

interface BookingStepsProps {
  currentStep: number;
}

const BookingSteps = ({ currentStep }: BookingStepsProps) => {
  const steps = [
    { number: 1, label: "Service" },
    { number: 2, label: "Provider" },
    { number: 3, label: "Date" },
    { number: 4, label: "Time" },
  ];

  return (
    <div className="flex justify-between mb-12 relative fade-up">
      {steps.map(({ number, label }) => (
        <div
          key={number}
          className={cn(
            "flex flex-col items-center relative z-10",
            number <= currentStep ? "text-queueless-primary" : "text-gray-400"
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mb-2",
              number <= currentStep
                ? "bg-queueless-primary text-white"
                : "bg-gray-200"
            )}
          >
            {number}
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10">
        <div
          className="h-full bg-queueless-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default BookingSteps;
