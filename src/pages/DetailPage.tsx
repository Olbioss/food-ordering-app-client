import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurant } from "@/api/RestaurantApi";
import { useGetRestaurant as useGetMyRestaurant } from "@/api/MyRestaurantApi";
import {
  useCreateReview,
  useGetMyReviewStatus,
  useGetRestaurantReviews,
  useReplyToReview,
} from "@/api/ReviewApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItemComponent from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import StarRating from "@/components/StarRating";
import { Card, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { MenuItem } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { isAuthenticated } = useAuth0();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createCheckoutSession, isLoading: isCheckoutLoading } = useCreateCheckoutSession();

  const { reviews } = useGetRestaurantReviews(restaurantId);
  const { reviewStatus } = useGetMyReviewStatus(restaurantId);
  const { createReview, isLoading: isSubmittingReview } =
    useCreateReview(restaurantId);
  const { replyToReview, isLoading: isReplying } =
    useReplyToReview(restaurantId);
  const { restaurant: myRestaurant } = useGetMyRestaurant();

  const isOwner =
    isAuthenticated && !!myRestaurant && myRestaurant._id === restaurantId;

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const addToCart = (menuItem: MenuItem) => {
    setCartItems((prevCartItems) => {
      // 1. check if item is already in cart
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id,
      );

      let updatedCartItems;

      // 2. if item is in the cart, update the quantity
      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems),
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id,
      );

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems),
      );

      return updatedCartItems;
    });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      return;
    }

    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
      },
    };


    const data = await createCheckoutSession(checkoutData);
    window.location.href = data.url;
  };

  if (isLoading || !restaurant) {
    return "Yükleniyor...";
  }

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <img
        src={restaurant.imageUrl}
        className="rounded-2xl object-cover w-full h-48 sm:h-64 md:h-80"
      />
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 lg:px-16 xl:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight font-heading">
            Menü
          </span>
          {restaurant.menuItems.map((menuItem) => (
            <MenuItemComponent
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}

          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-tight font-heading">
                Yorumlar
              </span>
              {!!restaurant.reviewCount && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(restaurant.avgRating ?? 0)} />
                  <span className="text-gray-600">
                    {(restaurant.avgRating ?? 0).toFixed(1)} (
                    {restaurant.reviewCount})
                  </span>
                </div>
              )}
            </div>

            {isAuthenticated &&
              reviewStatus?.canReview &&
              !reviewStatus?.hasReviewed && (
                <ReviewForm
                  onSubmit={(data) => createReview(data)}
                  isLoading={isSubmittingReview}
                />
              )}
            {isAuthenticated && reviewStatus?.hasReviewed && (
              <p className="text-sm text-gray-500">
                Bu restoranı değerlendirdiniz. Teşekkürler!
              </p>
            )}

            <ReviewList
              reviews={reviews ?? []}
              isOwner={isOwner}
              onReply={(reviewId, text) => replyToReview({ reviewId, text })}
              isReplying={isReplying}
            />
          </div>
        </div>

        <div className="md:sticky md:top-6 h-fit">
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckoutButton
                disabled={cartItems.length === 0}
                onCheckout={onCheckout}
                isLoading={isCheckoutLoading}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;