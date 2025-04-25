
interface TimeSlotsProps {
  availableTimes: string[];
  onSelect: (time: string) => void;
}

const TimeSlots = ({ availableTimes, onSelect }: TimeSlotsProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 text-gradient">Select Time</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableTimes.map((time) => (
          <button
            key={time}
            onClick={() => onSelect(time)}
            className="p-4 rounded-lg hover-lift gradient-border text-center"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
