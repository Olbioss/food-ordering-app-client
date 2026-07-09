import LoadingButton from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Restaurant } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CuisinesSection from "./CuisinesSection";
import DetailsSection from "./DetailsSection";
import ImageSection from "./ImageSection";
import MenuSection from "./MenuSection";

const formSchema = z
  .object({
    restaurantName: z.string({
      required_error: "Restoran adı gereklidir",
    }),
    city: z.string({
      required_error: "Şehir gereklidir",
    }),
    country: z.string({
      required_error: "Ülke gereklidir",
    }),
    deliveryPrice: z.coerce.number({
      required_error: "Teslimat ücreti gereklidir",
      invalid_type_error: "Geçerli bir sayı olmalıdır",
    }),
    estimatedDeliveryTime: z.coerce.number({
      required_error: "Tahmini teslimat süresi gereklidir",
      invalid_type_error: "Geçerli bir sayı olmalıdır",
    }),
    cuisines: z.array(z.string()).nonempty({
      message: "Lütfen en az bir seçenek seçin",
    }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "Ad gereklidir"),
        price: z.coerce.number().min(1, "Fiyat gereklidir"),
      }),
    ),
    imageUrl: z.string().optional(),
    imageFile: z
      .instanceof(File, { message: "Görsel gereklidir" })
      .optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Görsel URL'si veya görsel dosyası sağlanmalıdır",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
    },
  });

  useEffect(() => {
    if (!restaurant) return;

    //price lowest domination of 100
    const deliveryPriceFormatted = parseInt(
      (restaurant.deliveryPrice / 100).toFixed(2),
    );

    const menuItemsFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: parseInt((item.price / 100).toFixed(2)),
    }));

    const updatedRestaurant = {
      ...restaurant,
      deliveryPrice: deliveryPriceFormatted,
      menuItems: menuItemsFormatted,
    };

    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);

    formData.append(
      "deliveryPrice",
      (formDataJson.deliveryPrice * 100).toString(),
    );
    formData.append(
      "estimatedDeliveryTime",
      formDataJson.estimatedDeliveryTime.toString(),
    );
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(
        `menuItems[${index}][price]`,
        (menuItem.price * 100).toString(),
      );
    });

    if (formDataJson.imageFile)
      formData.append(`imageFile`, formDataJson.imageFile);

    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 rounded-3xl bg-card p-5 shadow-warm md:p-10"
      >
        <DetailsSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Gönder</Button>}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
