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
      className="grid lg:grid-cols-[2fr_3fr] gap-4 sm:gap-5 group rounded-2xl border bg-white p-3 sm:p-4 transition-shadow hover:shadow-md"
    >
      <AspectRatio ratio={16 / 6}>
        <img
          src={restaurant.imageUrl}
          className="rounded-xl w-full h-full object-cover"
        />
      </AspectRatio>
      <div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 group-hover:text-orange-500 transition-colors">
          {restaurant.restaurantName}
        </h3>
        {!!restaurant.reviewCount && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={Math.round(restaurant.avgRating ?? 0)} size={16} />
            <span className="text-sm text-gray-600">
              {(restaurant.avgRating ?? 0).toFixed(1)} ({restaurant.reviewCount})
            </span>
          </div>
        )}
        <div id="card-content" className="grid md:grid-cols-2 gap-2">
          <div className="flex flex-row flex-wrap">
            {restaurant.cuisines.map((item, index) => (
              <span className="flex">
                <span>{item}</span>
                {index < restaurant.cuisines.length - 1 && <Dot />}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-col">
            <div className="flex items-center gap-1 text-green-600">
              <Clock className="text-green-600" />
              {restaurant.estimatedDeliveryTime} dk
            </div>
            <div className="flex items-center gap-1">
              <Banknote />
              Teslimat {formatCurrency(restaurant.deliveryPrice)}'den itibaren
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default SearchResultCard;
