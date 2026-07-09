import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import StarRating from "./StarRating";
import { formatCurrency } from "@/lib/utils";
import { Banknote, Clock, Dot } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};

const SearchResultCard = ({ restaurant }: Props) => {
  return (
    <Link
      to={`/detail/${restaurant._id}`}
      className="grid lg:grid-cols-[2fr_3fr] gap-4 sm:gap-5 group rounded-3xl bg-card p-3 sm:p-4 shadow-warm transition-all hover:shadow-warm-lg motion-safe:hover:-translate-y-0.5"
    >
      <div className="relative">
        <AspectRatio ratio={16 / 6}>
          <img
            src={restaurant.imageUrl}
            className="rounded-2xl w-full h-full object-cover"
          />
        </AspectRatio>
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1 text-xs font-bold">
          <Clock size={14} className="text-primary" />~
          {restaurant.estimatedDeliveryTime} dk
        </span>
      </div>
      <div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 font-heading group-hover:text-primary transition-colors">
          {restaurant.restaurantName}
        </h3>
        {!!restaurant.reviewCount && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating
              rating={Math.round(restaurant.avgRating ?? 0)}
              size={16}
            />
            <span className="text-sm text-muted-foreground">
              {(restaurant.avgRating ?? 0).toFixed(1)} ({restaurant.reviewCount}
              )
            </span>
          </div>
        )}
        <div id="card-content" className="grid md:grid-cols-2 gap-2">
          <div className="flex flex-row flex-wrap text-muted-foreground">
            {restaurant.cuisines.map((item, index) => (
              <span className="flex">
                <span>{item}</span>
                {index < restaurant.cuisines.length - 1 && <Dot />}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-col items-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 px-3 py-1 text-xs font-bold">
              <Banknote size={14} />
              Teslimat {formatCurrency(restaurant.deliveryPrice)}'den itibaren
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default SearchResultCard;
