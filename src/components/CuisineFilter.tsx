import { Button } from "@/components/ui/button";
import { cuisineList } from "@/config/restaurant.options.config";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  onChange: (cuisines: string[]) => void;
  selectedCuisines: string[];
  isExpanded: boolean;
  onExpandedClick: () => void;
};

const CuisineFilter = ({
  onChange,
  selectedCuisines,
  isExpanded,
  onExpandedClick,
}: Props) => {
  const handleCuisineToggle = (cuisine: string) => {
    const isSelected = selectedCuisines.includes(cuisine);
    onChange(
      isSelected
        ? selectedCuisines.filter((c) => c !== cuisine)
        : [...selectedCuisines, cuisine],
    );
  };

  const handleCuisinesReset = () => onChange([]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="text-md font-bold font-heading">
          Mutfağa Göre Filtrele
        </div>
        <button
          onClick={handleCuisinesReset}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Filtreleri Sıfırla
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {cuisineList
          .slice(0, isExpanded ? cuisineList.length : 7)
          .map((cuisine) => {
            const isSelected = selectedCuisines.includes(cuisine);
            return (
              <button
                key={cuisine}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleCuisineToggle(cuisine)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "bg-card shadow-warm hover:text-primary"
                }`}
              >
                {isSelected && <Check size={16} strokeWidth={3} />}
                {cuisine}
              </button>
            );
          })}
      </div>
      <Button onClick={onExpandedClick} variant="link" className="mt-2 flex-1">
        {isExpanded ? (
          <span className="flex flex-row items-center">
            Daha Az Göster <ChevronUp />
          </span>
        ) : (
          <span className="flex flex-row items-center">
            Daha Fazla Göster
            <ChevronDown />
          </span>
        )}
      </Button>
    </div>
  );
};

export default CuisineFilter;
