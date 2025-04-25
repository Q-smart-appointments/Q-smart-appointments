
import { Provider } from "@/lib/api";

interface ProvidersListProps {
  providers: Provider[];
  onSelect: (providerId: string) => void;
}

const ProvidersList = ({ providers, onSelect }: ProvidersListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4 text-gradient">
        Select Your Provider
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => onSelect(provider.id)}
            className="p-6 rounded-lg hover-lift gradient-border text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-queueless-primary to-queueless-secondary flex items-center justify-center text-white text-xl font-bold">
                {provider.name[0]}
              </div>
              <div>
                <h4 className="font-semibold text-lg">{provider.name}</h4>
                <p className="text-queueless-grey text-sm">
                  {provider.specialization}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProvidersList;
