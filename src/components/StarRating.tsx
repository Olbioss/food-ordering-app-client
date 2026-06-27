import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

type Props = {
  rating: number;
  /** When provided, the stars become an interactive input. */
  onChange?: (rating: number) => void;
  size?: number;
  className?: string;
};

const StarRating = ({ rating, onChange, size = 20, className }: Props) => {
  const [hovered, setHovered] = useState<number>(0);
  const interactive = !!onChange;
  const active = hovered || rating;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= active
              ? "fill-orange-500 text-orange-500"
              : "fill-transparent text-gray-300",
            interactive && "cursor-pointer",
          )}
          onClick={interactive ? () => onChange(star) : undefined}
          onMouseEnter={interactive ? () => setHovered(star) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
        />
      ))}
    </div>
  );
};

export default StarRating;
